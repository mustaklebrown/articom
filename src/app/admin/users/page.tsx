import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSubnav } from "@/components/dashboard/admin-subnav";
import { LogoutButton } from "@/components/auth/logout-button";
import { AdminUsersManager } from "@/components/dashboard/admin-users-manager";

export const metadata = {
  title: "Gestion des Utilisateurs | KOMO-ART Super-Admin",
  description: "Gérez les utilisateurs, rôles, suspensions et autorisations de la plateforme KOMO-ART.",
};

export default async function AdminUsersPage() {
  const currentAdmin = await requireRole("SUPER_ADMIN");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          subscriptionPlan: true,
          isVerified: true,
          isActive: true,
          _count: { select: { products: true } },
        },
      },
      _count: { select: { orders: true } },
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
                Gestion des Utilisateurs
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F2C4C]">
            Contrôle & Modération des Utilisateurs
          </h1>
          <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
            Gérez les rôles, suspendez les comptes abusifs, vérifiez les emails et inspectez l&apos;activité des artisans et clients.
          </p>
        </div>

        <AdminUsersManager
          initialUsers={users as any}
          currentAdminEmail={currentAdmin.email}
        />
      </main>
    </div>
  );
}
