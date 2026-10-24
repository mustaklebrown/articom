import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const {
      storeId,
      title,
      slug,
      description,
      price,
      stock,
      isMadeToOrder,
      categoryId,
      images,
    } = body;

    // Vérifier que la boutique appartient bien à l'utilisateur
    const store = await prisma.store.findFirst({
      where: { id: storeId, userId: user.id },
    });

    if (!store && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Boutique non autorisée" }, { status: 403 });
    }

    const product = await prisma.product.create({
      data: {
        storeId,
        title,
        slug,
        description,
        price: Math.max(100, Number(price)),
        stock: Number(stock) || 0,
        isMadeToOrder: Boolean(isMadeToOrder),
        categoryId,
        images: images || ["/images/wood-chest.jpg"],
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("[PRODUCT_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}
