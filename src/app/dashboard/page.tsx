import Link from "next/link";
import Image from "next/image";
import { requireArtisanStore } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatKMF, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { buildWhatsAppLink, buildFollowUpMessage } from "@/lib/whatsapp";
import { DashboardSubnav } from "@/components/dashboard/dashboard-subnav";
import { StoreValorisationCard } from "@/components/dashboard/store-valorisation-card";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Eye,
  Plus,
  ExternalLink,
  MessageCircle,
  Settings,
  Sparkles,
  Headphones,
} from "lucide-react";

export default async function DashboardPage() {
  const { user, store } = await requireArtisanStore();

  const [products, orders, totalRevenueResult] = await Promise.all([
    prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.order.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.aggregate({
      where: {
        storeId: store.id,
        status: { in: ["CONFIRMED", "IN_PRODUCTION", "SHIPPED", "DELIVERED"] },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      {/* Top Bar Dashboard */}
      <header className="border-b border-[#0F2C4C]/10 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-white border border-[#0F2C4C]/10 flex items-center justify-center p-0.5">
                <Image
                  src="/images/komo-art-emblem.png"
                  alt="KOMO-ART"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-lg text-[#0F2C4C]">
                Atelier <span className="text-[#D96B27]">{store.name}</span>
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="rounded-full bg-[#0F2C4C]/5 px-2.5 py-0.5 text-xs font-semibold text-[#0F2C4C]">
                {store.isVerified ? "Artisan Vérifié" : "En cours de vérification"}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold flex items-center gap-1 ${
                  store.subscriptionPlan === "ENTERPRISE"
                    ? "bg-[#0F2C4C] text-[#C5A059]"
                    : store.subscriptionPlan === "PRO"
                    ? "bg-[#D96B27]/10 text-[#D96B27]"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {store.subscriptionPlan === "ENTERPRISE" ? (
                  <Headphones className="h-3 w-3" />
                ) : store.subscriptionPlan === "PRO" ? (
                  <Sparkles className="h-3 w-3" />
                ) : null}
                Forfait {store.subscriptionPlan}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/store/${store.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F2C4C]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#0F2C4C] hover:bg-[#F8F8F6]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Voir ma vitrine</span>
            </Link>
            <Link
              href="/dashboard/settings"
              title="Paramètres de la vitrine"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#0F2C4C]/20 text-[#0F2C4C] hover:bg-[#F8F8F6] transition-colors"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <LogoutButton variant="icon" />
          </div>
        </div>
      </header>

      {/* Barre d'onglets de navigation */}
      <DashboardSubnav storePlan={store.subscriptionPlan} />

      {/* Contenu principal */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* STATISTIQUES EN KMF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Chiffre d&apos;Affaires</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#0F2C4C]">
              {formatKMF(totalRevenue)}
            </div>
            <div className="text-xs text-emerald-600 font-semibold">
              Commandes confirmées & payées
            </div>
          </div>

          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Commandes en Attente</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#D96B27]">
              {pendingOrders}
            </div>
            <div className="text-xs text-[#0F2C4C]/60 font-medium">
              À confirmer sur WhatsApp
            </div>
          </div>

          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Créations Actives</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#0F2C4C]">
              {products.length}
            </div>
            <div className="text-xs text-[#0F2C4C]/60 font-medium">
              Visibles sur la marketplace
            </div>
          </div>

          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Visites Produits</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#0F2C4C]">
              {totalViews}
            </div>
            <div className="text-xs text-[#0F2C4C]/60 font-medium">
              Vues cumulées
            </div>
          </div>
        </div>

        {/* VALORISATION ET VISIBILITÉ DE L'ATELIER */}
        <StoreValorisationCard store={store} />

        {/* GESTION DES COMMANDES RÉCENTES */}
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2C4C]">
                Commandes Reçues
              </h2>
              <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
                Vérifiez les paiements Mobile Money et relancez le client sur WhatsApp en 1 clic
              </p>
            </div>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#0F2C4C]/10 text-[#0F2C4C]/50 font-bold uppercase tracking-wider">
                    <th className="pb-3">Commande</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Montant</th>
                    <th className="pb-3">Paiement / Réf.</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3 text-right">Action WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F2C4C]/5">
                  {orders.map((order) => {
                    const waFollowUp = buildWhatsAppLink(
                      order.customerPhone,
                      buildFollowUpMessage({
                        orderNumber: order.orderNumber,
                        customerName: order.customerName,
                        storeName: store.name,
                        status: order.status,
                        totalAmount: order.totalAmount,
                      })
                    );

                    return (
                      <tr key={order.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                        <td className="py-4 font-extrabold text-[#0F2C4C]">
                          #{order.orderNumber}
                          <div className="text-[11px] font-normal text-[#0F2C4C]/50">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-bold text-[#0F2C4C]">
                            {order.customerName}
                          </div>
                          <div className="text-[#0F2C4C]/60 font-medium">
                            {order.customerPhone} ({order.island})
                          </div>
                        </td>
                        <td className="py-4 font-extrabold text-[#0F2C4C]">
                          {formatKMF(order.totalAmount)}
                        </td>
                        <td className="py-4">
                          <span className="font-semibold text-[#0F2C4C]">
                            {order.paymentMethod}
                          </span>
                          {order.transactionRef && (
                            <div className="text-[11px] font-mono text-[#D96B27]">
                              Réf: {order.transactionRef}
                            </div>
                          )}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                              ORDER_STATUS_STYLES[order.status]
                            }`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <a
                            href={waFollowUp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#20ba59] transition-all"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>Relancer</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-[#0F2C4C]/60 text-xs">
              Aucune commande reçue pour le moment.
            </div>
          )}
        </div>

        {/* GESTION DU CATALOGUE PRODUITS DE L'ARTISAN */}
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2C4C]">
                Mes Créations ({products.length})
              </h2>
              <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
                Gérez vos prix, stocks et nouvelles réalisations
              </p>
            </div>
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D96B27] px-4 py-2 text-xs font-bold text-white hover:bg-[#c45c1c] shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un produit</span>
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const productImg = p.images[0] || "/images/wood-chest.jpg";
                return (
                  <div
                    key={p.id}
                    className="flex flex-col rounded-2xl border border-[#0F2C4C]/10 p-4 bg-white hover:border-[#D96B27]/40 shadow-xs hover:shadow-md transition-all space-y-3 group"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F8F8F6] border border-stone-200">
                      <Image
                        src={productImg}
                        alt={p.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 300px"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="rounded-full bg-[#0F2C4C]/85 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                          {p.category.name}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#0F2C4C] shadow-xs flex items-center gap-1">
                          <Eye className="h-3 w-3 text-[#D96B27]" />
                          {p.views}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-[#0F2C4C] truncate group-hover:text-[#D96B27] transition-colors">
                        {p.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-base font-black text-[#0F2C4C]">
                          {formatKMF(p.price)}
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.isMadeToOrder
                              ? "bg-purple-100 text-purple-700"
                              : p.stock > 0
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.isMadeToOrder ? "Sur commande" : `${p.stock} en stock`}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#0F2C4C]/10 flex items-center justify-between gap-2">
                      <Link
                        href={`/store/${store.slug}/product/${p.slug}`}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0F2C4C]/15 bg-[#F8F8F6] px-3 py-1.5 text-xs font-bold text-[#0F2C4C] hover:bg-stone-200 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[#0F2C4C]/60" />
                        <span>Fiche publique</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[#0F2C4C]/15 bg-[#F8F8F6] p-10 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D96B27]/10 text-[#D96B27]">
                <Package className="h-7 w-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-[#0F2C4C]">
                  Votre catalogue est actuellement vide
                </h3>
                <p className="text-xs text-[#0F2C4C]/70 leading-relaxed">
                  Ajoutez vos premières créations artisanales avec photos, description et prix pour commencer à recevoir des commandes et contacts WhatsApp.
                </p>
              </div>
              <div>
                <Link
                  href="/dashboard/products/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D96B27] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#b8561a] shadow-md transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publier ma Première Création</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
