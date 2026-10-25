import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/marketplace/navbar";
import { Footer } from "@/components/marketplace/footer";
import { ProductCard } from "@/components/marketplace/product-card";
import { StoreCheckoutDrawer } from "@/components/store/store-checkout-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ISLAND_LABELS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";
import { buildWhatsAppLink, buildContactMessage } from "@/lib/whatsapp";
import {
  MapPin,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  Store as StoreIcon,
  Megaphone,
  Headphones,
  Sparkles,
  PhoneCall,
  Plus,
  Settings,
  Crown,
} from "lucide-react";

export default async function StorePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      },
    },
  });

  if (!store) {
    notFound();
  }

  const contactWaLink = buildWhatsAppLink(
    store.whatsappNumber,
    buildContactMessage(store.name)
  );

  const currentUser = await getCurrentUser();
  const isOwner = Boolean(
    currentUser &&
      (currentUser.id === store.userId || currentUser.role === "SUPER_ADMIN")
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6]">
      <Navbar />

      {/* BARRE D'ACTIONS GÉRANT DE L'ATELIER (Visible uniquement par l'artisan propriétaire) */}
      {isOwner && (
        <div className="bg-[#0F2C4C] text-white border-b border-[#C5A059]/40 py-2.5 px-4 sm:px-6 shadow-md">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#C5A059]/20 text-[#C5A059]">
                <Crown className="h-3.5 w-3.5" />
              </span>
              <span>
                Vous visualisez votre propre vitrine d&apos;artisan (
                <strong className="text-[#C5A059]">{store.name}</strong>)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/products/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#D96B27] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#b8561a] shadow-xs transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Ajouter une création</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Modifier Visuels (Logo & Bannière)</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-colors"
              >
                <span>Tableau de bord</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* BANDEAU PROMOTIONNEL MARKETING (Si configuré par l'artisan Pro / Entreprise) */}
      {store.promoBanner && (
        <div className="bg-[#0F2C4C] text-white py-2.5 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b border-[#D96B27]/40 shadow-xs">
          <Megaphone className="h-4 w-4 text-[#D96B27] shrink-0" />
          {store.promoBannerLink ? (
            <Link href={store.promoBannerLink} className="hover:underline">
              {store.promoBanner}
            </Link>
          ) : (
            <span>{store.promoBanner}</span>
          )}
        </div>
      )}

      <main className="flex-1 pb-16">
        {/* BANNIÈRE VITRINE */}
        <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-[#0F2C4C] overflow-hidden">
          {store.banner ? (
            <Image
              src={store.banner}
              alt={`Bannière de ${store.name}`}
              fill
              priority
              unoptimized
              className="object-cover opacity-60"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#0F2C4C] to-[#183e68]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* EN-TÊTE ARTISAN & BIO */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
          <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Logo Atelier */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden border-4 border-white bg-[#F8F8F6] shadow-md">
                  {store.logo ? (
                    <Image
                      src={store.logo}
                      alt={store.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#0F2C4C] text-white font-extrabold text-2xl">
                      {store.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C4C]">
                      {store.name}
                    </h1>
                    {store.isVerified && (
                      <Badge variant="verified">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                        Artisan Vérifié
                      </Badge>
                    )}
                    {store.subscriptionPlan === "ENTERPRISE" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0F2C4C] text-[#C5A059] px-2.5 py-0.5 text-xs font-bold shadow-xs">
                        <Headphones className="h-3 w-3" />
                        Atelier Entreprise
                      </span>
                    )}
                    {store.subscriptionPlan === "PRO" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#D96B27]/15 text-[#D96B27] px-2.5 py-0.5 text-xs font-bold">
                        <Sparkles className="h-3 w-3" />
                        Artisan Pro
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#0F2C4C]/70">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#D96B27]" />
                      {store.city}, {ISLAND_LABELS[store.island]}
                    </span>
                    <span className="text-[#0F2C4C]/30">•</span>
                    <span>{store.products.length} créations</span>
                  </div>
                </div>
              </div>

              {/* Bouton Contacter Atelier */}
              <div className="w-full sm:w-auto">
                <a
                  href={contactWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#20ba59] transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contacter l&apos;Atelier sur WhatsApp
                </a>
              </div>
            </div>

            {/* Description / Bio */}
            {store.description && (
              <p className="mt-6 border-t border-[#0F2C4C]/10 pt-4 text-sm text-[#0F2C4C]/80 leading-relaxed max-w-4xl">
                {store.description}
              </p>
            )}

            {/* Modes de règlement acceptés par cet artisan */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#0F2C4C]/70">
              <span className="text-[#0F2C4C] font-bold">Règlements acceptés :</span>
              <span className="rounded-md bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200">
                WhatsApp Direct
              </span>
              {store.huriMoney && (
                <span className="rounded-md bg-amber-50 text-amber-800 px-2 py-0.5 border border-amber-200">
                  Huri Money
                </span>
              )}
              {store.mvola && (
                <span className="rounded-md bg-orange-50 text-orange-800 px-2 py-0.5 border border-orange-200">
                  MVola
                </span>
              )}
            </div>

            {/* Assistance Télévendeur Dédié (Plan Entreprise) */}
            {(store.subscriptionPlan === "ENTERPRISE" || store.hasTelepromoter) && (
              <div className="mt-6 rounded-2xl border border-[#0F2C4C]/10 bg-[#0F2C4C]/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2C4C] text-[#C5A059] shrink-0">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F2C4C]">
                      Service Télévendeur KOMO-ART Dédié
                    </div>
                    <div className="text-[11px] text-[#0F2C4C]/70">
                      Un conseiller vous assiste par téléphone & WhatsApp pour vos commandes et expéditions diaspora.
                    </div>
                  </div>
                </div>
                {store.telepromoterPhone && (
                  <a
                    href={`https://wa.me/${store.telepromoterPhone.replace(/[^0-9]/g, "")}?text=Bonjour,%20je%20souhaite%20commander%20chez%20l'atelier%20${encodeURIComponent(store.name)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F2C4C] text-white font-bold text-xs hover:bg-[#183e68] transition-colors whitespace-nowrap self-start sm:self-center"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-[#C5A059]" />
                    Contacter le télévendeur
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CATALOGUE EXCLUSIF DE CET ARTISAN */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
          <div className="mb-6 flex items-baseline justify-between border-b border-[#0F2C4C]/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2C4C]">
                Créations de l&apos;Atelier
              </h2>
              <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
                Chaque pièce est confectionnée à la main dans le respect des traditions
              </p>
            </div>
          </div>

          {store.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    store: {
                      name: store.name,
                      slug: store.slug,
                      island: store.island,
                      city: store.city,
                      isVerified: store.isVerified,
                      whatsappNumber: store.whatsappNumber,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#0F2C4C]/20 bg-white p-12 text-center">
              <p className="text-sm text-[#0F2C4C]/60">
                Cet artisan n&apos;a pas encore publié de créations.
              </p>
            </div>
          )}
        </div>

        {/* Panier et Tunnel Hybride Flottant pour cette Boutique */}
        <StoreCheckoutDrawer store={store} />
      </main>

      <Footer />
    </div>
  );
}
