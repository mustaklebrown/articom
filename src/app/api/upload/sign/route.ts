import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isCloudinaryConfigured, isUploadFolder, signUpload } from "@/lib/cloudinary";

/**
 * POST /api/upload/sign  { folder: "products" | "stores" | "payment-proofs" | "categories" }
 * Renvoie les paramètres signés pour un upload direct vers Cloudinary.
 * - "payment-proofs" est ouvert aux visiteurs (preuve de paiement au checkout).
 * - Les autres dossiers exigent une session.
 */
export async function POST(request: Request) {
  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      { error: "Cloudinary n'est pas configuré sur ce serveur." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { folder?: unknown } | null;
  const folder = body?.folder;
  if (!isUploadFolder(folder)) {
    return NextResponse.json({ error: "Dossier invalide" }, { status: 400 });
  }

  if (folder !== "payment-proofs") {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (folder === "categories" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }
  }

  return NextResponse.json(signUpload(folder));
}
