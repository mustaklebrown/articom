"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { SUBSCRIPTION_PLANS, COMPARISON_CATEGORIES } from "@/lib/subscriptions";
import { formatKMF } from "@/lib/format";
import {
  Check,
  X,
  Sparkles,
  PhoneCall,
  Megaphone,
  Store,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Globe2,
  Headphones,
} from "lucide-react";

export function PricingSection({ isLoggedIn = false, currentPlan = "BASIC" }: { isLoggedIn?: boolean; currentPlan?: string }) {
  const [billingPeriod, setBillingPeriod] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  return (
    <div className="space-y-20 py-12">
      {/* Header & Toggle */}
      <div className="text-center max-w-3xl mx-auto space-y-5 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D96B27]/10 text-[#D96B27] text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Abonnements & Services SaaS KOMO-ART
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2C4C] tracking-tight leading-tight">
          Des formules conçues pour propulser chaque{" "}
          <span className="text-[#D96B27]">Artisan Comorien</span>
        </h1>
        <p className="text-base sm:text-lg text-[#0F2C4C]/70 leading-relaxed">
          De la vitrine en ligne essentielle à la force de vente complète avec{" "}
          <strong className="text-[#0F2C4C]">Télévendeur dédié</strong> et{" "}
          <strong className="text-[#0F2C4C]">Campagnes Marketing</strong> vers la diaspora comorienne.
        </p>

        {/* Toggle Mensuel / Annuel */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-[#0F2C4C]/10 shadow-xs">
            <button
              type="button"
              onClick={() => setBillingPeriod("MONTHLY")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                billingPeriod === "MONTHLY"
                  ? "bg-[#0F2C4C] text-white shadow-xs"
                  : "text-[#0F2C4C]/70 hover:text-[#0F2C4C]"
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("YEARLY")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                billingPeriod === "YEARLY"
                  ? "bg-[#D96B27] text-white shadow-xs"
                  : "text-[#0F2C4C]/70 hover:text-[#0F2C4C]"
              }`}
            >
              Facturation Annuelle
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-white/25 text-white">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grille des 3 Cartes de Tarifs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* PLAN 1 : BASIC */}
          {(() => {
            const plan = SUBSCRIPTION_PLANS.BASIC;
            const isCurrent = isLoggedIn && currentPlan === "BASIC";
            return (
              <div className="relative flex flex-col justify-between rounded-3xl border border-[#0F2C4C]/10 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
                      {plan.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Votre forfait actuel
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-[#0F2C4C]">{plan.name}</h3>
                    <p className="text-xs text-[#0F2C4C]/60 mt-1">{plan.tagline}</p>
                  </div>

                  {/* Prix */}
                  <div className="border-y border-[#0F2C4C]/5 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-[#0F2C4C]">0 KMF</span>
                      <span className="text-xs text-[#0F2C4C]/60 font-semibold">/ gratuit à vie</span>
                    </div>
                    <p className="text-xs text-[#0F2C4C]/50 mt-1">
                      Idéal pour découvrir le e-commerce aux Comores sans aucun engagement.
                    </p>
                  </div>

                  {/* Liste des fonctionnalités */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0F2C4C]/50">
                      Inclus dans l&apos;offre :
                    </p>
                    <ul className="space-y-2.5 text-xs text-[#0F2C4C]/80">
                      {plan.features.slice(0, 6).map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f.name}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-2.5 text-[#0F2C4C]/40">
                        <X className="h-4 w-4 text-stone-300 shrink-0 mt-0.5" />
                        <span>Outils Marketing & Bannières promotionnelles</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-[#0F2C4C]/40">
                        <X className="h-4 w-4 text-stone-300 shrink-0 mt-0.5" />
                        <span>Service Télévendeur Dédié KOMO-ART</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/register?type=artisan"}
                    className="block w-full text-center py-3 px-4 rounded-xl text-sm font-bold border border-[#0F2C4C]/20 text-[#0F2C4C] hover:bg-[#0F2C4C]/5 transition-colors"
                  >
                    {isLoggedIn ? "Accéder à ma vitrine" : "Commencer Gratuitement"}
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* PLAN 2 : PRO (POPULAIRE) */}
          {(() => {
            const plan = SUBSCRIPTION_PLANS.PRO;
            const price = billingPeriod === "MONTHLY" ? plan.priceMonthlyKMF : Math.round(plan.priceYearlyKMF / 12);
            const isCurrent = isLoggedIn && currentPlan === "PRO";
            return (
              <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#D96B27] bg-white p-8 shadow-xl hover:shadow-2xl transition-all scale-100 lg:-translate-y-2">
                {/* Badge populaire */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D96B27] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Le Plus Populaire
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D96B27]/10 text-[#D96B27]">
                      {plan.badge}
                    </span>
                    {isCurrent ? (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Votre forfait actuel
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#D96B27]">
                        Commission réduite à 2.5%
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-[#0F2C4C]">{plan.name}</h3>
                    <p className="text-xs text-[#0F2C4C]/60 mt-1">{plan.tagline}</p>
                  </div>

                  {/* Prix */}
                  <div className="border-y border-[#0F2C4C]/5 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-[#0F2C4C]">{formatKMF(price)}</span>
                      <span className="text-xs text-[#0F2C4C]/60 font-semibold">/ mois</span>
                    </div>
                    <p className="text-xs text-[#D96B27] font-semibold mt-1">
                      {billingPeriod === "YEARLY"
                        ? `Facturé ${formatKMF(plan.priceYearlyKMF)} par an (2 mois offerts !)`
                        : "Soit ~30 € / mois · Sans engagement"}
                    </p>
                  </div>

                  {/* Liste des fonctionnalités */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0F2C4C]/50">
                      Tout le Basic, plus :
                    </p>
                    <ul className="space-y-2.5 text-xs text-[#0F2C4C]/80">
                      <li className="flex items-start gap-2.5 font-bold text-[#D96B27]">
                        <Check className="h-4 w-4 text-[#D96B27] shrink-0 mt-0.5" />
                        <span>Outils Marketing : Bannières personnalisées</span>
                      </li>
                      <li className="flex items-start gap-2.5 font-bold text-[#0F2C4C]">
                        <Check className="h-4 w-4 text-[#D96B27] shrink-0 mt-0.5" />
                        <span>Mise en avant sur l&apos;accueil & catégories</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#D96B27] shrink-0 mt-0.5" />
                        <span>Jusqu&apos;à 50 créations artisanales en ligne</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#D96B27] shrink-0 mt-0.5" />
                        <span>Badge officiel certifié &quot;Artisan Pro&quot;</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#D96B27] shrink-0 mt-0.5" />
                        <span>Statistiques de conversion et origines des clients</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#D96B27] shrink-0 mt-0.5" />
                        <span>Support prioritaire 7j/7 WhatsApp (réponse &lt; 2h)</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-[#0F2C4C]/40">
                        <X className="h-4 w-4 text-stone-300 shrink-0 mt-0.5" />
                        <span>Service Télévendeur Dédié (inclus en Entreprise)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={isLoggedIn ? "/dashboard/subscription" : "/register?type=artisan&plan=PRO"}
                    className="block w-full text-center py-3 px-4 rounded-xl text-sm font-bold bg-[#D96B27] text-white hover:bg-[#b8561a] shadow-md transition-colors"
                  >
                    {isCurrent ? "Gérer mon abonnement" : "Passer au Forfait Pro"}
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* PLAN 3 : ENTREPRISE & TELEVENDEUR */}
          {(() => {
            const plan = SUBSCRIPTION_PLANS.ENTERPRISE;
            const price = billingPeriod === "MONTHLY" ? plan.priceMonthlyKMF : Math.round(plan.priceYearlyKMF / 12);
            const isCurrent = isLoggedIn && currentPlan === "ENTERPRISE";
            return (
              <div className="relative flex flex-col justify-between rounded-3xl border border-[#0F2C4C] bg-[#0F2C4C] text-white p-8 shadow-xl hover:shadow-2xl transition-all">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059] text-[#0F2C4C]">
                      {plan.badge}
                    </span>
                    {isCurrent ? (
                      <span className="text-[11px] font-bold text-[#C5A059] bg-white/10 px-2.5 py-0.5 rounded-full">
                        Votre forfait actuel
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-[#C5A059]">
                        0% Commission sur Vente
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                    <p className="text-xs text-white/70 mt-1">{plan.tagline}</p>
                  </div>

                  {/* Prix */}
                  <div className="border-y border-white/10 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-[#C5A059]">{formatKMF(price)}</span>
                      <span className="text-xs text-white/70 font-semibold">/ mois</span>
                    </div>
                    <p className="text-xs text-white/60 font-semibold mt-1">
                      {billingPeriod === "YEARLY"
                        ? `Facturé ${formatKMF(plan.priceYearlyKMF)} par an (2 mois offerts !)`
                        : "Soit ~90 € / mois · Sérénité totale"}
                    </p>
                  </div>

                  {/* Liste des fonctionnalités */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                      La puissance absolue :
                    </p>
                    <ul className="space-y-2.5 text-xs text-white/90">
                      <li className="flex items-start gap-2.5 font-bold text-[#C5A059]">
                        <Headphones className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>Service Télévendeur Dédié KOMO-ART</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>Relance téléphonique des paniers & acheteurs diaspora</span>
                      </li>
                      <li className="flex items-start gap-2.5 font-bold text-white">
                        <Megaphone className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>Campagnes Pub Réseaux Sociaux ciblées (France & Mayotte)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>Produits illimités & multi-catégories</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>Shooting photo & vidéo annuel de votre atelier</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>Accompagnement Fret & Colis International (DHL)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>Account Manager KOMO-ART attitré</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={isLoggedIn ? "/dashboard/subscription" : "/register?type=artisan&plan=ENTERPRISE"}
                    className="block w-full text-center py-3 px-4 rounded-xl text-sm font-bold bg-[#C5A059] text-[#0F2C4C] hover:bg-[#d8b56f] shadow-lg transition-colors"
                  >
                    {isCurrent ? "Gérer mon abonnement" : "Rejoindre en Entreprise"}
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Focus sur le Service Télévendeur Dédié */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-gradient-to-br from-[#0F2C4C] to-[#183e68] text-white p-8 sm:p-12 overflow-hidden relative shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
              <PhoneCall className="h-3.5 w-3.5" />
              Exclusivité Plan Entreprise
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Qu&apos;est-ce que le service <span className="text-[#C5A059]">Télévendeur Dédié</span> ?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Beaucoup d&apos;acheteurs de la diaspora comorienne (France métropolitaine, Mayotte, Réunion) hésitent ou ont besoin d&apos;être rassurés pour des commandes de grande valeur (bijoux en or, parures de mariage, chiromani brodés main, coffres en bois de santal).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs space-y-2">
                <PhoneCall className="h-6 w-6 text-[#C5A059]" />
                <h4 className="font-bold text-sm">Permanence Commerciale</h4>
                <p className="text-xs text-white/70">
                  Un conseiller KOMO-ART répond aux questions des acheteurs en shikomori et en français.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs space-y-2">
                <TrendingUp className="h-6 w-6 text-[#D96B27]" />
                <h4 className="font-bold text-sm">Relance Paniers & WhatsApp</h4>
                <p className="text-xs text-white/70">
                  Relance proactive des commandes initiées pour convertir chaque visiteur en client payant.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs space-y-2">
                <Globe2 className="h-6 w-6 text-emerald-400" />
                <h4 className="font-bold text-sm">Commandes Diaspora</h4>
                <p className="text-xs text-white/70">
                  Assistance pour le paiement à distance et la coordination de la livraison avec les proches sur place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau comparatif complet */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2C4C]">
            Comparatif détaillé des fonctionnalités
          </h2>
          <p className="text-sm text-[#0F2C4C]/60">
            Comparez chaque avantage pour choisir la formule qui correspond exactement à vos objectifs.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#0F2C4C]/10 bg-white shadow-xs">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#0F2C4C]/10 bg-[#F8F8F6]">
                <th className="py-4 px-6 font-extrabold text-[#0F2C4C] w-1/3">Fonctionnalité</th>
                <th className="py-4 px-6 font-bold text-center text-stone-700">Basic</th>
                <th className="py-4 px-6 font-extrabold text-center text-[#D96B27]">Pro</th>
                <th className="py-4 px-6 font-extrabold text-center text-[#0F2C4C]">Entreprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F2C4C]/5">
              {COMPARISON_CATEGORIES.map((cat, catIdx) => (
                <Fragment key={catIdx}>
                  <tr className="bg-[#0F2C4C]/5">
                    <td colSpan={4} className="py-2.5 px-6 font-extrabold text-xs uppercase tracking-wider text-[#0F2C4C]">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.items.map((item, itemIdx) => (
                    <tr key={itemIdx} className="hover:bg-[#F8F8F6]/60 transition-colors">
                      <td className="py-3 px-6 text-xs sm:text-sm font-semibold text-[#0F2C4C]/80">
                        {item.feature}
                      </td>
                      <td className="py-3 px-6 text-center text-xs">
                        {typeof item.basic === "boolean" ? (
                          item.basic ? (
                            <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-stone-300 mx-auto" />
                          )
                        ) : (
                          <span className="font-semibold text-stone-600">{item.basic}</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center text-xs">
                        {typeof item.pro === "boolean" ? (
                          item.pro ? (
                            <Check className="h-4 w-4 text-[#D96B27] mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-stone-300 mx-auto" />
                          )
                        ) : (
                          <span className="font-extrabold text-[#D96B27]">{item.pro}</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center text-xs">
                        {typeof item.enterprise === "boolean" ? (
                          item.enterprise ? (
                            <Check className="h-4 w-4 text-[#0F2C4C] mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-stone-300 mx-auto" />
                          )
                        ) : (
                          <span className="font-extrabold text-[#0F2C4C]">{item.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#0F2C4C]">Questions Fréquemment Posées</h2>
          <p className="text-xs sm:text-sm text-[#0F2C4C]/60">
            Tout ce que vous devez savoir sur la souscription et le règlement aux Comores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#0F2C4C]/10 space-y-2">
            <h4 className="font-bold text-sm text-[#0F2C4C]">Comment régler mon abonnement ?</h4>
            <p className="text-xs text-[#0F2C4C]/70 leading-relaxed">
              Vous pouvez régler directement par Mobile Money local (Huri Money de Comores Telecom ou MVola de Telma Comores), ou en espèces auprès de notre équipe d&apos;accompagnement à Moroni, Mutsamudu ou Fomboni.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#0F2C4C]/10 space-y-2">
            <h4 className="font-bold text-sm text-[#0F2C4C]">Puis-je changer d&apos;offre à tout moment ?</h4>
            <p className="text-xs text-[#0F2C4C]/70 leading-relaxed">
              Oui, absolument ! Vous pouvez démarrer gratuitement en forfait Basic, puis passer au Pro ou Entreprise dès que vous souhaitez accélérer vos ventes et profiter du service télévendeur.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#0F2C4C]/10 space-y-2">
            <h4 className="font-bold text-sm text-[#0F2C4C]">Comment le télévendeur gère-t-il mes ventes ?</h4>
            <p className="text-xs text-[#0F2C4C]/70 leading-relaxed">
              Le télévendeur dédié agit comme votre propre commercial : il prend en charge les appels des clients, informe sur les délais de fabrication et s&apos;assure que les acheteurs finalisent leur paiement. Vous restez maître de votre production.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#0F2C4C]/10 space-y-2">
            <h4 className="font-bold text-sm text-[#0F2C4C]">Y a-t-il un engagement de durée ?</h4>
            <p className="text-xs text-[#0F2C4C]/70 leading-relaxed">
              Non. En facturation mensuelle, vous êtes totalement libre d&apos;arrêter ou de modifier votre abonnement à la fin de chaque mois. En facturation annuelle, vous bénéficiez de 2 mois totalement offerts (-20%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
