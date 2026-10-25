import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { uploadMedia, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier image fourni" },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image (JPEG, PNG, WEBP...)" },
        { status: 400 }
      );
    }

    // Limite de taille : 10 Mo
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "L'image ne doit pas dépasser 10 Mo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadMedia({
      buffer,
      folder,
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      filename: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("[api/upload/cloudinary] Erreur:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Erreur lors du téléchargement de l'image sur Cloudinary",
      },
      { status: 500 }
    );
  }
}
