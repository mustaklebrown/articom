import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/marketplace/navbar";
import { Footer } from "@/components/marketplace/footer";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { ISLANDS } from "@/lib/constants";
import {
  Sparkles,
  ShieldCheck,
  Smartphone,
  Truck,
  ArrowRight,
  Store as StoreIcon,
  Search,
} from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, categories, storesCount, productsCount] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        store: true,
      },
    }),
    prisma.category.findMany({
      take: 8,
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.store.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2C4C] via-[#13355c] to-[#0F2C4C] text-white py-16 sm:py-24">
          <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
            <Image
              src="/images/hero-workshop.jpg"
              alt="Atelier d'artisan comorien"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#C5A059] backdrop-blur-md border border-[#C5A059]/30">
                  <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
                  La première vitrine numérique des Comores
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                  L&apos;Artisanat Comorien d&apos;Exception,{" "}
                  <span className="text-[#D96B27]">Directement chez Vous</span>
                </h1>

                <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Découvrez les coffres précieux sculptés main, le véritable Chiromani brodé, les parures en filigrane d&apos;or et les essences d&apos;Ylang-Ylang. Commandez en direct avec l&apos;artisan sur WhatsApp et réglez par Mobile Money.
                </p>

                {/* Formulaire de recherche rapide */}
                <form
                  action="/explore"
                  method="GET"
                  className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto lg:mx-0 pt-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F2C4C]/40" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Que recherchez-vous ? (ex: Chiromani, Coffre...)"
                      className="h-12 w-full rounded-xl bg-white pl-12 pr-4 text-sm font-medium text-[#0F2C4C] placeholder:text-[#0F2C4C]/40 focus:outline-none focus:ring-2 focus:ring-[#D96B27] shadow-md"
                    />
                  </div>
                  <Button type="submit" size="lg" className="shadow-lg">
                    Rechercher
                  </Button>
                </form>

                {/* Chiffres clés */}
                <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-center lg:text-left">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#C5A059]">
                      {storesCount}+
                    </div>
                    <div className="text-xs text-white/70 font-medium">Ateliers Actifs</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#D96B27]">
                      {productsCount}+
                    </div>
                    <div className="text-xs text-white/70 font-medium">Créations Uniques</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">4 Îles</div>
                    <div className="text-xs text-white/70 font-medium">Archipel Réuni</div>
                  </div>
                </div>
              </div>

              {/* Visuel Hero / Image Carte */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20">
                  <Image
                    src="/images/hero-workshop.jpg"
                    alt="Atelier d'artisan comorien"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                          Atelier en direct
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Fundi Ali Mshangama sculpte le bois noble à Moroni
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALEUR AJOUTÉE / POURQUOI KOMO-ART */}
        <section className="py-12 border-b border-[#0F2C4C]/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F8F6] border border-[#0F2C4C]/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F2C4C] text-white">
                  <ShieldCheck className="h-6 w-6 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F2C4C] mb-1">Artisans Vérifiés</h4>
                  <p className="text-xs text-[#0F2C4C]/70">
                    Chaque atelier est authentifié avec garantie du savoir-faire comorien.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F8F6] border border-[#0F2C4C]/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D96B27] text-white">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F2C4C] mb-1">Commande WhatsApp</h4>
                  <p className="text-xs text-[#0F2C4C]/70">
                    Discutez en direct avec l&apos;artisan pour personnaliser votre création.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F8F6] border border-[#0F2C4C]/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C5A059] text-white">
                  <Sparkles className="h-6 w-6 text-[#0F2C4C]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F2C4C] mb-1">Mobile Money Local</h4>
                  <p className="text-xs text-[#0F2C4C]/70">
                    Paiements faciles et rapides par Huri Money, MVola ou à la livraison.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F8F6] border border-[#0F2C4C]/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F2C4C] text-white">
                  <Truck className="h-6 w-6 text-[#D96B27]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F2C4C] mb-1">Livraison Inter-Îles</h4>
                  <p className="text-xs text-[#0F2C4C]/70">
                    Acheminement local à Moroni, Mutsamudu, Fomboni et vers la diaspora.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATÉGORIES POPULAIRES */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D96B27]">
                  Parcourir par métier
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C4C] mt-1">
                  Les Grandes Spécialités Artisanales
                </h2>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D96B27] hover:underline"
              >
                <span>Voir toutes les catégories</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const categoryImagesMap: Record<string, string> = {
                  "menuiserie-bois": "/images/cat-menuiserie-bois.jpg",
                  "couture-chiromani": "/images/cat-couture-chiromani.jpg",
                  "bijouterie": "/images/cat-bijouterie.jpg",
                  "maroquinerie": "/images/cat-maroquinerie.jpg",
                  "vannerie": "/images/cat-vannerie.jpg",
                  "decoration": "/images/cat-decoration.jpg",
                  "cosmetique-naturelle": "/images/cat-cosmetique-naturelle.jpg",
                };
                const img = categoryImagesMap[cat.slug] || "/images/cat-menuiserie-bois.jpg";

                return (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${cat.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#0F2C4C]/10 bg-white shadow-xs hover:border-[#D96B27] hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F2C4C]">
                      <Image
                        src={img}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-[11px] font-bold text-[#C5A059]">
                          {cat._count.products} créations
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <h3 className="font-bold text-xs sm:text-sm text-[#0F2C4C] group-hover:text-[#D96B27] transition-colors truncate">
                        {cat.name}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-[#0F2C4C]/30 group-hover:text-[#D96B27] group-hover:translate-x-1 transition-all shrink-0 ml-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRODUITS À LA UNE */}
        <section className="py-16 bg-white border-y border-[#0F2C4C]/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  Sélection du moment
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C4C] mt-1">
                  Dernières Créations des Ateliers
                </h2>
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D96B27] hover:underline"
              >
                <span>Explorer le catalogue complet</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION PAR ÎLE */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D96B27]">
              L&apos;Archipel des Comores
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C4C] mt-1 mb-8">
              Découvrez les Ateliers par Île
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ISLANDS.map((island) => (
                <Link
                  key={island.value}
                  href={`/explore?island=${island.value}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs hover:border-[#D96B27] hover:shadow-xl transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#C5A059]">
                      Île
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#0F2C4C]/40 group-hover:text-[#D96B27] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F2C4C] group-hover:text-[#D96B27] transition-colors mb-1">
                    {island.label}
                  </h3>
                  <p className="text-xs text-[#0F2C4C]/60 line-clamp-1">
                    {island.cities.slice(0, 3).join(", ")}...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BANNIÈRE APPEL AUX ARTISANS */}
        <section className="relative overflow-hidden bg-[#0F2C4C] text-white py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-block rounded-full bg-[#D96B27] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Vous êtes artisan ou créateur comorien ?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ouvrez Votre Propre Boutique en Ligne sur KOMO-ART
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              Vendez vos créations à travers les Comores et auprès de la diaspora. Recevez directement vos commandes sur votre WhatsApp Business et gérez vos stocks en toute simplicité.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?type=artisan">
                <Button size="lg" className="shadow-lg w-full sm:w-auto">
                  <StoreIcon className="h-5 w-5" />
                  Créer mon atelier en ligne
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Explorer d&apos;abord la marketplace
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
