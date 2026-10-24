import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    await requireRole("SUPER_ADMIN");

    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !["SUPER_ADMIN", "ARTISAN", "CUSTOMER"].includes(role)) {
      return NextResponse.json({ error: "Rôle ou utilisateur invalide" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_ROLE_ERROR]", error);
    return NextResponse.json({ error: "Non autorisé ou erreur serveur" }, { status: 500 });
  }
}
