"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUBSCRIPTION_PLANS } from "@/lib/subscriptions";
import type { SubscriptionPlan } from "@/generated/prisma/enums";
import { formatKMF, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sparkles,
  Check,
  Headphones,
  PhoneCall,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  CreditCard,
  Layers,
} from "lucide-react";

interface SubscriptionManagerProps {
  store: {
    id: string;
    name: string;
    subscriptionPlan: SubscriptionPlan;
    billingPeriod: "MONTHLY" | "YEARLY";
    subscriptionExpiresAt: Date | string | null;
    hasMarketingTools: boolean;
    hasTelepromoter: boolean;
    telepromoterName: string | null;
    telepromoterPhone: string | null;
    _count: { products: number };
  };
  pendingRequest: {
    id: string;
    requestedPlan: SubscriptionPlan;
    billingPeriod: "MONTHLY" | "YEARLY";
    paymentMethod: string;
    transactionRef: string | null;
    createdAt: Date | string;
  } | null;
}

export function SubscriptionManager({ store, pendingRequest }: SubscriptionManagerProps) {
  const router = useRouter();
  const currentPlanConfig = SUBSCRIPTION_PLANS[store.subscriptionPlan];
  const maxProducts = currentPlanConfig.maxProducts;
  const productCount = store._count.products;

  const [selectedPlan, setSelectedPlan] = useState<"PRO" | "ENTERPRISE">("PRO");
  const [billingPeriod, setBillingPeriod] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [paymentMethod, setPaymentMethod] = useState<"HURI_MONEY" | "MVOLA" | "WHATSAPP_DIRECT">("HURI_MONEY");
  const [transactionRef, setTransactionRef] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const targetPlanConfig = SUBSCRIPTION_PLANS[selectedPlan];
  const planPrice =
    billingPeriod === "MONTHLY"
      ? targetPlanConfig.priceMonthlyKMF
      : targetPlanConfig.priceYearlyKMF;

  async function handleUpgrade(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscription/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPlan: selectedPlan,
          billingPeriod,
          paymentMethod,
          transactionRef: transactionRef.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la demande");
      }

      toast.success(data.message || "Demande d'abonnement envoyée !");
      setTransactionRef("");
      setNotes("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Impossible d'envoyer la demande");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* 1. Statut Actuel de l'Atelier */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F2C4C]/50">
              Abonnement Actif
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-[#0F2C4C]">
                Plan {currentPlanConfig.name}
              </h2>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  store.subscriptionPlan === "ENTERPRISE"
                    ? "bg-[#0F2C4C] text-[#C5A059]"
                    : store.subscriptionPlan === "PRO"
                    ? "bg-[#D96B27]/15 text-[#D96B27]"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {currentPlanConfig.badge}
              </span>
            </div>
            <p className="text-xs text-[#0F2C4C]/70">{currentPlanConfig.tagline}</p>
          </div>

          {store.subscriptionExpiresAt && (
            <div className="text-right sm:border-l sm:border-[#0F2C4C]/10 sm:pl-6">
              <span className="text-[10px] uppercase font-bold text-[#0F2C4C]/50 block">
                Renouvellement le
              </span>
              <span className="text-sm font-extrabold text-[#0F2C4C]">
                {formatDate(store.subscriptionExpiresAt)}
              </span>
            </div>
          )}
        </div>

        {/* Quota Produits */}
        <div className="rounded-2xl bg-[#F8F8F6] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-[#D96B27]" />
              Quota de créations en vitrine
            </span>
            <span>
              {productCount} / {maxProducts === "unlimited" ? "Illimité" : `${maxProducts} produits`}
            </span>
          </div>
          {maxProducts !== "unlimited" && (
            <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  productCount >= maxProducts ? "bg-rose-500" : "bg-[#D96B27]"
                }`}
                style={{ width: `${Math.min(100, (productCount / (maxProducts as number)) * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Statut Télévendeur Dédié (si Entreprise) */}
        {store.subscriptionPlan === "ENTERPRISE" && (
          <div className="p-4 rounded-2xl bg-[#0F2C4C]/5 border border-[#0F2C4C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2C4C] text-[#C5A059]">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2C4C]">Télévendeur Dédié KOMO-ART</h4>
                <p className="text-[11px] text-[#0F2C4C]/70">
                  Votre conseiller personnel : <strong className="text-[#0F2C4C]">{store.telepromoterName || "Amina (Conseillère Diaspora)"}</strong>
                </p>
              </div>
            </div>
            {store.telepromoterPhone && (
              <a
                href={`https://wa.me/${store.telepromoterPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Contacter mon télévendeur
              </a>
            )}
          </div>
        )}
      </div>

      {/* 2. Demande en Attente (si existante) */}
      {pendingRequest && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-xs flex items-start gap-4">
          <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-amber-900">
              Demande de passage en {pendingRequest.requestedPlan} en cours de vérification
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Nous avons bien reçu votre demande via {pendingRequest.paymentMethod} (Réf :{" "}
              <strong>{pendingRequest.transactionRef || "En attente"}</strong>) soumise le{" "}
              {formatDate(pendingRequest.createdAt)}. Notre équipe valide votre paiement et activera vos fonctionnalités sous peu.
            </p>
          </div>
        </div>
      )}

      {/* 3. Sélecteur de Montée en Gamme (Upgrade) */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D96B27]/10 text-[#D96B27] text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="h-3 w-3" />
            Accélérez vos ventes
          </div>
          <h2 className="text-xl font-extrabold text-[#0F2C4C]">
            Changer de Formule ou Renouveler mon Abonnement
          </h2>
          <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
            Sélectionnez votre forfait et réglez en toute simplicité par Mobile Money comorien.
          </p>
        </div>

        {/* Toggle Période */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setBillingPeriod("MONTHLY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              billingPeriod === "MONTHLY"
                ? "bg-[#0F2C4C] text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Facturation Mensuelle
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod("YEARLY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingPeriod === "YEARLY"
                ? "bg-[#D96B27] text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Facturation Annuelle
            <span className="text-[10px] bg-white/25 text-white px-1.5 py-0.2 rounded font-black">
              -20%
            </span>
          </button>
        </div>

        {/* Choix du Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option PRO */}
          <div
            onClick={() => setSelectedPlan("PRO")}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all space-y-4 ${
              selectedPlan === "PRO"
                ? "border-[#D96B27] bg-[#D96B27]/5 shadow-sm"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D96B27]/10 text-[#D96B27]">
                Plan Pro
              </span>
              <span className="text-lg font-extrabold text-[#0F2C4C]">
                {formatKMF(billingPeriod === "MONTHLY" ? 15000 : 150000)}
                <span className="text-xs font-normal text-[#0F2C4C]/60">
                  {billingPeriod === "MONTHLY" ? " / mois" : " / an"}
                </span>
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-[#0F2C4C]">Artisan Pro & Visibilité</h4>
              <p className="text-xs text-[#0F2C4C]/60">
                50 produits, bannières marketing vitrine, mise en avant sur l&apos;accueil et badge officiel.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-[#0F2C4C]/80">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#D96B27]" />
                <span>Outils Marketing & Bannière d&apos;atelier</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#D96B27]" />
                <span>Mise en avant sur la page Explore</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#D96B27]" />
                <span>Support prioritaire 7j/7</span>
              </li>
            </ul>
          </div>

          {/* Option ENTREPRISE */}
          <div
            onClick={() => setSelectedPlan("ENTERPRISE")}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all space-y-4 ${
              selectedPlan === "ENTERPRISE"
                ? "border-[#0F2C4C] bg-[#0F2C4C]/5 shadow-sm"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0F2C4C] text-[#C5A059]">
                Plan Entreprise
              </span>
              <span className="text-lg font-extrabold text-[#0F2C4C]">
                {formatKMF(billingPeriod === "MONTHLY" ? 45000 : 450000)}
                <span className="text-xs font-normal text-[#0F2C4C]/60">
                  {billingPeriod === "MONTHLY" ? " / mois" : " / an"}
                </span>
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-[#0F2C4C]">Atelier Entreprise & Télévendeur</h4>
              <p className="text-xs text-[#0F2C4C]/60">
                Produits illimités, service télévendeur dédié, relance acheteurs diaspora, fret DHL et 0% commission.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-[#0F2C4C]/80">
              <li className="flex items-center gap-2 font-bold text-[#D96B27]">
                <Headphones className="h-3.5 w-3.5" />
                <span>Télévendeur dédié KOMO-ART (appels acheteurs)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#0F2C4C]" />
                <span>Campagnes Pub Réseaux Sociaux Diaspora</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#0F2C4C]" />
                <span>Produits illimités & 0% de commission</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Formulaire de Souscription & Règlement */}
        <form onSubmit={handleUpgrade} className="space-y-6 border-t border-[#0F2C4C]/10 pt-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0F2C4C]">
              1. Choisissez votre moyen de règlement
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("HURI_MONEY")}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  paymentMethod === "HURI_MONEY"
                    ? "border-[#D96B27] bg-[#D96B27]/10 font-bold text-[#D96B27]"
                    : "border-stone-200 text-[#0F2C4C]/70"
                }`}
              >
                Huri Money (Comores Telecom)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("MVOLA")}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  paymentMethod === "MVOLA"
                    ? "border-[#D96B27] bg-[#D96B27]/10 font-bold text-[#D96B27]"
                    : "border-stone-200 text-[#0F2C4C]/70"
                }`}
              >
                MVola (Telma Comores)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("WHATSAPP_DIRECT")}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  paymentMethod === "WHATSAPP_DIRECT"
                    ? "border-[#0F2C4C] bg-[#0F2C4C]/10 font-bold text-[#0F2C4C]"
                    : "border-stone-200 text-[#0F2C4C]/70"
                }`}
              >
                Conciergerie WhatsApp
              </button>
            </div>
          </div>

          {/* Instructions de virement Mobile Money */}
          <div className="rounded-2xl bg-[#0F2C4C]/5 p-4 text-xs text-[#0F2C4C]/80 space-y-1">
            <p className="font-bold text-[#0F2C4C]">Instructions de paiement :</p>
            {paymentMethod === "HURI_MONEY" && (
              <p>
                Effectuez un transfert Huri Money de <strong>{formatKMF(planPrice)}</strong> vers le numéro officiel KOMO-ART :{" "}
                <strong className="text-[#D96B27] font-mono text-sm">+269 333 00 00</strong> (Titulaire : KOMO-ART SAS).
              </p>
            )}
            {paymentMethod === "MVOLA" && (
              <p>
                Effectuez un transfert MVola de <strong>{formatKMF(planPrice)}</strong> vers le numéro officiel KOMO-ART :{" "}
                <strong className="text-[#D96B27] font-mono text-sm">+269 444 00 00</strong> (Titulaire : KOMO-ART SAS).
              </p>
            )}
            {paymentMethod === "WHATSAPP_DIRECT" && (
              <p>
                Réglez en direct avec notre équipe administrative par WhatsApp. Cliquez ci-dessous pour démarrer l&apos;échange avec la conciergerie.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="ref" className="text-xs font-bold text-[#0F2C4C]">
                Numéro ou Référence de transaction (SMS reçu)
              </label>
              <input
                id="ref"
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Ex: TX-94829384 ou numéro expéditeur"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="notes" className="text-xs font-bold text-[#0F2C4C]">
                Remarque ou information complémentaire (facultatif)
              </label>
              <input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Paiement effectué depuis la ligne de mon frère"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto shadow-md">
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Envoi de la demande..." : `Souscrire au Forfait ${selectedPlan} (${formatKMF(planPrice)})`}
          </Button>
        </form>
      </div>
    </div>
  );
}
