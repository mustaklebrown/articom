import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      storeId,
      customerName,
      customerPhone,
      customerAddress,
      customerCity,
      island,
      note,
      paymentMethod,
      transactionRef,
      paymentProofUrl,
      items,
    } = body;

    if (!storeId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier invalide ou boutique introuvable." }, { status: 400 });
    }

    // Récupération des prix réels depuis la base de données
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        storeId,
        isActive: true,
      },
    });

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { error: "Un ou plusieurs articles ne sont plus disponibles." },
        { status: 400 }
      );
    }

    // Calcul du montant total sécurisé côté serveur
    let totalAmount = 0;
    const orderItemsData = items.map((item: any) => {
      const prod = dbProducts.find((p) => p.id === item.productId)!;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      totalAmount += prod.price * quantity;
      return {
        productId: prod.id,
        quantity,
        unitPrice: prod.price,
        title: prod.title,
      };
    });

    // Génération du numéro de commande lisible (ex: KA-8492)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KA-${randomDigits}`;

    // Création de la commande en BDD
    const order = await prisma.order.create({
      data: {
        orderNumber,
        storeId,
        customerName,
        customerPhone,
        customerAddress,
        customerCity,
        island,
        note,
        totalAmount,
        paymentMethod,
        transactionRef,
        paymentProofUrl,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
        store: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("[ORDER_API_ERROR]", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la validation de la commande." },
      { status: 500 }
    );
  }
}
