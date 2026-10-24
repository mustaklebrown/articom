import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSubnav } from "@/components/dashboard/admin-subnav";
import { AdminSettingsForm } from "@/components/dashboard/admin-settings-form";

export const metadata = {
  title: "Configurations & Paramètres Système | KOMO-ART Super-Admin",
  description: "Gérez les paramètres globaux de la marketplace KOMO-ART.",
};

export default async function AdminSettingsPage() {
  await requireRole("SUPER_ADMIN");

  const settingsList = await prisma.systemSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const item of settingsList) {
    settingsMap[item.key] = item.value;
  }

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
                Configurations Système
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
            Configurations & Paramètres de la Plateforme
          </h1>
          <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
            Configurez les coordonnées de règlement Mobile Money, le taux de conversion KMF, les commissions et les annonces.
          </p>
        </div>

        <AdminSettingsForm initialSettings={settingsMap} />
      </main>
    </div>
  );
}
