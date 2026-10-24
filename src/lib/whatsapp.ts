import { ISLAND_LABELS, PAYMENT_METHOD_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatKMF } from "@/lib/format";
import type { Island, OrderStatus, PaymentMethod } from "@/generated/prisma/enums";

export interface WhatsAppOrderItem {
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface WhatsAppOrderPayload {
  orderNumber: string;
  storeName: string;
  items: WhatsAppOrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string | null;
  island: Island;
  paymentMethod: PaymentMethod;
  transactionRef?: string | null;
  paymentProofUrl?: string | null;
  note?: string | null;
}

/** Retire tout sauf les chiffres : wa.me attend un numéro sans "+" ni espaces. */
export function toWaNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(message)}`;
}

function itemsBlock(items: WhatsAppOrderItem[]): string {
  return items
    .map(
      (i) =>
        `• ${i.quantity} × ${i.title}\n   ${formatKMF(i.unitPrice)} / unité = *${formatKMF(i.unitPrice * i.quantity)}*`,
    )
    .join("\n");
}

function deliveryBlock(p: WhatsAppOrderPayload): string {
  const location = [p.customerAddress, p.customerCity, ISLAND_LABELS[p.island]]
    .filter(Boolean)
    .join(", ");
  return [`👤 ${p.customerName}`, `📞 ${p.customerPhone}`, `📍 ${location}`].join("\n");
}

/** Message de nouvelle commande envoyé par le client à l'artisan. */
export function buildOrderMessage(p: WhatsAppOrderPayload): string {
  const lines = [
    `🛍️ *Nouvelle commande #${p.orderNumber}*`,
    `Boutique : ${p.storeName} — via KOMO-ART`,
    "",
    "*Articles :*",
    itemsBlock(p.items),
    "",
    `💰 *Total : ${formatKMF(p.totalAmount)}*`,
    `💳 Paiement : ${PAYMENT_METHOD_LABELS[p.paymentMethod]}`,
  ];

  if (p.transactionRef) lines.push(`🔖 Réf. transaction : ${p.transactionRef}`);
  if (p.paymentProofUrl) lines.push(`🧾 Preuve : ${p.paymentProofUrl}`);

  lines.push("", "*Livraison :*", deliveryBlock(p));

  if (p.note) lines.push("", `📝 Note : ${p.note}`);

  lines.push("", "Merci de confirmer la disponibilité 🙏");
  return lines.join("\n");
}

/** Notification "paiement Mobile Money envoyé" du client vers l'artisan. */
export function buildPaymentSentMessage(p: WhatsAppOrderPayload): string {
  return [
    `✅ *Paiement envoyé — Commande #${p.orderNumber}*`,
    "",
    `J'ai effectué un transfert ${PAYMENT_METHOD_LABELS[p.paymentMethod]} de *${formatKMF(p.totalAmount)}*.`,
    p.transactionRef ? `🔖 Référence SMS : *${p.transactionRef}*` : null,
    p.paymentProofUrl ? `🧾 Capture : ${p.paymentProofUrl}` : null,
    "",
    "*Articles :*",
    itemsBlock(p.items),
    "",
    "*Livraison :*",
    deliveryBlock(p),
    "",
    "Merci de vérifier la réception 🙏",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

/** Message de relance envoyé par l'artisan au client depuis le dashboard. */
export function buildFollowUpMessage(args: {
  orderNumber: string;
  customerName: string;
  storeName: string;
  status: OrderStatus;
  totalAmount: number;
}): string {
  const firstName = args.customerName.split(" ")[0];
  return [
    `Bonjour ${firstName} 👋`,
    "",
    `Ici *${args.storeName}* (KOMO-ART) au sujet de votre commande *#${args.orderNumber}* (${formatKMF(args.totalAmount)}).`,
    `Statut actuel : *${ORDER_STATUS_LABELS[args.status]}*.`,
    "",
    "N'hésitez pas à me répondre ici si vous avez des questions. Merci pour votre confiance !",
  ].join("\n");
}

/** Message de prise de contact simple avec l'atelier. */
export function buildContactMessage(storeName: string, productTitle?: string): string {
  return productTitle
    ? `Bonjour ${storeName} 👋\nJe vous contacte via KOMO-ART au sujet de : *${productTitle}*.`
    : `Bonjour ${storeName} 👋\nJe vous contacte via KOMO-ART au sujet de vos créations.`;
}
