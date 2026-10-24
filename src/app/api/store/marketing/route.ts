import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const marketingSchema = z.object({
  promoBanner: z.string().max(250).optional().nullable(),
  promoBannerLink: z.string().max(250).optional().nullable(),
});

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { userId: user.id },
    });

    if (!store) {
      return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
    }

    if (store.subscriptionPlan === "BASIC" && !store.hasMarketingTools) {
      return NextResponse.json(
        { error: "Les outils marketing nécessitent un abonnement Pro ou Entreprise." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = marketingSchema.parse(body);

    const updated = await prisma.store.update({
      where: { id: store.id },
      data: {
        promoBanner: data.promoBanner || null,
        promoBannerLink: data.promoBannerLink || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bannière promotionnelle enregistrée avec succès !",
      store: updated,
    });
  } catch (error: any) {
    console.error("Error updating marketing banner:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour marketing" },
      { status: 400 }
    );
  }
}
