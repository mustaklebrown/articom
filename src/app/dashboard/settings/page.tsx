import Link from "next/link";
import Image from "next/image";
import { requireArtisanStore } from "@/lib/session";
import { StoreForm } from "@/components/dashboard/store-form";
import { DashboardSubnav } from "@/components/dashboard/dashboard-subnav";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function DashboardSettingsPage() {
  const { store } = await requireArtisanStore();

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
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/store/${store.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F2C4C]/15 px-3 py-1.5 text-xs font-bold text-[#0F2C4C] hover:bg-[#F8F8F6] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Voir ma vitrine</span>
            </Link>
          </div>
        </div>
      </header>

      <DashboardSubnav storePlan={store.subscriptionPlan} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F2C4C]">
            Paramètres de la Boutique
          </h1>
          <p className="text-xs text-[#0F2C4C]/60">
            Modifiez votre numéro WhatsApp, coordonnées Mobile Money et bio d&apos;atelier
          </p>
        </div>

        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xl">
          <StoreForm initialData={store} />
        </div>
      </div>
    </div>
  );
}
