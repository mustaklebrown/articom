import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || "eu-central-1";
const BUCKET_NAME = "assets";

export const isNeonStorageConfigured = Boolean(
  endpoint && accessKeyId && secretAccessKey
);

export const s3Client = isNeonStorageConfigured
  ? new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
      forcePathStyle: true, // Requis par Neon Object Storage
    })
  : null;

/**
 * Upload direct d'un buffer ou stream vers Neon Object Storage
 */
export async function uploadToNeonStorage({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}) {
  if (!s3Client || !isNeonStorageConfigured) {
    throw new Error("Neon Object Storage n'est pas configuré (voir .env)");
  }

  const cleanKey = key.replace(/^\/+/, "");

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: cleanKey,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key: cleanKey,
    url: `/api/storage/${cleanKey}`,
  };
}

/**
 * Génère une URL pré-signée pour upload direct depuis le navigateur vers Neon
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 900 // 15 min
) {
  if (!s3Client || !isNeonStorageConfigured) {
    throw new Error("Neon Object Storage n'est pas configuré");
  }

  const cleanKey = key.replace(/^\/+/, "");
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: cleanKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return {
    uploadUrl,
    key: cleanKey,
    publicUrl: `/api/storage/${cleanKey}`,
  };
}

/**
 * Génère une URL pré-signée pour lecture sécurisée (GET)
 */
export async function getPresignedDownloadUrl(key: string, expiresIn = 3600) {
  if (!s3Client || !isNeonStorageConfigured) {
    throw new Error("Neon Object Storage n'est pas configuré");
  }

  const cleanKey = key.replace(/^\/+/, "");
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: cleanKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Supprime un objet dans Neon Object Storage
 */
export async function deleteFromNeonStorage(key: string) {
  if (!s3Client || !isNeonStorageConfigured) return;

  const cleanKey = key.replace(/^\/+/, "");
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: cleanKey,
      })
    );
  } catch (err) {
    console.error("[neon-storage] Erreur lors de la suppression:", err);
  }
}
