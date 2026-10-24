import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await requireRole("SUPER_ADMIN");
    const { storeId } = await params;
    const body = await request.json();

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
    }

    const dataToUpdate: any = {};

    if (body.subscriptionPlan !== undefined) {
      dataToUpdate.subscriptionPlan = body.subscriptionPlan;
      if (body.subscriptionPlan === "ENTERPRISE") {
        if (body.hasTelepromoter === undefined) dataToUpdate.hasTelepromoter = true;
        if (body.hasMarketingTools === undefined) dataToUpdate.hasMarketingTools = true;
        if (body.hasInternationalShipping === undefined) dataToUpdate.hasInternationalShipping = true;
      } else if (body.subscriptionPlan === "PRO") {
        if (body.hasMarketingTools === undefined) dataToUpdate.hasMarketingTools = true;
      }
    }

    if (body.hasMarketingTools !== undefined) {
      dataToUpdate.hasMarketingTools = Boolean(body.hasMarketingTools);
    }

    if (body.hasTelepromoter !== undefined) {
      dataToUpdate.hasTelepromoter = Boolean(body.hasTelepromoter);
    }

    if (body.hasInternationalShipping !== undefined) {
      dataToUpdate.hasInternationalShipping = Boolean(body.hasInternationalShipping);
    }

    if (body.telepromoterName !== undefined) {
      dataToUpdate.telepromoterName = body.telepromoterName || null;
    }

    if (body.telepromoterPhone !== undefined) {
      dataToUpdate.telepromoterPhone = body.telepromoterPhone || null;
    }

    if (body.isVerified !== undefined) {
      dataToUpdate.isVerified = Boolean(body.isVerified);
    }

    if (body.isActive !== undefined) {
      dataToUpdate.isActive = Boolean(body.isActive);
    }

    if (body.billingPeriod !== undefined) {
      dataToUpdate.billingPeriod = body.billingPeriod;
    }

    const updated = await prisma.store.update({
      where: { id: storeId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: `Fonctionnalités de l'atelier "${updated.name}" mises à jour avec succès.`,
      store: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour des fonctionnalités" },
      { status: 500 }
    );
  }
}
