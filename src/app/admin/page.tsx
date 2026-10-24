import Link from "next/link";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatKMF, formatDate } from "@/lib/format";
import { ISLAND_LABELS } from "@/lib/constants";
import {
  ShieldCheck,
  Store,
  Users,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Layers,
  Settings,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { AdminVerifyStoreButton } from "@/components/dashboard/admin-verify-button";
import { AdminToggleStoreButton } from "@/components/dashboard/admin-toggle-store-button";
import { AdminRoleSelector } from "@/components/dashboard/admin-role-selector";
import { AdminCreateCategoryForm } from "@/components/dashboard/admin-create-category";
import { AdminStorePlanSelector } from "@/components/dashboard/admin-store-plan-selector";
import { AdminSubscriptionRequests } from "@/components/dashboard/admin-subscription-requests";
import { Sparkles, Headphones } from "lucide-react";

export default async function AdminPage() {
  await requireRole("SUPER_ADMIN");

  const [stores, categories, totalOrders, users, totalRevenueResult, pendingRequests] = await Promise.all([
    prisma.store.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        _count: { select: { products: true, orders: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { store: true },
    }),
    prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { store: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { in: ["CONFIRMED", "IN_PRODUCTION", "SHIPPED", "DELIVERED"] },
      },
      _sum: { totalAmount: true },
    }),
    prisma.subscriptionRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            whatsappNumber: true,
            subscriptionPlan: true,
          },
        },
      },
    }),
  ]);

  const totalVolumeKMF = totalRevenueResult._sum.totalAmount || 0;

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      {/* Header Super-Admin */}
      <header className="border-b border-[#0F2C4C]/10 bg-[#0F2C4C] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D96B27] text-white font-extrabold text-base">
              KA
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">
                KOMO-ART <span className="text-[#C5A059]">Super-Admin</span>
              </span>
              <span className="hidden sm:inline-block ml-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#C5A059]">
                Gestion & Permissions
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              Marketplace
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* STATS GLOBALES SAAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Volume d&apos;Affaires SaaS</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F2C4C]">
              {formatKMF(totalVolumeKMF)}
            </div>
            <div className="text-xs text-emerald-600 font-semibold">
              Flux transactions ateliers
            </div>
          </div>

          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Boutiques Artisans</span>
              <Store className="h-4 w-4 text-[#D96B27]" />
            </div>
            <div className="text-2xl font-extrabold text-[#D96B27]">
              {stores.length}
            </div>
            <div className="text-xs text-[#0F2C4C]/60 font-medium">
              {stores.filter((s) => s.isVerified).length} certifiées vérifiées
            </div>
          </div>

          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Utilisateurs & Artisans</span>
              <Users className="h-4 w-4 text-[#0F2C4C]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F2C4C]">
              {users.length}
            </div>
            <div className="text-xs text-[#0F2C4C]/60 font-medium">
              Comptes gérés
            </div>
          </div>

          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase tracking-wider">
              <span>Catégories d&apos;Art</span>
              <Layers className="h-4 w-4 text-[#C5A059]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0F2C4C]">
              {categories.length}
            </div>
            <div className="text-xs text-[#0F2C4C]/60 font-medium">
              Filières artisanales
            </div>
          </div>
        </div>

        {/* NOUVEAU : DEMANDES D'ABONNEMENT EN ATTENTE (PRO, ENTREPRISE & TELEVENDEUR) */}
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D96B27]/10 text-[#D96B27] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="h-3 w-3" />
                SaaS & Abonnements Artisans
              </div>
              <h2 className="text-lg font-extrabold text-[#0F2C4C]">
                Demandes d&apos;Abonnement en Attente ({pendingRequests.length})
              </h2>
              <p className="text-xs text-[#0F2C4C]/60">
                Paiements d&apos;abonnements soumis via Huri Money, MVola ou WhatsApp Concierge
              </p>
            </div>
          </div>
          <AdminSubscriptionRequests requests={pendingRequests as any} />
        </div>

        {/* 1. GESTION DES BOUTIQUES ARTISANALES (Vérification & Suspension & Forfaits) */}
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2C4C]">
                Gestion des Boutiques & Modération des Ateliers
              </h2>
              <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
                Attribuez le badge &quot;Artisan Vérifié&quot;, gérez les forfaits (Basic, Pro, Entreprise) et suspendez en cas de litige
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#0F2C4C]/10 text-[#0F2C4C]/50 font-bold uppercase tracking-wider">
                  <th className="pb-3">Boutique</th>
                  <th className="pb-3">Artisan</th>
                  <th className="pb-3">Localisation</th>
                  <th className="pb-3">WhatsApp / Mobile Money</th>
                  <th className="pb-3">Statut & Badge</th>
                  <th className="pb-3">Forfait & Télévendeur</th>
                  <th className="pb-3 text-right">Actions Modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F2C4C]/5">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                    <td className="py-4 font-bold text-[#0F2C4C]">
                      <Link href={`/store/${s.slug}`} target="_blank" className="hover:underline flex items-center gap-1.5">
                        <span>{s.name}</span>
                      </Link>
                      <div className="text-[11px] font-normal text-[#0F2C4C]/50">
                        {s._count.products} créations • {s._count.orders} commandes
                      </div>
                    </td>
                    <td className="py-4 text-[#0F2C4C]">
                      <div className="font-semibold">{s.user.name}</div>
                      <div className="text-[11px] text-[#0F2C4C]/50">{s.user.email}</div>
                    </td>
                    <td className="py-4 font-medium text-[#0F2C4C]">
                      {s.city}, {ISLAND_LABELS[s.island]}
                    </td>
                    <td className="py-4 font-mono text-[11px] text-[#0F2C4C]/80">
                      <div>WA: {s.whatsappNumber}</div>
                      {(s.huriMoney || s.mvola) && (
                        <div className="text-[10px] text-[#D96B27]">
                          MM: {s.huriMoney || s.mvola}
                        </div>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1 items-start">
                        {s.isVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#C5A059]/15 text-[#8C6D27] px-2.5 py-0.5 font-bold">
                            <CheckCircle className="h-3 w-3" /> Artisan Vérifié
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 font-semibold">
                            Non vérifié
                          </span>
                        )}
                        {!s.isActive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
                            Boutique Suspendue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <AdminStorePlanSelector storeId={s.id} currentPlan={s.subscriptionPlan} />
                        {s.subscriptionPlan === "ENTERPRISE" && (
                          <div className="text-[10px] text-[#0F2C4C] font-bold flex items-center gap-1 bg-[#C5A059]/20 px-2 py-0.5 rounded-md">
                            <Headphones className="h-3 w-3 text-[#D96B27]" />
                            <span>{s.telepromoterName || "Télévendeur Attitré"}</span>
                          </div>
                        )}
                        {s.subscriptionPlan === "PRO" && (
                          <div className="text-[10px] text-[#D96B27] font-semibold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            <span>Marketing Actif</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <AdminVerifyStoreButton storeId={s.id} isVerified={s.isVerified} />
                        <AdminToggleStoreButton storeId={s.id} isActive={s.isActive} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. GESTION DES UTILISATEURS & PERMISSIONS (ROLES) */}
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#0F2C4C]">
              Gestion des Utilisateurs & Attribution des Rôles
            </h2>
            <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
              Promouvoir un utilisateur en SUPER_ADMIN ou ARTISAN pour autoriser l&apos;accès back-office
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#0F2C4C]/10 text-[#0F2C4C]/50 font-bold uppercase tracking-wider">
                  <th className="pb-3">Utilisateur</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Téléphone</th>
                  <th className="pb-3">Boutique liée</th>
                  <th className="pb-3 text-right">Modifier le Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F2C4C]/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                    <td className="py-4 font-bold text-[#0F2C4C]">
                      {u.name}
                    </td>
                    <td className="py-4 text-[#0F2C4C]/80 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-4 text-[#0F2C4C]/70">
                      {u.phone || "—"}
                    </td>
                    <td className="py-4 text-[#0F2C4C]">
                      {u.store ? (
                        <span className="font-semibold text-[#D96B27]">
                          {u.store.name}
                        </span>
                      ) : (
                        <span className="text-[#0F2C4C]/40">Aucune boutique</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <AdminRoleSelector userId={u.id} currentRole={u.role as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. GESTION DES CATÉGORIES ARTISANALES */}
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2C4C]">
                Gestion des Catégories de Métiers d&apos;Art
              </h2>
              <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
                Ajoutez de nouvelles filières d&apos;artisanat pour structurer la marketplace
              </p>
            </div>
            <div className="w-full sm:w-80">
              <AdminCreateCategoryForm />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F8F6] border border-[#0F2C4C]/10"
              >
                <div>
                  <div className="font-bold text-xs text-[#0F2C4C]">{c.name}</div>
                  <div className="text-[10px] text-[#0F2C4C]/50">{c._count.products} créations</div>
                </div>
                <span className="text-[10px] font-mono text-[#D96B27] bg-white px-2 py-0.5 rounded-md border border-[#0F2C4C]/10">
                  {c.slug}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
