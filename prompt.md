# 🚀 Spécifications Techniques & Architecture : KOMO-ART (SaaS Multi-Boutiques)

## 1. Rôle et Objectif

Agis comme un **Architecte Logiciel Senior Full-Stack et Expert UI/UX**. Ton objectif est de développer **KOMO-ART**, une plateforme SaaS e-commerce multi-tenant (multi-boutiques) dédiée aux artisans comoriens (menuisiers, couturiers, bijoutiers, sculpteurs, etc.). Chaque artisan peut créer et gérer sa propre boutique en ligne, tandis que les clients peuvent explorer une marketplace globale ou naviguer dans la vitrine dédiée d'un artisan spécifique.

---

## 2. Stack Technique Imposé

- **Framework :** Next.js 15+ (App Router), React, TypeScript (Strict Mode).
- **Base de données :** PostgreSQL (conteneurisé via `docker-compose.yml`).
- **ORM :** Prisma ORM.
- **Authentification :** Better-Auth (Gestion des rôles : `SUPER_ADMIN`, `ARTISAN`, `CUSTOMER`).
- **Styling & UI :** Tailwind CSS + Shadcn/UI + Lucide Icons (Approche **Mobile-First** obligatoire).
- **Gestion des Médias :** Cloudinary (Upload d'images produits, logos et bannières des boutiques).
- **Validation & Formulaires :** React Hook Form + Zod.
- **State Management (Panier) :** Zustand (avec persistance `localStorage`, isolé par boutique).

---

## 3. Identité Visuelle & Design System (Tailwind Config)

- **Bleu Marine (Primaire - KOMO) :** `#0F2C4C`
- **Orange Terracotta (Secondaire - ART / CTA) :** `#D96B27`
- **Or / Doré (Accents / Badges Vérifiés) :** `#C5A059`
- **Fond Principal (Crème / Off-white) :** `#F8F8F6`
- **Typographie :** Sans-serif géométrique moderne (`Plus Jakarta Sans` ou `Montserrat` pour les titres, `Inter` pour le corps).

---

## 4. Infrastructure Docker (`docker-compose.yml`)

Fournis dès le départ un fichier `docker-compose.yml` prêt à l'emploi pour PostgreSQL :

- Image : `postgres:16-alpine`
- Port : `5432:5432`
- Volume persistant pour les données locales.
- Variables d'environnement synchronisées avec le fichier `.env`.

---

## 5. Schéma de Base de Données (`prisma/schema.prisma`)

Implémente un schéma relationnel complet comprenant :

1. **User & Sessions (Standard Better-Auth) :**
   - `id`, `name`, `email`, `emailVerified`, `image`, `role` (`SUPER_ADMIN`, `ARTISAN`, `CUSTOMER`), `createdAt`, `updatedAt`.
2. **Store (Boutique de l'Artisan) :**
   - `id`, `name`, `slug` (unique, indexé), `description`, `logo` (URL Cloudinary), `banner` (URL Cloudinary).
   - `island` (Enum : `NGAZIDJA`, `NDZUWANI`, `MWALI`, `MAORE`) + `city` (ex: Moroni, Mbéni, Mutsamudu).
   - `whatsappNumber` (Format international requis ex: `+269...`).
   - `mobileMoneyNumbers` (JSON ou champs dédiés : `huriMoney`, `mvola`, `orangeMoney`).
   - `isVerified` (Boolean - Badge artisan vérifié), `isActive` (Boolean).
   - `userId` (Relation 1:1 ou 1:N avec `User`).
3. **Category (Catégories d'Artisanat) :**
   - `id`, `name` (ex: Menuiserie & Bois, Couture & Chiromani, Bijouterie, Maroquinerie, Vannerie, Décoration, Cosmétique Naturelle), `slug`, `icon`.
4. **Product (Produits) :**
   - `id`, `title`, `slug`, `description`, `price` (Float/Int en **KMF** - Franc Comorien, avec affichage indicatif optionnel en EUR).
   - `images` ( Tableau d'URLs Cloudinary `String[]`).
   - `stock` (Int), `isMadeToOrder` (Boolean - Fabrication sur commande), `isActive` (Boolean).
   - `storeId` (Relation avec `Store`), `categoryId` (Relation avec `Category`).
5. **Order & OrderItem (Commandes) :**
   - `id`, `orderNumber` (Format court lisible ex: `KA-8492`).
   - `customerName`, `customerPhone`, `customerAddress`, `island`.
   - `totalAmount` (en KMF).
   - `paymentMethod` (Enum : `WHATSAPP_DIRECT`, `HURI_MONEY`, `MVOLA`, `CASH_ON_DELIVERY`).
   - `paymentProofUrl` (String optionnel - Capture d'écran du transfert Mobile Money via Cloudinary) ou `transactionRef` (Code de référence du SMS Mobile Money).
   - `status` (Enum : `PENDING`, `CONFIRMED`, `IN_PRODUCTION`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
   - `storeId` (Chaque commande est rattachée à une boutique spécifique).

---

## 6. Fonctionnalités Clés à Développer

### A. Marketplace Globale & Système de Filtres Avancés (`/explore`)

- **Recherche dynamique** par mot-clé (nom du produit ou nom de l'artisan).
- **Filtres multicritères combinables (URL Search Params) :**
  - Par **Catégorie** (Menuiserie, Bijoux, Couture, etc.).
  - Par **Île / Localisation** (`Ngazidja`, `Ndzuwani`, `Mwali`).
  - Par **Fourchette de prix** (en KMF).
  - Par **Disponibilité** (En stock immédiat vs Sur commande).
  - **Tri :** Plus récents, Prix croissant, Prix décroissant.

### B. Vitrine Individuelle de l'Artisan (`/store/[slug]`)

- En-tête personnalisé avec bannière, logo, biographie de l'artisan, localisation (Île + Ville) et badge "Artisan Vérifié".
- Catalogue filtrable contenant uniquement les créations de cet artisan.
- Bouton flottant ou direct pour contacter l'atelier.

### C. Tunnel de Commande Hybride : WhatsApp Business & Mobile Money

Lorsqu'un client achète dans la boutique d'un artisan, il a 2 options au Checkout :

1. **Option 1 : Commande rapide via WhatsApp Business (`WHATSAPP_DIRECT`)**
   - Enregistre la commande en base de données avec le statut `PENDING`.
   - Génère automatiquement un lien `https://wa.me/{store.whatsappNumber}?text=...` encodé proprement contenant :
     - Le numéro de commande (`#KA-XXXX`).
     - Le détail des articles (Nom, quantité, prix unitaire en KMF).
     - Le montant total en KMF.
     - Les coordonnées de livraison du client (Nom, Téléphone, Île/Ville).
   - Redirige le client vers WhatsApp pour finaliser avec l'artisan.

2. **Option 2 : Paiement par Mobile Money Local (`HURI_MONEY` / `MVOLA`)**
   - Affiche clairement le numéro Mobile Money de l'artisan et le nom du bénéficiaire.
   - Affiche les instructions USSD courtes pour effectuer le dépôt/transfert du montant exact en KMF.
   - Permet au client de saisir la **Référence de transaction SMS** (ou d'uploader la capture d'écran via Cloudinary).
   - Crée la commande et génère également un bouton pour notifier l'artisan sur WhatsApp que le paiement Mobile Money a été envoyé.

### D. Dashboard Artisan (`/dashboard`)

Interface privée protégée par Better-Auth (`role === ARTISAN`) :

- **Vue d'ensemble (Analytics) :** Chiffre d'affaires en KMF, nombre de commandes en attente, produits les plus vus.
- **Gestion des Produits (CRUD) :** Formulaire avec upload multiple d'images vers Cloudinary, gestion des prix et stocks.
- **Gestion des Commandes :** Liste des commandes reçues, vérification des références Mobile Money, changement de statut (`CONFIRMED`, `DELIVERED`, etc.), bouton "Relancer le client sur WhatsApp" en 1 clic.
- **Paramètres Boutique :** Modification du logo, bannière, numéro WhatsApp Business et numéros Mobile Money.

### E. Dashboard Super-Admin (`/admin`)

- Validation des nouvelles boutiques d'artisans (`isVerified`).
- Gestion des catégories globales de la plateforme.
- Vue globale des métriques du SaaS.

---

## 7. Architecture des Dossiers Attendue

```text
src/
├── app/
│   ├── (public)/              # Accueil Komo-Art, /explore (Filtres), /categories
│   ├── store/[slug]/          # Vitrine dédiée d'un artisan + page produit
│   ├── (auth)/                # /login, /register (Artisan & Client via Better-Auth)
│   ├── dashboard/             # Back-office Artisan (Produits, Commandes, Settings)
│   ├── admin/                 # Back-office Super-Admin
│   └── api/                   # Routes API Better-Auth & Webhooks/Upload Cloudinary
├── components/
│   ├── ui/                    # Composants Shadcn/UI
│   ├── marketplace/           # ProductCard, FilterSidebar, CategoryPills, SearchBar
│   ├── store/                 # StoreHeader, WhatsAppCheckoutModal, MobileMoneyForm
│   └── dashboard/             # Sidebar, StatsCards, ProductForm, OrdersTable
├── lib/
│   ├── prisma.ts              # Instance Prisma Singleton
│   ├── auth.ts                # Configuration Better-Auth
│   ├── cloudinary.ts          # Helpers et Server Actions pour upload Cloudinary
│   └── whatsapp.ts            # Générateur de messages formatés pour WhatsApp Business
└── hooks/
    └── use-cart.ts            # Store Zustand pour le panier (par boutique)
```
