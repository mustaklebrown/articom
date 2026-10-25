import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/lib/neon-storage";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    if (!key || key.length === 0) {
      return new NextResponse("Key not provided", { status: 400 });
    }

    if (!s3Client) {
      return new NextResponse("Storage not configured", { status: 503 });
    }

    // Retirer 'assets' si passé au début
    let cleanKey = key.join("/");
    if (cleanKey.startsWith("assets/")) {
      cleanKey = cleanKey.replace(/^assets\//, "");
    }

    const command = new GetObjectCommand({
      Bucket: "assets",
      Key: cleanKey,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Transformer le Body en Web stream ou buffer
    const byteArray = await response.Body.transformToByteArray();
    const contentType = response.ContentType || "image/jpeg";

    return new NextResponse(Buffer.from(byteArray), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(byteArray.length),
      },
    });
  } catch (error: any) {
    if (error?.name === "NoSuchKey") {
      return new NextResponse("Object not found", { status: 404 });
    }
    console.error("[storage-proxy] Error fetching object:", error);
    return new NextResponse("Error reading object", { status: 500 });
  }
}
