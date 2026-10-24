import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    await requireRole("SUPER_ADMIN");

    const body = await req.json();
    const { storeId, isActive } = body;

    if (!storeId || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const updated = await prisma.store.update({
      where: { id: storeId },
      data: { isActive },
    });

    return NextResponse.json({ success: true, store: updated });
  } catch (error: any) {
    console.error("[ADMIN_TOGGLE_STORE_ERROR]", error);
    return NextResponse.json({ error: "Non autorisé ou erreur serveur" }, { status: 500 });
  }
}
