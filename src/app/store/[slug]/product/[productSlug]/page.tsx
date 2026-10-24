import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/marketplace/navbar";
import { Footer } from "@/components/marketplace/footer";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { StoreCheckoutDrawer } from "@/components/store/store-checkout-drawer";
import { Badge } from "@/components/ui/badge";
import { formatKMF, formatEUR } from "@/lib/format";
import { ISLAND_LABELS } from "@/lib/constants";
import { buildWhatsAppLink, buildContactMessage } from "@/lib/whatsapp";
import {
  MapPin,
  ShieldCheck,
  MessageCircle,
  Truck,
  ArrowLeft,
  Share2,
} from "lucide-react";

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await props.params;

  const product = await prisma.product.findFirst({
    where: {
      slug: productSlug,
      store: { slug },
      isActive: true,
    },
    include: {
      category: true,
      store: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Incrémenter les vues
  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  });

  const contactWaLink = buildWhatsAppLink(
    product.store.whatsappNumber,
    buildContactMessage(product.store.name, product.title)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Fil d'Ariane */}
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#0F2C4C]/60">
            <Link href="/explore" className="hover:text-[#D96B27]">
              Marketplace
            </Link>
            <span>/</span>
            <Link href={`/store/${product.store.slug}`} className="hover:text-[#D96B27]">
              {product.store.name}
            </Link>
            <span>/</span>
            <span className="text-[#0F2C4C] truncate max-w-xs">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Galerie d'Images */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#0F2C4C]/10 shadow-lg">
                <Image
                  src={product.images[0] || "/images/wood-chest.jpg"}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.store.isVerified && (
                    <Badge variant="verified">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                      Artisan Vérifié
                    </Badge>
                  )}
                  {product.isMadeToOrder && (
                    <span className="rounded-full bg-[#0F2C4C]/90 px-3 py-1 text-xs font-bold text-white">
                      Fabriqué sur commande
                    </span>
                  )}
                </div>
              </div>

              {/* Miniatures si multiples */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-sm"
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fiche Technique & Achat */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                {product.category && (
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#D96B27]">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C4C] mt-1 leading-snug">
                  {product.title}
                </h1>

                {/* Lien Artisan */}
                <Link
                  href={`/store/${product.store.slug}`}
                  className="mt-3 flex items-center gap-2 text-xs font-bold text-[#0F2C4C]/80 hover:text-[#D96B27]"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#D96B27]" />
                  <span>
                    Atelier {product.store.name} ({product.store.city},{" "}
                    {ISLAND_LABELS[product.store.island]})
                  </span>
                </Link>
              </div>

              {/* Bloc Prix */}
              <div className="rounded-2xl bg-white p-5 border border-[#0F2C4C]/10 shadow-xs">
                <div className="text-xs font-semibold text-[#0F2C4C]/50 uppercase tracking-wider">
                  Prix de l&apos;Atelier
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-extrabold text-[#0F2C4C]">
                    {formatKMF(product.price)}
                  </span>
                  <span className="text-sm font-semibold text-[#0F2C4C]/50">
                    {formatEUR(product.price)}
                  </span>
                </div>

                <div className="mt-3 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {product.isMadeToOrder
                    ? "Fabrication artisanale sur commande"
                    : `${product.stock} pièce${product.stock > 1 ? "s" : ""} disponible${
                        product.stock > 1 ? "s" : ""
                      } de suite`}
                </div>
              </div>

              {/* Bouton Ajout Panier & Contact WhatsApp */}
              <div className="space-y-3 pt-2">
                <AddToCartButton
                  store={{
                    slug: product.store.slug,
                    name: product.store.name,
                  }}
                  product={{
                    productId: product.id,
                    slug: product.slug,
                    title: product.title,
                    price: product.price,
                    image: product.images[0] || "/images/wood-chest.jpg",
                    maxQuantity: product.isMadeToOrder ? undefined : product.stock,
                  }}
                />

                <a
                  href={contactWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#25D366] bg-[#25D366]/10 px-5 py-3 text-xs font-bold text-[#1f8b48] hover:bg-[#25D366]/20 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Poser une question à l&apos;artisan sur WhatsApp
                </a>
              </div>

              {/* Description */}
              <div className="border-t border-[#0F2C4C]/10 pt-6 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2C4C]">
                  Description & Savoir-Faire
                </h3>
                <p className="text-sm text-[#0F2C4C]/80 leading-relaxed whitespace-pre-line">
                  {product.description || "Aucune description détaillée."}
                </p>
              </div>

              {/* Modalités */}
              <div className="rounded-2xl bg-[#0F2C4C]/5 p-4 text-xs text-[#0F2C4C]/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F2C4C]">
                  <Truck className="h-4 w-4 text-[#D96B27]" />
                  <span>Livraison & Retrait en Atelier</span>
                </div>
                <p>
                  Disponible en remise en main propre à {product.store.city} ou par expédition inter-îles (Ngazidja, Ndzuwani, Mwali).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panier Flottant */}
        <StoreCheckoutDrawer store={product.store} />
      </main>

      <Footer />
    </div>
  );
}
