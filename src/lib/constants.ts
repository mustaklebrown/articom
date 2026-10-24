import type { Island, OrderStatus, PaymentMethod } from "@/generated/prisma/enums";

export const ISLANDS: { value: Island; label: string; cities: string[] }[] = [
  {
    value: "NGAZIDJA",
    label: "Ngazidja",
    cities: ["Moroni", "Mitsamiouli", "Mbéni", "Foumbouni", "Iconi", "Mitsoudjé", "Ntsaoueni"],
  },
  {
    value: "NDZUWANI",
    label: "Ndzuwani",
    cities: ["Mutsamudu", "Domoni", "Ouani", "Sima", "Mrémani", "Bambao Mtsanga"],
  },
  {
    value: "MWALI",
    label: "Mwali",
    cities: ["Fomboni", "Nioumachoua", "Wanani", "Djoiezi"],
  },
  {
    value: "MAORE",
    label: "Maore",
    cities: ["Mamoudzou", "Dzaoudzi", "Koungou", "Sada", "Chirongui"],
  },
];

export const ISLAND_LABELS: Record<Island, string> = {
  NGAZIDJA: "Ngazidja",
  NDZUWANI: "Ndzuwani",
  MWALI: "Mwali",
  MAORE: "Maore",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PRODUCTION: "En fabrication",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
  CONFIRMED: "bg-sky-100 text-sky-800 ring-sky-200",
  IN_PRODUCTION: "bg-violet-100 text-violet-800 ring-violet-200",
  SHIPPED: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  WHATSAPP_DIRECT: "WhatsApp direct",
  HURI_MONEY: "Huri Money",
  MVOLA: "MVola",
  CASH_ON_DELIVERY: "Paiement à la livraison",
};

export const SORT_OPTIONS = [
  { value: "recent", label: "Plus récents" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const PAGE_SIZE = 24;
