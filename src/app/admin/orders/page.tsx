import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatKMF, formatDate } from "@/lib/format";
import { ISLAND_LABELS, ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { AdminSubnav } from "@/components/dashboard/admin-subnav";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  ShoppingBag,
  ExternalLink,
  Phone,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
} from "lucide-react";

export const metadata = {
  title: "Toutes les Commandes | KOMO-ART Super-Admin",
  description: "Suivi global de toutes les commandes passées sur KOMO-ART.",
};

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole("SUPER_ADMIN");
  const { status } = await props.searchParams;

  const whereClause: any = {};
  if (status && status !== "ALL") {
    whereClause.status = status;
  }

  const [orders, totalOrdersCount, totalSumResult] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        store: { select: { id: true, name: true, slug: true, island: true } },
        items: true,
      },
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
  ]);

  const totalVolume = totalSumResult._sum.totalAmount || 0;

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      {/* Header Super-Admin */}
      <header className="border-b border-[#0F2C4C]/10 bg-[#0F2C4C] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-white border border-white/20 flex items-center justify-center p-0.5">
              <Image
                src="/images/komo-art-emblem.png"
                alt="KOMO-ART"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">
                KOMO-ART <span className="text-[#C5A059]">Super-Admin</span>
              </span>
              <span className="hidden sm:inline-block ml-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#C5A059]">
                Suivi des Ventes
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <LogoutButton variant="admin" />
          </div>
        </div>
      </header>

      <AdminSubnav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F2C4C]">
              Toutes les Commandes de la Plateforme ({orders.length})
            </h1>
            <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
              Volume global des ventes : <strong className="text-[#D96B27]">{formatKMF(totalVolume)}</strong> pour {totalOrdersCount} commandes
            </p>
          </div>
        </div>

        {/* Filtres par statut */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Toutes", value: "ALL" },
            { label: "En attente", value: "PENDING" },
            { label: "Confirmée", value: "CONFIRMED" },
            { label: "En fabrication", value: "IN_PRODUCTION" },
            { label: "Expédiée", value: "SHIPPED" },
            { label: "Livrée", value: "DELIVERED" },
            { label: "Annulée", value: "CANCELLED" },
          ].map((item) => {
            const isActive = (status || "ALL") === item.value;
            return (
              <Link
                key={item.value}
                href={item.value === "ALL" ? "/admin/orders" : `/admin/orders?status=${item.value}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0F2C4C] text-white shadow-xs"
                    : "bg-white border border-[#0F2C4C]/10 text-[#0F2C4C]/70 hover:bg-[#F8F8F6]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Tableau des commandes */}
        <div className="overflow-x-auto rounded-3xl border border-[#0F2C4C]/10 bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#0F2C4C]/10 bg-[#F8F8F6] text-[#0F2C4C] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Boutique Vendeuse</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Moyen de Règlement</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F2C4C]/5">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#D96B27]">
                    {o.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/store/${o.store.slug}`}
                      target="_blank"
                      className="font-bold text-[#0F2C4C] hover:underline"
                    >
                      {o.store.name}
                    </Link>
                    <div className="text-[10px] text-[#0F2C4C]/50">
                      {ISLAND_LABELS[o.store.island]}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#0F2C4C]">
                    <div>{o.customerName}</div>
                    <div className="text-[10px] text-[#0F2C4C]/60 font-mono">{o.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-[#0F2C4C]/80">
                    <div>{o.customerCity || "Non précisé"}</div>
                    <div className="text-[10px] text-[#0F2C4C]/50">{ISLAND_LABELS[o.island]}</div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-[#0F2C4C]">
                    {formatKMF(o.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-[#0F2C4C]/80 font-medium">
                    {o.paymentMethod}
                    {o.transactionRef && (
                      <div className="text-[10px] font-mono text-[#D96B27]">
                        Ref: {o.transactionRef}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ORDER_STATUS_STYLES[o.status]
                      }`}
                    >
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#0F2C4C]/60">
                    {formatDate(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
