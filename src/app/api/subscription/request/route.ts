import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscriptionRequestSchema = z.object({
  requestedPlan: z.enum(["BASIC", "PRO", "ENTERPRISE"]),
  billingPeriod: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
  paymentMethod: z.enum(["WHATSAPP_DIRECT", "HURI_MONEY", "MVOLA", "CASH_ON_DELIVERY"]),
  transactionRef: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
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

    const body = await req.json();
    const data = subscriptionRequestSchema.parse(body);

    // If requesting Basic, can be granted immediately
    if (data.requestedPlan === "BASIC") {
      await prisma.store.update({
        where: { id: store.id },
        data: {
          subscriptionPlan: "BASIC",
          hasMarketingTools: false,
          hasTelepromoter: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Votre forfait a été basculé vers Basic.",
      });
    }

    // Create a pending subscription request for PRO / ENTERPRISE
    const request = await prisma.subscriptionRequest.create({
      data: {
        storeId: store.id,
        requestedPlan: data.requestedPlan,
        billingPeriod: data.billingPeriod,
        paymentMethod: data.paymentMethod,
        transactionRef: data.transactionRef || null,
        notes: data.notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Demande d'abonnement enregistrée avec succès. Notre équipe va valider votre paiement rapidement !",
      request,
    });
  } catch (error: any) {
    console.error("Error creating subscription request:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la demande d'abonnement" },
      { status: 400 }
    );
  }
}
