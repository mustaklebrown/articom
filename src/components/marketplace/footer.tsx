import Link from "next/link";
import Image from "next/image";
import { Heart, Globe2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#0F2C4C]/10 bg-[#0F2C4C] text-[#F8F8F6]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-white shadow-sm border border-white/20 p-1 flex items-center justify-center">
                <Image
                  src="/images/komo-art-emblem.png"
                  alt="KOMO-ART Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                KOMO<span className="text-[#D96B27]">-ART</span>
              </span>
            </div>
            <p className="text-sm text-[#F8F8F6]/70 leading-relaxed">
              La plateforme e-commerce multi-boutiques dédiée à la valorisation et à la vente de l&apos;artisanat authentique des Comores.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#C5A059] mb-4">
              Explorer
            </h4>
            <ul className="space-y-2 text-sm text-[#F8F8F6]/80">
              <li>
                <Link href="/explore" className="hover:text-[#D96B27] transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#D96B27] transition-colors">
                  Catégories d&apos;artisanat
                </Link>
              </li>
              <li>
                <Link href="/explore?island=NGAZIDJA" className="hover:text-[#D96B27] transition-colors">
                  Artisans de Ngazidja
                </Link>
              </li>
              <li>
                <Link href="/explore?island=NDZUWANI" className="hover:text-[#D96B27] transition-colors">
                  Artisans de Ndzuwani
                </Link>
              </li>
              <li>
                <Link href="/explore?island=MWALI" className="hover:text-[#D96B27] transition-colors">
                  Artisans de Mwali
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#C5A059] mb-4">
              Artisans & Créateurs
            </h4>
            <ul className="space-y-2 text-sm text-[#F8F8F6]/80">
              <li>
                <Link href="/pricing" className="text-[#D96B27] font-semibold hover:underline flex items-center gap-1.5">
                  Tarifs & Abonnements (Basic, Pro, Entreprise)
                </Link>
              </li>
              <li>
                <Link href="/register?type=artisan" className="hover:text-[#D96B27] transition-colors">
                  Créer ma vitrine d&apos;artisan
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#D96B27] transition-colors">
                  Espace Gestionnaire Atelier
                </Link>
              </li>
              <li>
                <span className="text-[#F8F8F6]/60 text-xs">
                  Paiements Huri Money, MVola & Service Télévendeur
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#C5A059] mb-4">
              Union des Comores
            </h4>
            <p className="text-xs text-[#F8F8F6]/70 leading-relaxed mb-3">
              Fait pour soutenir le savoir-faire local des 4 îles : Ngazidja, Ndzuwani, Mwali et Maoré.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C5A059]">
              <Globe2 className="h-4 w-4" />
              <span>Moroni, Mutsamudu, Fomboni</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F8F6]/60">
          <p>© {new Date().getFullYear()} KOMO-ART. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec fierté pour l&apos;artisanat comorien
          </p>
        </div>
      </div>
    </footer>
  );
}
