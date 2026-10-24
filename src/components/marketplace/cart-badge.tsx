"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartsSummary } from "@/hooks/use-cart";

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const cartsSummary = useCartsSummary();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted
    ? cartsSummary.reduce((sum, cart) => sum + cart.count, 0)
    : 0;

  // Si au moins un panier contient des articles, on cible la boutique du premier panier
  const firstStoreSlug = mounted && cartsSummary.length > 0 ? cartsSummary[0].storeSlug : null;
  const href = firstStoreSlug ? `/store/${firstStoreSlug}#panier` : "/explore";

  return (
    <Link
      href={href}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F2C4C]/15 bg-white text-[#0F2C4C] hover:border-[#D96B27] hover:text-[#D96B27] transition-all shadow-xs"
      aria-label="Panier d'achats"
    >
      <ShoppingBag className="h-5 w-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D96B27] px-1 text-[11px] font-extrabold text-white shadow-sm ring-2 ring-white animate-in zoom-in-50">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
