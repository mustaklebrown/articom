"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Sparkles,
  Crown,
  Share2,
  Copy,
  ExternalLink,
  Plus,
  Settings,
  Megaphone,
  Check,
  MessageCircle,
  Headphones,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreValorisationCardProps {
  store: {
    id: string;
    name: string;
    slug: string;
    subscriptionPlan: "BASIC" | "PRO" | "ENTERPRISE";
    promoBanner: string | null;
    isVerified: boolean;
  };
}

export function StoreValorisationCard({ store }: StoreValorisationCardProps) {
  const [copied, setCopied] = useState(false);

  const isProOrEnterprise =
    store.subscriptionPlan === "PRO" || store.subscriptionPlan === "ENTERPRISE";

  function handleCopyLink() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://komo-art.km";
    const storeUrl = `${origin}/store/${store.slug}`;

    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast.success("Lien de votre vitrine copié dans le presse-papier !");
    setTimeout(() => setCopied(false), 2500);
  }

  function handleShareWhatsApp() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://komo-art.km";
    const storeUrl = `${origin}/store/${store.slug}`;
    const text = encodeURIComponent(
      `Salam ! Venez découvrir les créations artisanales authentiques de mon atelier "${store.name}" sur la marketplace KOMO-ART : ${storeUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0F2C4C]/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D96B27]/10 text-[#D96B27] text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Visibilité & Valorisation de l&apos;Atelier
          </div>
          <h2 className="text-xl font-extrabold text-[#0F2C4C]">
            Faites Rayonner votre Savoir-Faire
          </h2>
          <p className="text-xs text-[#0F2C4C]/60">
            Augmentez votre visibilité sur la page d&apos;accueil, diffusez votre vitrine sur WhatsApp et développez votre clientèle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D96B27] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b8561a] shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter une création</span>
          </Link>
          <Link
            href={`/store/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F2C4C]/20 bg-white px-3.5 py-2.5 text-xs font-bold text-[#0F2C4C] hover:bg-[#F8F8F6] transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Voir ma vitrine</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BLOC 1 : MISE EN AVANT PAGE D'ACCUEIL & FORFAIT */}
        <div className="lg:col-span-7 rounded-2xl border border-[#0F2C4C]/10 bg-gradient-to-br from-[#0F2C4C]/5 via-white to-[#F8F8F6] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F2C4C] text-[#C5A059]">
                <Crown className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-[#0F2C4C]">
                  Bannière Publicitaire Page d&apos;Accueil
                </h3>
                <span className="text-[11px] text-[#0F2C4C]/60">
                  Affichage dans la modale & vitrines en vedette
                </span>
              </div>
            </div>

            <div>
              {store.subscriptionPlan === "ENTERPRISE" ? (
                <span className="rounded-full bg-[#0F2C4C] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#C5A059]">
                  Forfait Entreprise
                </span>
              ) : store.subscriptionPlan === "PRO" ? (
                <span className="rounded-full bg-[#D96B27] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Forfait Pro
                </span>
              ) : (
                <span className="rounded-full bg-stone-200 px-3 py-1 text-[10px] font-bold text-stone-700">
                  Forfait Basic (Gratuit)
                </span>
              )}
            </div>
          </div>

          {isProOrEnterprise ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#0F2C4C]/10 space-y-1">
                <div className="text-[11px] font-bold text-[#D96B27] flex items-center gap-1.5 uppercase tracking-wide">
                  <Megaphone className="h-3.5 w-3.5" />
                  Bandeau d&apos;annonce actuellement actif
                </div>
                <p className="text-xs text-[#0F2C4C] font-semibold">
                  {store.promoBanner || "Aucune annonce active. Cliquez ci-dessous pour en ajouter une !"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href="/dashboard/marketing"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2C4C] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1a416b] transition-colors"
                >
                  <Megaphone className="h-3.5 w-3.5 text-[#D96B27]" />
                  <span>Modifier mon annonce promo</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F2C4C]/20 bg-white px-3 py-2 text-xs font-bold text-[#0F2C4C] hover:bg-[#F8F8F6] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Voir en Page d&apos;Accueil</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#0F2C4C]/70 leading-relaxed">
                Passez au <strong>Forfait Pro (15 000 KMF/mois)</strong> ou <strong>Entreprise</strong> pour afficher automatiquement votre bannière promotionnelle en tête de la page d&apos;accueil, débloquer le télévendeur dédié et multiplier vos contacts WhatsApp.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#D96B27] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#b8561a] shadow-xs transition-colors"
                >
                  <span>Passer au Forfait Pro / Entreprise</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/dashboard/marketing"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0F2C4C]/20 bg-white px-3 py-2 text-xs font-bold text-[#0F2C4C] hover:bg-[#F8F8F6] transition-colors"
                >
                  <span>Tester les Outils Marketing</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* BLOC 2 : PARTAGE & DIFFUSION RAPIDE DE LA VITRINE */}
        <div className="lg:col-span-5 rounded-2xl border border-[#0F2C4C]/10 bg-white p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                <Share2 className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-[#0F2C4C]">
                  Partager ma Boutique
                </h3>
                <span className="text-[11px] text-[#0F2C4C]/60">
                  Diffusez vos créations à vos clients
                </span>
              </div>
            </div>

            <p className="text-xs text-[#0F2C4C]/70 leading-relaxed">
              Envoyez le lien de votre vitrine directement dans vos groupes WhatsApp, statut ou réseaux sociaux.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleShareWhatsApp}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20ba59] shadow-xs transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Partager sur WhatsApp (1 clic)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F2C4C]/20 bg-[#F8F8F6] px-3 py-2 text-xs font-bold text-[#0F2C4C] hover:bg-stone-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Lien copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#0F2C4C]/70" />
                    <span>Copier le lien public</span>
                  </>
                )}
              </button>

              <Link
                href="/dashboard/settings"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0F2C4C]/20 bg-[#F8F8F6] px-3 py-2 text-xs font-bold text-[#0F2C4C] hover:bg-stone-200 transition-colors"
                title="Modifier Logo et Bannière"
              >
                <Settings className="h-3.5 w-3.5 text-[#0F2C4C]/70" />
                <span>Visuel</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
