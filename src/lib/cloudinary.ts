import "server-only";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const baseFolder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "komo-art";

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/** Dossiers autorisés pour l'upload (évite qu'un client écrive n'importe où). */
export const UPLOAD_FOLDERS = ["products", "stores", "payment-proofs", "categories"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export function isUploadFolder(value: unknown): value is UploadFolder {
  return typeof value === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

/**
 * Génère une signature pour un upload direct navigateur -> Cloudinary
 * (le fichier ne transite pas par notre serveur).
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
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret!);
  return {
    ...paramsToSign,
    signature,
    apiKey: apiKey!,
    cloudName: cloudName!,
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
