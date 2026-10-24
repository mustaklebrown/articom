import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { AdminSubnav } from "@/components/dashboard/admin-subnav";
import { AdminRoleSelector } from "@/components/dashboard/admin-role-selector";
import { Users, Store, ShieldCheck, UserCheck } from "lucide-react";

export const metadata = {
  title: "Gestion des Utilisateurs | KOMO-ART Super-Admin",
  description: "Gérez les utilisateurs, rôles et autorisations de la plateforme KOMO-ART.",
};

export default async function AdminUsersPage() {
  await requireRole("SUPER_ADMIN");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      store: { select: { id: true, name: true, slug: true } },
    },
  });

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
                Gestion des Rôles
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

      <AdminSubnav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F2C4C]">
            Gestion des Utilisateurs & Rôles ({users.length})
          </h1>
          <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
            Attribuez les rôles <strong>SUPER_ADMIN</strong> (gestion totale), <strong>ARTISAN</strong> (gestion vitrine et commandes) ou <strong>CUSTOMER</strong> (acheteur).
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#0F2C4C]/10 bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#0F2C4C]/10 bg-[#F8F8F6] text-[#0F2C4C] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Utilisateur</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Téléphone</th>
                <th className="py-3 px-4">Boutique Associée</th>
                <th className="py-3 px-4">Rôle & Permissions</th>
                <th className="py-3 px-4">Date d&apos;Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F2C4C]/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F2C4C]">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#0F2C4C]/80 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4 text-[#0F2C4C]/70 font-mono text-[11px]">
                    {u.phone || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    {u.store ? (
                      <Link
                        href={`/store/${u.store.slug}`}
                        target="_blank"
                        className="font-bold text-[#D96B27] hover:underline flex items-center gap-1"
                      >
                        <Store className="h-3 w-3" />
                        {u.store.name}
                      </Link>
                    ) : (
                      <span className="text-[#0F2C4C]/40 text-[11px]">Aucune boutique</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <AdminRoleSelector userId={u.id} currentRole={u.role} />
                  </td>
                  <td className="py-3.5 px-4 text-[#0F2C4C]/60 text-[11px]">
                    {formatDate(u.createdAt)}
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
