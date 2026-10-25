import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { uploadToNeonStorage, isNeonStorageConfigured } from "@/lib/neon-storage";

export async function POST(request: Request) {
  try {
    if (!isNeonStorageConfigured) {
      return NextResponse.json(
        { error: "Neon Object Storage n'est pas configuré" },
        { status: 503 }
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const uniqueKey = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const uploaded = await uploadToNeonStorage({
      key: uniqueKey,
      body: buffer,
      contentType: file.type || "application/octet-stream",
    });

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      key: uploaded.key,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'upload vers Neon Object Storage" },
      { status: 500 }
    );
  }
}
