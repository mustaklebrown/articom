import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { storeSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const currentStore = await prisma.store.findUnique({
      where: { userId: user.id },
    });

    if (!currentStore) {
      return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = storeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Si le slug change, vérifier qu'il n'est pas pris
    if (data.slug !== currentStore.slug) {
      const existingSlug = await prisma.store.findUnique({
        where: { slug: data.slug },
      });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Ce lien est déjà pris." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.store.update({
      where: { id: currentStore.id },
      data,
    });

    return NextResponse.json({ success: true, store: updated });
  } catch (error: any) {
    console.error("[STORE_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la boutique" },
      { status: 500 }
    );
  }
}
