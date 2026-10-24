import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await requireRole("SUPER_ADMIN");
    const { userId } = await params;
    const body = await request.json();

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Protection compte super-admin principal
    if (targetUser.email === "admin@komo-art.km") {
      if (body.role && body.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Le rôle du compte Super-Admin principal ne peut pas être modifié." },
          { status: 403 }
        );
      }
      if (body.banned === true) {
        return NextResponse.json(
          { error: "Le compte Super-Admin principal ne peut pas être suspendu." },
          { status: 403 }
        );
      }
    }

    const dataToUpdate: any = {};
    if (body.role !== undefined) dataToUpdate.role = body.role;
    if (body.banned !== undefined) dataToUpdate.banned = Boolean(body.banned);
    if (body.banReason !== undefined) dataToUpdate.banReason = body.banReason;
    if (body.emailVerified !== undefined) dataToUpdate.emailVerified = Boolean(body.emailVerified);
    if (body.phone !== undefined) dataToUpdate.phone = body.phone;
    if (body.name !== undefined) dataToUpdate.name = body.name;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    // Si l'utilisateur est banni, on révoque immédiatement toutes ses sessions actives
    if (body.banned === true) {
      await prisma.session.deleteMany({
        where: { userId },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de la modification de l'utilisateur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await requireRole("SUPER_ADMIN");
    const { userId } = await params;

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    if (targetUser.email === "admin@komo-art.km") {
      return NextResponse.json(
        { error: "Impossible de supprimer le compte Super-Admin principal." },
        { status: 403 }
      );
    }

    if (targetUser.id === admin.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte administrateur actif." },
        { status: 403 }
      );
    }

    // Supprimer l'utilisateur (onDelete: Cascade s'occupe des sessions, accounts, store, etc.)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: `L'utilisateur ${targetUser.email} a été définitivement supprimé.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}
