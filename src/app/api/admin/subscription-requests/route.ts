import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateRequestSchema = z.object({
  requestId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
  telepromoterName: z.string().optional(),
  telepromoterPhone: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    await requireRole("SUPER_ADMIN");

    const body = await req.json();
    const data = updateRequestSchema.parse(body);

    const subscriptionRequest = await prisma.subscriptionRequest.findUnique({
      where: { id: data.requestId },
      include: { store: true },
    });

    if (!subscriptionRequest) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    if (data.status === "APPROVED") {
      // Calculate 30 days or 365 days
      const days = subscriptionRequest.billingPeriod === "YEARLY" ? 365 : 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      const isEnterprise = subscriptionRequest.requestedPlan === "ENTERPRISE";
      const isPro = subscriptionRequest.requestedPlan === "PRO";

      // Update store plan & features
      await prisma.store.update({
        where: { id: subscriptionRequest.storeId },
        data: {
          subscriptionPlan: subscriptionRequest.requestedPlan,
          billingPeriod: subscriptionRequest.billingPeriod,
          subscriptionExpiresAt: expiresAt,
          hasMarketingTools: isPro || isEnterprise,
          hasTelepromoter: isEnterprise,
          telepromoterName: isEnterprise
            ? data.telepromoterName || "Amina (Télévendeuse KOMO-ART)"
            : null,
          telepromoterPhone: isEnterprise
            ? data.telepromoterPhone || "+269 333 45 67"
            : null,
        },
      });
    }

    const updatedRequest = await prisma.subscriptionRequest.update({
      where: { id: data.requestId },
      data: { status: data.status },
    });

    return NextResponse.json({
      success: true,
      message: data.status === "APPROVED" ? "Abonnement validé et activé avec succès !" : "Demande rejetée.",
      request: updatedRequest,
    });
  } catch (error: any) {
    console.error("Error updating subscription request:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour de la demande" },
      { status: 400 }
    );
  }
}
