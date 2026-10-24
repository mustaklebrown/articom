import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/marketplace/navbar";
import { Footer } from "@/components/marketplace/footer";
import { ProductCard } from "@/components/marketplace/product-card";
import { ISLANDS, SORT_OPTIONS, type SortOption } from "@/lib/constants";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import type { Island } from "@/generated/prisma/enums";

export default async function ExplorePage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    island?: string;
    minPrice?: string;
    maxPrice?: string;
    availability?: string; // "in_stock" | "made_to_order"
    sort?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams.q?.trim() || "";
  const selectedCategory = searchParams.category || "";
  const selectedIsland = searchParams.island as Island | undefined;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const availability = searchParams.availability || "";
  const sort = (searchParams.sort as SortOption) || "recent";

  // Construction dynamique des filtres Prisma
  const where: any = {
    isActive: true,
  };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { store: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (selectedCategory) {
    where.category = { slug: selectedCategory };
  }

  if (selectedIsland) {
    where.store = { ...where.store, island: selectedIsland };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (availability === "in_stock") {
    where.stock = { gt: 0 };
    where.isMadeToOrder = false;
  } else if (availability === "made_to_order") {
    where.isMadeToOrder = true;
  }

  // Tri
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const [products, categories, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        store: true,
      },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header & Barre de recherche */}
          <div className="mb-8 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D96B27]">
                Marketplace Globale
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2C4C] mt-1">
                Explorer l&apos;Artisanat Comorien
              </h1>
              <p className="text-sm text-[#0F2C4C]/70 mt-1">
                {totalCount} {totalCount > 1 ? "créations trouvées" : "création trouvée"}
              </p>
            </div>

            {/* Barre de recherche principale */}
            <form method="GET" action="/explore" className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F2C4C]/40" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Rechercher par création ou nom d'artisan..."
                className="h-12 w-full rounded-2xl border border-[#0F2C4C]/15 bg-white pl-12 pr-4 text-sm font-medium text-[#0F2C4C] placeholder:text-[#0F2C4C]/40 focus:border-[#D96B27] focus:outline-none focus:ring-2 focus:ring-[#D96B27]/20 shadow-xs"
              />
              {/* Conservation des filtres existants dans la recherche */}
              {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
              {selectedIsland && <input type="hidden" name="island" value={selectedIsland} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* SIDEBAR DE FILTRES (Desktop + Mobile friendly) */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-[#0F2C4C]/10 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#0F2C4C]/10">
                  <div className="flex items-center gap-2 font-bold text-[#0F2C4C] text-base">
                    <Filter className="h-4 w-4 text-[#D96B27]" />
                    <span>Filtres</span>
                  </div>
                  {(query || selectedCategory || selectedIsland || minPrice || maxPrice || availability) && (
                    <Link
                      href="/explore"
                      className="text-xs font-semibold text-[#D96B27] hover:underline"
                    >
                      Réinitialiser
                    </Link>
                  )}
                </div>

                {/* Filtre : Catégories */}
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2C4C] mb-3">
                    Catégorie
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <Link
                      href={makeFilterUrl({ category: undefined, query, selectedIsland, sort, availability })}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                        !selectedCategory
                          ? "bg-[#0F2C4C] text-white"
                          : "text-[#0F2C4C]/80 hover:bg-[#F8F8F6]"
                      }`}
                    >
                      <span>Toutes</span>
                      <span>{products.length}</span>
                    </Link>
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat.slug;
                      return (
                        <Link
                          key={cat.id}
                          href={makeFilterUrl({
                            category: cat.slug,
                            query,
                            selectedIsland,
                            sort,
                            availability,
                          })}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                            isActive
                              ? "bg-[#D96B27] text-white"
                              : "text-[#0F2C4C]/80 hover:bg-[#F8F8F6]"
                          }`}
                        >
                          <span className="truncate pr-2">{cat.name}</span>
                          <span className="text-[11px] opacity-70">
                            {cat._count.products}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Filtre : Localisation / Île */}
                <div className="pt-4 border-t border-[#0F2C4C]/10">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2C4C] mb-3">
                    Île d&apos;origine
                  </h3>
                  <div className="space-y-1.5">
                    {ISLANDS.map((isl) => {
                      const isActive = selectedIsland === isl.value;
                      return (
                        <Link
                          key={isl.value}
                          href={makeFilterUrl({
                            category: selectedCategory,
                            query,
                            selectedIsland: isActive ? undefined : isl.value,
                            sort,
                            availability,
                          })}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                            isActive
                              ? "bg-[#0F2C4C] text-white"
                              : "text-[#0F2C4C]/80 hover:bg-[#F8F8F6]"
                          }`}
                        >
                          <span>{isl.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Filtre : Disponibilité */}
                <div className="pt-4 border-t border-[#0F2C4C]/10">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2C4C] mb-3">
                    Disponibilité
                  </h3>
                  <div className="space-y-1.5">
                    <Link
                      href={makeFilterUrl({
                        category: selectedCategory,
                        query,
                        selectedIsland,
                        sort,
                        availability: availability === "in_stock" ? undefined : "in_stock",
                      })}
                      className={`block py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                        availability === "in_stock"
                          ? "bg-[#D96B27] text-white"
                          : "text-[#0F2C4C]/80 hover:bg-[#F8F8F6]"
                      }`}
                    >
                      En stock immédiat
                    </Link>
                    <Link
                      href={makeFilterUrl({
                        category: selectedCategory,
                        query,
                        selectedIsland,
                        sort,
                        availability: availability === "made_to_order" ? undefined : "made_to_order",
                      })}
                      className={`block py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                        availability === "made_to_order"
                          ? "bg-[#D96B27] text-white"
                          : "text-[#0F2C4C]/80 hover:bg-[#F8F8F6]"
                      }`}
                    >
                      Sur commande (fabrication)
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* CATALOGUE PRODUITS + BARRE DE TRI */}
            <div className="lg:col-span-3 space-y-6">
              {/* Barre de tri */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white border border-[#0F2C4C]/10 p-4 shadow-xs">
                <span className="text-xs font-medium text-[#0F2C4C]/70">
                  Affichage de {products.length} résultat{products.length > 1 ? "s" : ""}
                </span>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-[#0F2C4C]/50" />
                  <span className="text-xs font-bold text-[#0F2C4C]">Trier par :</span>
                  <div className="flex items-center gap-1">
                    {SORT_OPTIONS.map((opt) => {
                      const isActive = sort === opt.value;
                      return (
                        <Link
                          key={opt.value}
                          href={makeFilterUrl({
                            category: selectedCategory,
                            query,
                            selectedIsland,
                            sort: opt.value,
                            availability,
                          })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                            isActive
                              ? "bg-[#0F2C4C] text-white"
                              : "text-[#0F2C4C]/70 hover:bg-[#F8F8F6]"
                          }`}
                        >
                          {opt.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Grille de produits */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#0F2C4C]/20 bg-white p-12 text-center space-y-4">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#F8F8F6] text-[#0F2C4C]/40">
                    <SlidersHorizontal className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F2C4C]">
                    Aucune création ne correspond à vos filtres
                  </h3>
                  <p className="text-sm text-[#0F2C4C]/60 max-w-md mx-auto">
                    Essayez d&apos;élargir vos critères ou de réinitialiser vos filtres pour découvrir d&apos;autres pièces des artisans comoriens.
                  </p>
                  <Link
                    href="/explore"
                    className="inline-flex rounded-xl bg-[#D96B27] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#c45c1c] transition-all"
                  >
                    Réinitialiser tous les filtres
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function makeFilterUrl({
  category,
  query,
  selectedIsland,
  sort,
  availability,
}: {
  category?: string;
  query?: string;
  selectedIsland?: string;
  sort?: string;
  availability?: string;
}) {
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  if (category) p.set("category", category);
  if (selectedIsland) p.set("island", selectedIsland);
  if (availability) p.set("availability", availability);
  if (sort && sort !== "recent") p.set("sort", sort);

  const qs = p.toString();
  return qs ? `/explore?${qs}` : "/explore";
}
