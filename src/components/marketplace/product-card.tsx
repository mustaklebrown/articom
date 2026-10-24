import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatKMF, formatEUR } from "@/lib/format";
import { ISLAND_LABELS } from "@/lib/constants";
import { MapPin, ShieldCheck, ShoppingCart } from "lucide-react";
import type { Island } from "@/generated/prisma/enums";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    isMadeToOrder: boolean;
    stock: number;
    category?: {
      name: string;
      slug: string;
    };
    store: {
      name: string;
      slug: string;
      island: Island;
      city: string;
      isVerified: boolean;
      whatsappNumber: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || "/images/wood-chest.jpg";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#0F2C4C]/10 bg-white shadow-xs hover:shadow-xl hover:border-[#D96B27]/40 transition-all duration-300">
      {/* Image Container */}
      <Link
        href={`/store/${product.store.slug}/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-[#F8F8F6]"
      >
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges sur l'image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.store.isVerified && (
            <Badge variant="verified" className="shadow-xs backdrop-blur-xs">
              <ShieldCheck className="h-3 w-3 text-[#C5A059]" />
              Artisan Vérifié
            </Badge>
          )}
          {product.isMadeToOrder ? (
            <span className="rounded-full bg-[#0F2C4C]/85 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
              Sur commande
            </span>
          ) : product.stock <= 3 && product.stock > 0 ? (
            <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
              Plus que {product.stock} en stock
            </span>
          ) : null}
        </div>

        {/* Localisation Île */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#0F2C4C] shadow-xs backdrop-blur-xs">
            <MapPin className="h-3 w-3 text-[#D96B27]" />
            {ISLAND_LABELS[product.store.island]}
          </span>
        </div>
      </Link>

      {/* Détails Produit */}
      <div className="flex flex-1 flex-col p-5">
        {/* Catégorie & Boutique */}
        <div className="flex items-center justify-between text-xs mb-2">
          {product.category && (
            <span className="font-semibold text-[#D96B27] uppercase tracking-wider text-[11px]">
              {product.category.name}
            </span>
          )}
          <Link
            href={`/store/${product.store.slug}`}
            className="text-[#0F2C4C]/70 hover:text-[#0F2C4C] font-medium truncate max-w-[140px] hover:underline"
          >
            {product.store.name}
          </Link>
        </div>

        {/* Titre */}
        <Link
          href={`/store/${product.store.slug}/product/${product.slug}`}
          className="font-bold text-base text-[#0F2C4C] line-clamp-2 hover:text-[#D96B27] transition-colors leading-snug mb-3"
        >
          {product.title}
        </Link>

        {/* Prix & Action */}
        <div className="mt-auto pt-3 border-t border-[#0F2C4C]/5 flex items-end justify-between">
          <div>
            <div className="font-extrabold text-lg sm:text-xl text-[#0F2C4C]">
              {formatKMF(product.price)}
            </div>
            <div className="text-xs text-[#0F2C4C]/50 font-medium">
              {formatEUR(product.price)}
            </div>
          </div>

          <Link
            href={`/store/${product.store.slug}/product/${product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0F2C4C] px-3.5 text-xs font-bold text-white hover:bg-[#D96B27] shadow-xs hover:shadow transition-all gap-1.5"
          >
            <span>Voir</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
