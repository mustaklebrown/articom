import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/marketplace/navbar";
import { Footer } from "@/components/marketplace/footer";
import { ArrowRight } from "lucide-react";

// Association des visuels générés par catégorie
const CATEGORY_IMAGES: Record<string, string> = {
  "menuiserie-bois": "/images/cat-menuiserie-bois.jpg",
  "couture-chiromani": "/images/cat-couture-chiromani.jpg",
  "bijouterie": "/images/cat-bijouterie.jpg",
  "maroquinerie": "/images/cat-maroquinerie.jpg",
  "vannerie": "/images/cat-vannerie.jpg",
  "decoration": "/images/cat-decoration.jpg",
  "cosmetique-naturelle": "/images/cat-cosmetique-naturelle.jpg",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D96B27]">
              Savoir-Faire Ancestral
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2C4C] tracking-tight">
              Les Métiers d&apos;Art des Comores
            </h1>
            <p className="text-sm sm:text-base text-[#0F2C4C]/70">
              Découvrez la richesse et l&apos;authenticité de l&apos;artisanat comorien à travers ses filières traditionnelles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => {
              const imageSrc =
                CATEGORY_IMAGES[cat.slug] || "/images/cat-menuiserie-bois.jpg";

              return (
                <Link
                  key={cat.id}
                  href={`/explore?category=${cat.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#0F2C4C]/10 bg-white shadow-xs hover:border-[#D96B27] hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image Category Card */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F2C4C]">
                    <Image
                      src={imageSrc}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0F2C4C] backdrop-blur-xs">
                        {cat._count.products} {cat._count.products > 1 ? "créations" : "création"}
                      </span>
                    </div>
                  </div>

                  {/* Body Card */}
                  <div className="flex flex-1 items-center justify-between p-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D96B27]">
                        Filière Artisanale
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0F2C4C] group-hover:text-[#D96B27] transition-colors mt-0.5">
                        {cat.name}
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F8F8F6] text-[#0F2C4C] group-hover:bg-[#D96B27] group-hover:text-white transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
