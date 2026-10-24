import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

export async function POST(req: Request) {
  try {
    await requireRole("SUPER_ADMIN");

    const body = await req.json();
    const { name, icon } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Nom de catégorie trop court" }, { status: 400 });
    }

    const slug = slugify(name);

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        icon: icon?.trim() || "Store",
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("[ADMIN_CREATE_CATEGORY_ERROR]", error);
    return NextResponse.json(
      { error: "Cette catégorie existe déjà ou une erreur est survenue." },
      { status: 500 }
    );
  }
}
