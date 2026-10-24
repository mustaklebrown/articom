import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const DEFAULT_SETTINGS = [
  {
    key: "PLATFORM_HURI_MONEY",
    value: "+269 333 00 00",
    description: "Numéro officiel Huri Money (Comores Telecom) pour l'encaissement des forfaits d'abonnement",
  },
  {
    key: "PLATFORM_MVOLA",
    value: "+269 444 00 00",
    description: "Numéro officiel MVola (Telma Comores) pour l'encaissement des forfaits d'abonnement",
  },
  {
    key: "WHATSAPP_CONCIERGE",
    value: "+269 333 99 99",
    description: "Numéro WhatsApp officiel de la Conciergerie KOMO-ART pour l'assistance artisans et acheteurs",
  },
  {
    key: "KMF_PER_EUR",
    value: "491.96775",
    description: "Taux de parité fixe indicatif KMF vers Euro (1 EUR = 491.96775 KMF)",
  },
  {
    key: "COMMISSION_BASIC",
    value: "5",
    description: "Pourcentage de commission sur les ventes pour les boutiques en forfait Basic (%)",
  },
  {
    key: "COMMISSION_PRO",
    value: "2.5",
    description: "Pourcentage de commission sur les ventes pour les boutiques en forfait Pro (%)",
  },
  {
    key: "GLOBAL_ANNOUNCEMENT",
    value: "Bienvenue sur KOMO-ART — La Marketplace d'exception des Artisans des Comores !",
    description: "Bannière d'annonce globale affichée sur toute la marketplace",
  },
  {
    key: "MAINTENANCE_MODE",
    value: "false",
    description: "Activer ou désactiver le mode maintenance de la plateforme",
  },
  {
    key: "PLATFORM_EMAIL",
    value: "contact@komo-art.km",
    description: "Adresse email officielle du support Super-Admin",
  },
  {
    key: "FEATURE_ALLOW_REGISTRATIONS",
    value: "true",
    description: "Autoriser l'inscription de nouveaux utilisateurs sur la plateforme",
  },
  {
    key: "FEATURE_ALLOW_STORE_CREATION",
    value: "true",
    description: "Autoriser la création de nouvelles boutiques pour les artisans",
  },
  {
    key: "FEATURE_WHATSAPP_CHECKOUT",
    value: "true",
    description: "Activer la finalisation des commandes directement par WhatsApp",
  },
  {
    key: "FEATURE_MARKETING_TOOLS",
    value: "true",
    description: "Activer les modules d'outils marketing et de bannières",
  },
  {
    key: "FEATURE_TELEPROMOTER",
    value: "true",
    description: "Activer le service télévendeur dédié",
  },
  {
    key: "FEATURE_INTERNATIONAL_SHIPPING",
    value: "true",
    description: "Activer les badges et options d'expédition internationale pour la diaspora",
  },
  {
    key: "FEATURE_SUBSCRIPTIONS",
    value: "true",
    description: "Activer le système de forfaits et d'abonnements payants",
  },
];

async function main() {
  for (const s of DEFAULT_SETTINGS) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      create: s,
      update: { description: s.description },
    });
  }
  console.log("Default system settings seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
