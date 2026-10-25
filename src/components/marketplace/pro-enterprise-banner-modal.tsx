"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Sparkles,
  Crown,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Megaphone,
  Tag,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISLAND_LABELS } from "@/lib/constants";
import type { Island, SubscriptionPlan } from "@/generated/prisma/enums";

export interface ProEnterpriseStore {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  island: Island;
  city: string;
  whatsappNumber: string;
  subscriptionPlan: SubscriptionPlan;
  hasTelepromoter: boolean;
  telepromoterName: string | null;
  telepromoterPhone: string | null;
  promoBanner: string | null;
  promoBannerLink: string | null;
  isVerified: boolean;
}

interface ProEnterpriseBannerModalProps {
  stores: ProEnterpriseStore[];
}

export function ProEnterpriseBannerModal({ stores }: ProEnterpriseBannerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé la modale pendant cette session de navigation
    const dismissed = sessionStorage.getItem("komo_pro_banner_dismissed");
    setHasCheckedStorage(true);

    if (!dismissed) {
      // Petite temporisation élégante de 1.2s après le chargement initial de la page
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Écouteur pour fermer avec la touche Echap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    sessionStorage.setItem("komo_pro_banner_dismissed", "true");
  }

  function handleReopen() {
    setIsOpen(true);
  }

  const activeStore = stores[selectedIndex] || stores[0];

  return (
    <>
      {/* BOUTON FLOTTANT PERMANENT EN BAS POUR RÉOUVRIR À TOUT MOMENT */}
      {hasCheckedStorage && (
        <button
          onClick={handleReopen}
          id="open-pro-banner-modal"
          aria-label="Vitrines et Offres Pro & Entreprise"
          className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 rounded-full bg-[#0F2C4C] px-4 py-2.5 text-xs font-extrabold text-white shadow-2xl hover:bg-[#153b66] border border-[#C5A059]/40 transition-all duration-300 hover:scale-105"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D96B27] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D96B27]"></span>
          </span>
          <Sparkles className="h-4 w-4 text-[#C5A059] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Offres Ateliers Pro & Entreprise</span>
          <span className="sm:hidden">Offres Pro</span>
        </button>
      )}

      {/* POPUP / MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-[#0F2C4C]/15 overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header / Bandeau supérieur */}
            <div className="relative bg-gradient-to-r from-[#0F2C4C] via-[#1a4066] to-[#0F2C4C] px-6 py-5 text-white">
              {/* Bouton de fermeture */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Fermer la fenêtre"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                  <Crown className="h-4 w-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                      Vitrines d&apos;Exception & Offres Bannières
                    </h2>
                    <span className="rounded-full bg-[#D96B27] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Exclusif
                    </span>
                  </div>
                  <p className="text-xs text-white/70">
                    Artisans comoriens certifiés avec abonnement Pro & Entreprise
                  </p>
                </div>
              </div>

              {/* Onglets sélecteurs si plusieurs boutiques */}
              {stores.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {stores.map((s, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedIndex(idx)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#D96B27] text-white shadow-sm scale-105"
                            : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        {s.subscriptionPlan === "ENTERPRISE" ? (
                          <Crown className="h-3 w-3 text-[#C5A059]" />
                        ) : (
                          <Sparkles className="h-3 w-3 text-amber-300" />
                        )}
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Corps de la modale */}
            <div className="p-6 space-y-5">
              {activeStore ? (
                <div className="space-y-4">
                  {/* Bannière visuelle de l'atelier */}
                  <div className="relative h-36 sm:h-44 w-full rounded-2xl overflow-hidden bg-stone-100 border border-[#0F2C4C]/10 shadow-inner">
                    <Image
                      src={activeStore.banner || "/images/hero-workshop.jpg"}
                      alt={activeStore.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Logo & badges superposés */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-white border-2 border-white shadow-md shrink-0">
                          <Image
                            src={activeStore.logo || "/images/wood-chest.jpg"}
                            alt={activeStore.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="text-white drop-shadow-md">
                          <h3 className="font-extrabold text-sm sm:text-base leading-tight flex items-center gap-1.5">
                            {activeStore.name}
                            {activeStore.isVerified && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-white/80">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3 text-[#D96B27]" />
                              {ISLAND_LABELS[activeStore.island]} ({activeStore.city})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badge abonnement */}
                      <div>
                        {activeStore.subscriptionPlan === "ENTERPRISE" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#C5A059] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#0F2C4C] shadow-sm">
                            <Crown className="h-3 w-3" />
                            Entreprise
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#D96B27] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                            <Sparkles className="h-3 w-3" />
                            Artisan Pro
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bandeau promotionnel mis en avant */}
                  {activeStore.promoBanner ? (
                    <div className="rounded-2xl border border-[#D96B27]/30 bg-gradient-to-r from-[#D96B27]/10 via-[#C5A059]/10 to-amber-50 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#D96B27] uppercase tracking-wider">
                        <Megaphone className="h-4 w-4 text-[#D96B27] shrink-0" />
                        <span>Offre Spéciale en Cours</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#0F2C4C] leading-snug">
                        {activeStore.promoBanner}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#0F2C4C]/70 italic">
                      {activeStore.description || "Créations d'artisanat comorien faites main avec passion."}
                    </p>
                  )}

                  {/* Télévendeur dédié si Entreprise */}
                  {activeStore.hasTelepromoter && (
                    <div className="rounded-xl border border-stone-200 bg-[#F8F8F6] p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#0F2C4C]">
                        <Headphones className="h-4 w-4 text-[#D96B27]" />
                        <span>
                          Télévendeur officiel :{" "}
                          <strong>{activeStore.telepromoterName || "Service Commercial KOMO-ART"}</strong>
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        WhatsApp Actif
                      </span>
                    </div>
                  )}

                  {/* Actions vers l'atelier */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <Link
                      href={`/store/${activeStore.slug}`}
                      onClick={handleClose}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2C4C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#173e68] shadow-md transition-colors"
                    >
                      <span>Découvrir la Vitrine de l&apos;Atelier</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <a
                      href={`https://wa.me/${activeStore.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Bonjour ${activeStore.name}, j'ai vu votre bannière sur la page d'accueil KOMO-ART et je souhaite commander !`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20ba59] shadow-md transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#0F2C4C]/60">
                  Aucun atelier avec bannière active pour le moment.
                </div>
              )}

              {/* ENCART DE CONVERSION POUR LES ARTISANS (UPGRADE PRO & ENTREPRISE) */}
              <div className="rounded-2xl border border-[#0F2C4C]/10 bg-gradient-to-br from-[#0F2C4C]/5 via-[#D96B27]/5 to-[#F8F8F6] p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-extrabold text-[#0F2C4C]">
                    <Sparkles className="h-3.5 w-3.5 text-[#D96B27]" />
                    <span>Vous êtes artisan ou créateur comorien ?</span>
                  </div>
                  <p className="text-[11px] text-[#0F2C4C]/70 max-w-sm">
                    Affichez votre propre vitrine et votre bannière promo ici même sur la page d&apos;accueil avec les forfaits Pro & Entreprise.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  onClick={handleClose}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#D96B27] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#b8561a] shadow-xs transition-colors"
                >
                  <span>Voir les Forfaits</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Pied de modale */}
            <div className="border-t border-[#0F2C4C]/10 bg-[#F8F8F6] px-6 py-3 flex items-center justify-between text-[11px] text-[#0F2C4C]/60">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Paiements sécurisés Huri Money & MVola
              </span>
              <button
                onClick={handleClose}
                className="font-bold text-[#0F2C4C] hover:underline"
              >
                Continuer sur le site
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
