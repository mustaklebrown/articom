import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { CartBadge } from "@/components/marketplace/cart-badge";
import { Store, Compass, ShieldCheck, LogIn, LayoutDashboard } from "lucide-react";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#0F2C4C]/10 bg-[#F8F8F6]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Officiel KOMO-ART */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden bg-white shadow-xs group-hover:scale-105 transition-transform duration-200 border border-[#0F2C4C]/10 flex items-center justify-center p-1">
            <Image
              src="/images/komo-art-emblem.png"
              alt="KOMO-ART Logo Officiel"
              fill
              priority
              className="object-contain p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-xl text-[#0F2C4C]">
              KOMO<span className="text-[#D96B27]">-ART</span>
            </span>
            <span className="text-[10px] tracking-widest font-semibold uppercase text-[#C5A059] -mt-1">
              Les Artisans des Comores
            </span>
          </div>
        </Link>

        {/* Navigation centrale */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/explore"
            className="flex items-center gap-2 text-sm font-semibold text-[#0F2C4C]/80 hover:text-[#D96B27] transition-colors"
          >
            <Compass className="h-4 w-4 text-[#D96B27]" />
            Marketplace
          </Link>
          <Link
            href="/categories"
            className="text-sm font-semibold text-[#0F2C4C]/80 hover:text-[#D96B27] transition-colors"
          >
            Catégories
          </Link>
          <Link
            href="/explore?island=NGAZIDJA"
            className="text-sm font-semibold text-[#0F2C4C]/80 hover:text-[#D96B27] transition-colors"
          >
            Par Île
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-bold text-[#D96B27] hover:text-[#b8561a] transition-colors flex items-center gap-1.5"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[#D96B27] animate-pulse" />
            Tarifs & Abonnements
          </Link>
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-3">
          <CartBadge />

          {user ? (
            <Link
              href={user.role === "SUPER_ADMIN" ? "/admin" : user.role === "ARTISAN" ? "/dashboard" : "/dashboard"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C4C] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#183e68] shadow-sm transition-all"
            >
              <LayoutDashboard className="h-4 w-4 text-[#D96B27]" />
              <span className="hidden sm:inline">Mon Espace</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[#0F2C4C] hover:text-[#D96B27] transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Connexion
              </Link>
              <Link
                href="/register?type=artisan"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D96B27] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#c45c1c] shadow-sm hover:shadow transition-all"
              >
                <Store className="h-4 w-4" />
                Ouvrir ma boutique
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
