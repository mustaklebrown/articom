import Link from "next/link";
import Image from "next/image";
import { requireArtisanStore } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardSubnav } from "@/components/dashboard/dashboard-subnav";
import { MarketingManager } from "@/components/dashboard/marketing-manager";
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "Outils Marketing | KOMO-ART",
  description: "Configurez vos bannières promotionnelles et outils marketing sur KOMO-ART.",
};

export default async function DashboardMarketingPage() {
  const { store } = await requireArtisanStore();

  const fullStore = await prisma.store.findUnique({
    where: { id: store.id },
    select: {
      id: true,
      slug: true,
      name: true,
      subscriptionPlan: true,
      hasMarketingTools: true,
      promoBanner: true,
      promoBannerLink: true,
    },
  });

  if (!fullStore) return null;

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
                Atelier <span className="text-[#D96B27]">{fullStore.name}</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/store/${fullStore.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F2C4C]/15 px-3 py-1.5 text-xs font-bold text-[#0F2C4C] hover:bg-[#F8F8F6] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Voir ma vitrine</span>
            </Link>
          </div>
        </div>
      </header>

      <DashboardSubnav storePlan={fullStore.subscriptionPlan} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MarketingManager store={fullStore as any} />
      </main>
    </div>
  );
}
