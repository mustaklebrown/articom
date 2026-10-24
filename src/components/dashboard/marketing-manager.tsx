"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Sparkles,
  Lock,
  ArrowRight,
  Eye,
  CheckCircle,
  ExternalLink,
  Save,
} from "lucide-react";

interface MarketingManagerProps {
  store: {
    id: string;
    slug: string;
    name: string;
    subscriptionPlan: "BASIC" | "PRO" | "ENTERPRISE";
    hasMarketingTools: boolean;
    promoBanner: string | null;
    promoBannerLink: string | null;
  };
}

export function MarketingManager({ store }: MarketingManagerProps) {
  const router = useRouter();
  const isUnlocked = store.subscriptionPlan === "PRO" || store.subscriptionPlan === "ENTERPRISE" || store.hasMarketingTools;

  const [promoBanner, setPromoBanner] = useState(store.promoBanner || "");
  const [promoBannerLink, setPromoBannerLink] = useState(store.promoBannerLink || "");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/store/marketing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoBanner: promoBanner.trim() || null,
          promoBannerLink: promoBannerLink.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur de sauvegarde");
      }

      toast.success(data.message || "Bannière enregistrée !");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Impossible de sauvegarder");
    } finally {
      setLoading(false);
    }
  }

  if (!isUnlocked) {
    return (
      <div className="space-y-8">
        {/* Banner verrouillé */}
        <div className="rounded-3xl border border-[#D96B27]/20 bg-gradient-to-br from-[#D96B27]/10 via-white to-[#F8F8F6] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D96B27]/20 text-[#D96B27] mx-auto">
            <Lock className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#0F2C4C]">
              Les Outils Marketing sont réservés aux Forfaits Pro & Entreprise
            </h2>
            <p className="text-sm text-[#0F2C4C]/70 max-w-lg mx-auto leading-relaxed">
              Passez au Forfait Pro pour afficher un bandeau d&apos;annonces au sommet de votre vitrine, mettre en avant vos promotions et booster votre visibilité sur toute la marketplace KOMO-ART.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-[#0F2C4C]/10 text-xs space-y-1">
              <Megaphone className="h-4 w-4 text-[#D96B27]" />
              <div className="font-bold text-[#0F2C4C]">Bannières Flash</div>
              <div className="text-[11px] text-[#0F2C4C]/60">Annoncez vos promotions et réductions</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#0F2C4C]/10 text-xs space-y-1">
              <Sparkles className="h-4 w-4 text-[#D96B27]" />
              <div className="font-bold text-[#0F2C4C]">Mise en Avant</div>
              <div className="text-[11px] text-[#0F2C4C]/60">Apparaissez en tête de recherche</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#0F2C4C]/10 text-xs space-y-1">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <div className="font-bold text-[#0F2C4C]">Badge Artisan Pro</div>
              <div className="text-[11px] text-[#0F2C4C]/60">Gagnez la confiance des acheteurs</div>
            </div>
          </div>

          <div>
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D96B27] px-6 py-3 text-sm font-bold text-white hover:bg-[#b8561a] shadow-md transition-colors"
            >
              <span>Débloquer le Forfait Pro (15 000 KMF/mois)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D96B27]/10 text-[#D96B27] text-[10px] font-extrabold uppercase tracking-wider mb-1">
          <Sparkles className="h-3 w-3" />
          Outils Marketing Actifs
        </div>
        <h2 className="text-2xl font-extrabold text-[#0F2C4C]">
          Bannière Promotionnelle & Annonces Vitrine
        </h2>
        <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
          Ce message apparaîtra en haut de votre boutique publique pour attirer l&apos;attention de vos visiteurs.
        </p>
      </div>

      {/* Aperçu en direct */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0F2C4C]/60 flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-[#D96B27]" />
          Aperçu en direct sur votre vitrine
        </label>
        <div className="rounded-2xl border border-[#0F2C4C]/10 bg-[#0F2C4C] text-white p-3 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
          <Megaphone className="h-4 w-4 text-[#D96B27] shrink-0" />
          <span>
            {promoBanner.trim() || "Exemple : 🎉 -15% sur toutes les commandes de Chiromani cette semaine !"}
          </span>
          {promoBannerLink.trim() && (
            <span className="text-[10px] underline text-[#C5A059] ml-1">En savoir plus</span>
          )}
        </div>
      </div>

      {/* Formulaire d'édition */}
      <form onSubmit={handleSave} className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <label htmlFor="promoBanner" className="text-xs font-bold text-[#0F2C4C]">
            Message du bandeau promotionnel
          </label>
          <input
            id="promoBanner"
            type="text"
            value={promoBanner}
            onChange={(e) => setPromoBanner(e.target.value)}
            maxLength={250}
            placeholder="Ex : Remise de 10% avec le code KOMO-EID / Livraison gratuite vers Moroni !"
            className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
          />
          <p className="text-[11px] text-[#0F2C4C]/50">
            Laissez vide pour désactiver le bandeau promotionnel sur votre boutique.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="promoBannerLink" className="text-xs font-bold text-[#0F2C4C]">
            Lien de redirection (facultatif)
          </label>
          <input
            id="promoBannerLink"
            type="text"
            value={promoBannerLink}
            onChange={(e) => setPromoBannerLink(e.target.value)}
            maxLength={250}
            placeholder="Ex : /store/mon-atelier ou lien WhatsApp"
            className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#0F2C4C]/10 pt-4">
          <Link
            href={`/store/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2C4C]/70 hover:text-[#0F2C4C]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir ma boutique publique
          </Link>

          <Button type="submit" disabled={loading} className="shadow-md">
            <Save className="h-4 w-4 mr-1.5" />
            {loading ? "Enregistrement..." : "Enregistrer la Bannière"}
          </Button>
        </div>
      </form>
    </div>
  );
}
