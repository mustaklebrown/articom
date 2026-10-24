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

    const body = await req.json();
    const parsed = storeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Vérifier l'unicité du slug
    const existingSlug = await prisma.store.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Ce lien de boutique est déjà réservé par un autre artisan." },
        { status: 400 }
      );
    }

    // Créer la boutique et mettre à jour le rôle de l'utilisateur en ARTISAN
    const store = await prisma.$transaction(async (tx) => {
      const createdStore = await tx.store.create({
        data: {
          ...data,
          userId: user.id,
          isVerified: false,
          isActive: true,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { role: "ARTISAN" },
      });

      return createdStore;
    });

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    console.error("[STORE_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la boutique" },
      { status: 500 }
    );
  }
}
