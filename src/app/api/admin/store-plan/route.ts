import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const storePlanSchema = z.object({
  storeId: z.string(),
  plan: z.enum(["BASIC", "PRO", "ENTERPRISE"]),
  telepromoterName: z.string().optional(),
  telepromoterPhone: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    await requireRole("SUPER_ADMIN");

    const body = await req.json();
    const data = storePlanSchema.parse(body);

    const isEnterprise = data.plan === "ENTERPRISE";
    const isPro = data.plan === "PRO";

    const store = await prisma.store.update({
      where: { id: data.storeId },
      data: {
        subscriptionPlan: data.plan,
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

    return NextResponse.json({
      success: true,
      message: `Forfait mis à jour vers ${data.plan}`,
      store,
    });
  } catch (error: any) {
    console.error("Error setting store plan:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la modification du forfait" },
      { status: 400 }
    );
  }
}
