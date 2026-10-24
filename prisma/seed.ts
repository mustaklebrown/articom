import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Démarrage du seed KOMO-ART...");

  // 1. Nettoyage initial (ordre des clés étrangères)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 2. Création des Catégories Artisanales
  const categoriesData = [
    { name: "Menuiserie & Bois", slug: "menuiserie-bois", icon: "Hammer" },
    { name: "Couture & Chiromani", slug: "couture-chiromani", icon: "Scissors" },
    { name: "Bijouterie", slug: "bijouterie", icon: "Gem" },
    { name: "Maroquinerie", slug: "maroquinerie", icon: "Briefcase" },
    { name: "Vannerie", slug: "vannerie", icon: "ShoppingBag" },
    { name: "Décoration", slug: "decoration", icon: "Home" },
    { name: "Cosmétique Naturelle", slug: "cosmetique-naturelle", icon: "Sparkles" },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({
        data: cat,
      })
    )
  );
  console.log(`✅ ${categories.length} catégories créées.`);

  const getCat = (slug: string) => categories.find((c) => c.slug === slug)!.id;

  // 3. Utilisateurs & Boutiques
  // Super Admin
  const adminUser = await prisma.user.create({
    data: {
      name: "Direction KOMO-ART",
      email: "admin@komo-art.km",
      role: "SUPER_ADMIN",
      emailVerified: true,
      phone: "+2693200000",
    },
  });

  // Artisan 1 - Atelier Mshangama (Ngazidja)
  const artisan1 = await prisma.user.create({
    data: {
      name: "Fundi Ali Mshangama",
      email: "ali@mshangama.km",
      role: "ARTISAN",
      emailVerified: true,
      phone: "+2693321122",
    },
  });

  const store1 = await prisma.store.create({
    data: {
      userId: artisan1.id,
      name: "Atelier Mshangama",
      slug: "atelier-mshangama",
      description:
        "Maître ébéniste et sculpteur sur bois précieux depuis plus de 25 ans à Moroni. Nous créons des coffres traditionnels comoriens sculptés main, des portes swahilies et du mobilier d'art.",
      island: "NGAZIDJA",
      city: "Moroni (Badjanani)",
      whatsappNumber: "+2693321122",
      mobileMoneyName: "Ali Mshangama",
      huriMoney: "+2693321122",
      mvola: "+2693321122",
      orangeMoney: "+2694321122",
      isVerified: true,
      isActive: true,
      banner: "/images/hero-workshop.jpg",
      logo: "/images/wood-chest.jpg",
    },
  });

  // Artisan 2 - Maison du Chiromani & Kofia (Ndzuwani)
  const artisan2 = await prisma.user.create({
    data: {
      name: "Mariama Abdallah",
      email: "mariama@chiromani.km",
      role: "ARTISAN",
      emailVerified: true,
      phone: "+2693456789",
    },
  });

  const store2 = await prisma.store.create({
    data: {
      userId: artisan2.id,
      name: "Maison du Chiromani & Kofia",
      slug: "maison-chiromani-kofia",
      description:
        "Atelier familial basé à Mutsamudu, perpétuant le tissage du véritable Chiromani comorien et la broderie minutieuse des Kofia de cérémonie (mariage comorien).",
      island: "NDZUWANI",
      city: "Mutsamudu",
      whatsappNumber: "+2693456789",
      mobileMoneyName: "Mariama Abdallah",
      huriMoney: "+2693456789",
      mvola: "+2693456789",
      isVerified: true,
      isActive: true,
      banner: "/images/chiromani.jpg",
      logo: "/images/chiromani.jpg",
    },
  });

  // Artisan 3 - Or des Îles & Filigrane (Ngazidja)
  const artisan3 = await prisma.user.create({
    data: {
      name: "Nassur Bijoux",
      email: "nassur@ordesiles.km",
      role: "ARTISAN",
      emailVerified: true,
      phone: "+2693678901",
    },
  });

  const store3 = await prisma.store.create({
    data: {
      userId: artisan3.id,
      name: "Or des Îles & Filigrane",
      slug: "or-des-iles",
      description:
        "Bijoutier-joaillier spécialiste du filigrane d'or et d'argent aux motifs de croissant lunaire et étoiles comoriennes, pour parures de Grand Mariage.",
      island: "NGAZIDJA",
      city: "Iconi",
      whatsappNumber: "+2693678901",
      mobileMoneyName: "Nassur Mohamed",
      huriMoney: "+2693678901",
      isVerified: true,
      isActive: true,
      banner: "/images/gold-jewelry.jpg",
      logo: "/images/gold-jewelry.jpg",
    },
  });

  // Artisan 4 - Vannerie & Déco Mwali (Mwali)
  const artisan4 = await prisma.user.create({
    data: {
      name: "Zalifa Boina",
      email: "zalifa@mwali-art.km",
      role: "ARTISAN",
      emailVerified: true,
      phone: "+2693987654",
    },
  });

  const store4 = await prisma.store.create({
    data: {
      userId: artisan4.id,
      name: "Vannerie des Parfums",
      slug: "vannerie-des-parfums",
      description:
        "Paniers traditionnels tressés main en feuilles de cocotier et raphia naturel, huiles pures d'Ylang-Ylang de Mohéli et artisanat végétal respectueux de la nature.",
      island: "MWALI",
      city: "Fomboni",
      whatsappNumber: "+2693987654",
      mobileMoneyName: "Zalifa Boina",
      huriMoney: "+2693987654",
      mvola: "+2693987654",
      isVerified: true,
      isActive: true,
      banner: "/images/basket.jpg",
      logo: "/images/basket.jpg",
    },
  });

  console.log("✅ Boutiques et artisans créés.");

  // 4. Produits Réalistes
  const productsData = [
    {
      storeId: store1.id,
      categoryId: getCat("menuiserie-bois"),
      title: "Coffre Traditionnel Sculpté Main en Palissandre",
      slug: "coffre-traditionnel-sculpte-palissandre",
      description:
        "Chef-d'œuvre de la menuiserie comorienne : coffre en bois noble sculpté de motifs géométriques swahilis avec ferrures et serrure en laiton massif. Pièce maîtresse pour salon ou chambre.",
      price: 185000, // KMF (~376 EUR)
      stock: 3,
      isMadeToOrder: false,
      images: ["/images/wood-chest.jpg"],
      views: 142,
    },
    {
      storeId: store1.id,
      categoryId: getCat("decoration"),
      title: "Lanterne Ajourée en Bois Massif Style Swahili",
      slug: "lanterne-ajouree-bois-swahili",
      description:
        "Lanterne décorative sculptée aux motifs traditionnels de dentelle de bois. Diffuse une lumière douce et chaleureuse pour vos soirées.",
      price: 32000, // KMF (~65 EUR)
      stock: 8,
      isMadeToOrder: false,
      images: ["/images/carved-lantern.jpg"],
      views: 95,
    },
    {
      storeId: store2.id,
      categoryId: getCat("couture-chiromani"),
      title: "Ensemble Chiromani Rouge & Kofia Brodé Main",
      slug: "ensemble-chiromani-rouge-kofia-brode",
      description:
        "Parure complète d'apparat comprenant un véritable tissu Chiromani en coton peigné aux motifs traditionnels rouges et blancs ainsi qu'un Kofia brodé avec une grande précision.",
      price: 45000, // KMF (~91 EUR)
      stock: 5,
      isMadeToOrder: false,
      images: ["/images/chiromani.jpg"],
      views: 230,
    },
    {
      storeId: store3.id,
      categoryId: getCat("bijouterie"),
      title: "Parure Filigrane Croissant de Lune & Étoile en Or",
      slug: "parure-filigrane-croissant-lune-or",
      description:
        "Collier pendentif et boucles d'oreilles pendantes en filigrane d'or délicat. Réalisé artisanalement selon la tradition séculaire des joailliers comoriens.",
      price: 240000, // KMF (~487 EUR)
      stock: 2,
      isMadeToOrder: true,
      images: ["/images/gold-jewelry.jpg"],
      views: 310,
    },
    {
      storeId: store4.id,
      categoryId: getCat("vannerie"),
      title: "Panier Tressé avec Couvercle Rayures Terracotta & Bleu",
      slug: "panier-tresse-couvercle-terracotta-bleu",
      description:
        "Panier traditionnel comorien tressé avec des fibres de feuilles de palmier naturelles. Motifs géométriques aux couleurs de KOMO-ART. Pratique et décoratif.",
      price: 18000, // KMF (~36 EUR)
      stock: 12,
      isMadeToOrder: false,
      images: ["/images/basket.jpg"],
      views: 88,
    },
    {
      storeId: store4.id,
      categoryId: getCat("maroquinerie"),
      title: "Cabas Cuir Tan & Empiècement Vannerie Naturelle",
      slug: "cabas-cuir-tan-vannerie-naturelle",
      description:
        "Sac cabas élégant en cuir pleine fleur tanné naturellement, orné d'un panneau central en raphia tressé main. Finitions surpiquées.",
      price: 52000, // KMF (~105 EUR)
      stock: 4,
      isMadeToOrder: false,
      images: ["/images/leather-bag.jpg"],
      views: 114,
    },
    {
      storeId: store4.id,
      categoryId: getCat("cosmetique-naturelle"),
      title: "Duo Émulsion Coco & Huile Essentielle Pure Ylang-Ylang",
      slug: "duo-coco-huile-essentielle-ylang-ylang",
      description:
        "Coffret bien-être de l'île aux parfums (Mohéli) : huile essentielle pure de fleur d'Ylang-Ylang de première distillation et baume corporel à l'huile vierge de coco.",
      price: 22000, // KMF (~44 EUR)
      stock: 15,
      isMadeToOrder: false,
      images: ["/images/ylang-oil.jpg"],
      views: 175,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({
      data: prod,
    });
  }
  console.log(`✅ ${productsData.length} produits créés.`);

  // 5. Commande de démonstration
  const sampleProduct = await prisma.product.findFirst({
    where: { storeId: store1.id },
  });

  if (sampleProduct) {
    await prisma.order.create({
      data: {
        orderNumber: "KA-8492",
        storeId: store1.id,
        customerName: "Ahmed Bacar",
        customerPhone: "+2693245678",
        customerAddress: "Quartier Coulée, Rue des Banques",
        customerCity: "Moroni",
        island: "NGAZIDJA",
        note: "Livraison souhaitée avant vendredi pour un cadeau de mariage.",
        totalAmount: sampleProduct.price,
        paymentMethod: "WHATSAPP_DIRECT",
        status: "CONFIRMED",
        items: {
          create: [
            {
              productId: sampleProduct.id,
              quantity: 1,
              unitPrice: sampleProduct.price,
              title: sampleProduct.title,
            },
          ],
        },
      },
    });
    console.log("✅ Commande de test KA-8492 créée.");
  }

  console.log("🎉 Seed KOMO-ART terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
