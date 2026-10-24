import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsUpdateSchema = z.record(z.string(), z.string());

export async function GET() {
  try {
    await requireRole("SUPER_ADMIN");
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Non autorisé" }, { status: 403 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireRole("SUPER_ADMIN");

    const body = await req.json();
    const data = settingsUpdateSchema.parse(body);

    const updatePromises = Object.entries(data).map(([key, value]) =>
      prisma.systemSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Paramètres de la plateforme mis à jour avec succès !",
    });
  } catch (error: any) {
    console.error("Error updating system settings:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'enregistrement des paramètres" },
      { status: 400 }
    );
  }
}
