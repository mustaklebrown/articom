import { v2 as cloudinary } from "cloudinary";
import { uploadToNeonStorage, isNeonStorageConfigured } from "./neon-storage";
import { prisma } from "./prisma";

export async function getCloudinaryConfig() {
  let cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;
  let baseFolder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "KOMO-ART";

  // Si des variables manquent dans .env, chercher dans SystemSetting (Base de données)
  if (!cloudName || !apiKey || !apiSecret) {
    try {
      const dbSettings = await prisma.systemSetting.findMany({
        where: {
          key: {
            in: [
              "CLOUDINARY_CLOUD_NAME",
              "CLOUDINARY_API_KEY",
              "CLOUDINARY_API_SECRET",
              "CLOUDINARY_UPLOAD_FOLDER",
            ],
          },
        },
      });

      for (const s of dbSettings) {
        if (s.key === "CLOUDINARY_CLOUD_NAME" && s.value) cloudName = s.value;
        if (s.key === "CLOUDINARY_API_KEY" && s.value) apiKey = s.value;
        if (s.key === "CLOUDINARY_API_SECRET" && s.value) apiSecret = s.value;
        if (s.key === "CLOUDINARY_UPLOAD_FOLDER" && s.value) baseFolder = s.value;
      }
    } catch {
      // Ignorer si la DB n'est pas encore prête
    }
  }

  const isConfigured = Boolean(cloudName && apiKey && apiSecret);

  if (isConfigured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    baseFolder,
    isConfigured,
  };
}

const envCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME;
const envApiKey = process.env.CLOUDINARY_API_KEY;
const envApiSecret = process.env.CLOUDINARY_API_SECRET;
const baseFolder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "KOMO-ART";

export const isCloudinaryConfigured = Boolean(
  envCloudName && envApiKey && envApiSecret
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: envCloudName,
    api_key: envApiKey,
    api_secret: envApiSecret,
    secure: true,
  });
}

/** Dossiers autorisés pour l'upload (évite qu'un client écrive n'importe où). */
export const UPLOAD_FOLDERS = [
  "products",
  "stores",
  "payment-proofs",
  "categories",
  "banners",
] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export function isUploadFolder(value: unknown): value is UploadFolder {
  return (
    typeof value === "string" &&
    (UPLOAD_FOLDERS as readonly string[]).includes(value)
  );
}

/**
 * Upload direct côté serveur vers Cloudinary via Buffer.
 */
export async function uploadToCloudinary({
  buffer,
  folder = "products",
  publicId,
}: {
  buffer: Buffer;
  folder?: string;
  publicId?: string;
}): Promise<{ url: string; secureUrl: string; publicId: string; format: string }> {
  const config = await getCloudinaryConfig();

  if (!config.isConfigured) {
    throw new Error(
      "Cloudinary n'est pas configuré. Veuillez renseigner le Cloud Name, API Key et API Secret dans .env ou dans les Paramètres Administrateur."
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${config.baseFolder}/${folder}`,
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            error || new Error("Erreur inconnue lors de l'upload Cloudinary")
          );
        }
        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload unifié intelligent :
 * Tente d'abord Cloudinary si configuré, sinon bascule automatiquement sur Neon Object Storage.
 */
export async function uploadMedia({
  buffer,
  folder = "products",
  filename,
  contentType = "image/jpeg",
}: {
  buffer: Buffer;
  folder?: string;
  filename?: string;
  contentType?: string;
}): Promise<{ url: string; provider: "cloudinary" | "neon" }> {
  const config = await getCloudinaryConfig();

  if (config.isConfigured) {
    try {
      const res = await uploadToCloudinary({ buffer, folder });
      return { url: res.secureUrl, provider: "cloudinary" };
    } catch (err) {
      console.warn(
        "[uploadMedia] Échec Cloudinary, tentative Neon Storage en repli...",
        err
      );
    }
  }

  if (isNeonStorageConfigured) {
    const ext = filename?.split(".").pop() || "jpg";
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const neonRes = await uploadToNeonStorage({
      key,
      body: buffer,
      contentType,
    });
    return { url: neonRes.url, provider: "neon" };
  }

  throw new Error(
    "Aucun service de stockage de médias n'est configuré (configurez Cloudinary ou Neon Object Storage dans .env)."
  );
}

/**
 * Génère une signature pour un upload direct navigateur -> Cloudinary.
 */
export function signUpload(folder: UploadFolder) {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary n'est pas configuré (voir .env)");
  }
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    folder: `${baseFolder}/${folder}`,
  };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, envApiSecret!);
  return {
    ...paramsToSign,
    signature,
    apiKey: envApiKey!,
    cloudName: envCloudName!,
  };
}

/** Extrait le public_id d'une URL Cloudinary (pour suppression). */
export function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
  return match?.[1] ?? null;
}

export async function deleteImageByUrl(url: string) {
  if (!isCloudinaryConfigured) return;
  const publicId = publicIdFromUrl(url);
  if (!publicId || !url.includes("res.cloudinary.com")) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[cloudinary] suppression échouée", error);
  }
}

/** URL optimisée (format/qualité auto + redimensionnement). */
export function optimizedUrl(url: string, width = 800): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
