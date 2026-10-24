import { SubscriptionPlan, SubscriptionBillingPeriod } from "@/generated/prisma/enums";

export { SubscriptionPlan, SubscriptionBillingPeriod };

export interface PlanFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
  hint?: string;
}

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  priceMonthlyKMF: number;
  priceYearlyKMF: number; // Annuel avec réduction
  priceMonthlyEUR: number;
  maxProducts: number | "unlimited";
  commissionRate: string;
  popular?: boolean;
  color: {
    badgeBg: string;
    badgeText: string;
    border: string;
    ring: string;
    gradient: string;
  };
  features: PlanFeature[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, PlanConfig> = {
  BASIC: {
    id: "BASIC",
    name: "Artisan Découverte",
    badge: "Basic",
    tagline: "Lancez votre vitrine artisanale en ligne sans frais",
    description: "Parfait pour les artisans débutants et créateurs indépendants souhaitant digitaliser leur atelier.",
    priceMonthlyKMF: 0,
    priceYearlyKMF: 0,
    priceMonthlyEUR: 0,
    maxProducts: 10,
    commissionRate: "5%",
    color: {
      badgeBg: "bg-stone-100",
      badgeText: "text-stone-700",
      border: "border-stone-200",
      ring: "focus:ring-stone-400",
      gradient: "from-stone-50 to-white",
    },
    features: [
      { name: "Vitrine d'atelier personnalisée (komo-art.km/store/...)", included: true },
      { name: "Jusqu'à 10 produits en ligne avec photos haute qualité", included: true },
      { name: "Commandes directes WhatsApp en 1 clic", included: true },
      { name: "Paiement Mobile Money (Huri Money, MVola)", included: true },
      { name: "Statistiques simples de visites", included: true },
      { name: "Support standard par email & WhatsApp (48h)", included: true },
      { name: "Outils Marketing & Bannières promotionnelles", included: false },
      { name: "Mise en avant sur la page d'accueil & Explore", included: false },
      { name: "Service Télévendeur Dédié KOMO-ART", included: false },
      { name: "Logistique & Fret diaspora (Colis France / Mayotte)", included: false },
      { name: "Shooting photo & vidéo d'atelier professionnel", included: false },
    ],
  },
  PRO: {
    id: "PRO",
    name: "Artisan Pro & Visibilité",
    badge: "Pro",
    popular: true,
    tagline: "Boostez vos commandes avec des outils marketing avancés",
    description: "Pour les artisans confirmés et créateurs de renom qui souhaitent accroître leurs ventes et maximiser leur visibilité.",
    priceMonthlyKMF: 15000,
    priceYearlyKMF: 150000, // 2 mois offerts
    priceMonthlyEUR: 30,
    maxProducts: 50,
    commissionRate: "2.5%",
    color: {
      badgeBg: "bg-[#D96B27]/10",
      badgeText: "text-[#D96B27]",
      border: "border-[#D96B27]",
      ring: "focus:ring-[#D96B27]",
      gradient: "from-[#D96B27]/5 to-white",
    },
    features: [
      { name: "Vitrine d'atelier personnalisée (komo-art.km/store/...)", included: true },
      { name: "Jusqu'à 50 produits en ligne avec galeries multiples", included: true },
      { name: "Commandes directes WhatsApp & Mobile Money", included: true },
      { name: "Badge officiel vérifié 'Artisan Pro'", included: true, highlight: true },
      { name: "Outils Marketing : Bannières promotionnelles personnalisables", included: true, highlight: true },
      { name: "Mise en avant prioritaire sur la Marketplace & Catégories", included: true, highlight: true },
      { name: "Statistiques avancées (conversions, clics WhatsApp, vues)", included: true },
      { name: "Gestion des commandes sur mesure & délais d'atelier", included: true },
      { name: "Support prioritaire 7j/7 (réponse sous 2h)", included: true },
      { name: "Service Télévendeur Dédié KOMO-ART", included: false, hint: "Disponible dans le plan Entreprise" },
      { name: "Logistique & Fret diaspora (Colis France / Mayotte)", included: false },
    ],
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    name: "Atelier Entreprise & Télévendeur",
    badge: "Entreprise",
    tagline: "L'artisanat comorien à grande échelle avec télévendeur dédié",
    description: "Solution complète pour grandes coopératives, orfèvres, stylistes d'exception et exportateurs vers la diaspora.",
    priceMonthlyKMF: 45000,
    priceYearlyKMF: 450000, // 2 mois offerts
    priceMonthlyEUR: 90,
    maxProducts: "unlimited",
    commissionRate: "0%",
    color: {
      badgeBg: "bg-[#0F2C4C] text-[#C5A059]",
      badgeText: "text-[#C5A059]",
      border: "border-[#0F2C4C]",
      ring: "focus:ring-[#0F2C4C]",
      gradient: "from-[#0F2C4C]/10 via-[#C5A059]/10 to-white",
    },
    features: [
      { name: "Produits illimités & multi-catégories", included: true, highlight: true },
      { name: "Commission sur vente 0% (gardez 100% de vos gains)", included: true, highlight: true },
      { name: "Service Télévendeur Dédié KOMO-ART (permanence & appels acheteurs)", included: true, highlight: true },
      { name: "Relance téléphonique des commandes en attente & paniers diaspora", included: true, highlight: true },
      { name: "Campagnes Marketing Dédiées (Facebook / Instagram Ads Comores & Diaspora)", included: true, highlight: true },
      { name: "Shooting photo & vidéo d'atelier professionnel annuel", included: true },
      { name: "Accompagnement Logistique & Fret Diaspora (DHL, colis aérien)", included: true, highlight: true },
      { name: "Badge de prestige 'Atelier Entreprise d'Excellence'", included: true },
      { name: "Comptes multiples pour vos artisans et apprentis", included: true },
      { name: "Account Manager KOMO-ART dédié joignable par téléphone", included: true },
    ],
  },
};

export const COMPARISON_CATEGORIES = [
  {
    category: "Catalogue & Vitrine",
    items: [
      { feature: "Nombre de produits", basic: "10 produits", pro: "50 produits", enterprise: "Illimité" },
      { feature: "Vitrine web dédiée avec QR code", basic: true, pro: true, enterprise: true },
      { feature: "Gestion des produits sur mesure", basic: false, pro: true, enterprise: true },
      { feature: "Multi-utilisateurs atelier", basic: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Marketing & Visibilité",
    items: [
      { feature: "Bannières promotionnelles vitrine", basic: false, pro: true, enterprise: true },
      { feature: "Mise en avant sur l'accueil & recherche", basic: false, pro: true, enterprise: true },
      { feature: "Campagnes sponsorisées Réseaux Sociaux (Diaspora)", basic: false, pro: false, enterprise: true },
      { feature: "Shooting photo d'atelier professionnel", basic: false, pro: false, enterprise: true },
      { feature: "Badge de confiance", basic: "Artisan", pro: "Artisan Pro", enterprise: "Excellence Entreprise" },
    ],
  },
  {
    category: "Ventes & Télévente",
    items: [
      { feature: "Commandes directes WhatsApp", basic: true, pro: true, enterprise: true },
      { feature: "Mobile Money (Huri Money, MVola)", basic: true, pro: true, enterprise: true },
      { feature: "Service Télévendeur Dédié KOMO-ART", basic: false, pro: false, enterprise: true },
      { feature: "Relance téléphonique des paniers en attente", basic: false, pro: false, enterprise: true },
      { feature: "Assistance personnalisée aux acheteurs diaspora", basic: false, pro: false, enterprise: true },
      { feature: "Commission sur vente", basic: "5%", pro: "2.5%", enterprise: "0%" },
    ],
  },
  {
    category: "Logistique & Support",
    items: [
      { feature: "Expéditions locales inter-îles", basic: true, pro: true, enterprise: true },
      { feature: "Logistique internationale & Fret Diaspora", basic: false, pro: false, enterprise: true },
      { feature: "Support client", basic: "Standard (48h)", pro: "Prioritaire 7j/7 (2h)", enterprise: "Account Manager Dédié" },
    ],
  },
];

export function getPlanConfig(plan: SubscriptionPlan = "BASIC"): PlanConfig {
  return SUBSCRIPTION_PLANS[plan] || SUBSCRIPTION_PLANS.BASIC;
}

export function canUseMarketing(store: { subscriptionPlan: SubscriptionPlan; hasMarketingTools?: boolean }): boolean {
  if (store.hasMarketingTools) return true;
  return store.subscriptionPlan === "PRO" || store.subscriptionPlan === "ENTERPRISE";
}

export function canUseTelepromoter(store: { subscriptionPlan: SubscriptionPlan; hasTelepromoter?: boolean }): boolean {
  if (store.hasTelepromoter) return true;
  return store.subscriptionPlan === "ENTERPRISE";
}

export function getMaxProducts(store: { subscriptionPlan: SubscriptionPlan }): number {
  if (store.subscriptionPlan === "ENTERPRISE") return 999999;
  if (store.subscriptionPlan === "PRO") return 50;
  return 10;
}
