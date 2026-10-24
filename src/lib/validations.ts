import { z } from "zod";

const phoneRegex = /^\+?\d{7,15}$/;
const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === "" || phoneRegex.test(v.replace(/[\s-]/g, "")), {
    message: "Numéro de téléphone invalide (ex: +2693XXXXXX ou 3XXXXXX)",
  });

export const islandEnum = z.enum(["NGAZIDJA", "NDZUWANI", "MWALI", "MAORE"]);
export const paymentMethodEnum = z.enum(["WHATSAPP_DIRECT", "HURI_MONEY", "MVOLA", "CASH_ON_DELIVERY"]);
export const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PRODUCTION",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

// ─── Auth ────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nom trop court"),
    email: z.string().trim().email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string(),
    accountType: z.enum(["CUSTOMER", "ARTISAN"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });
export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Boutique ────────────────────────────────────────────────

export const storeSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(60),
  slug: z
    .string()
    .trim()
    .min(2, "2 caractères minimum")
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Minuscules, chiffres et tirets uniquement"),
  description: z.string().trim().max(1500).optional().or(z.literal("")),
  island: islandEnum,
  city: z.string().trim().min(2, "Ville requise"),
  whatsappNumber: z
    .string()
    .trim()
    .refine((v) => phoneRegex.test(v.replace(/[\s-]/g, "")), {
      message: "Numéro WhatsApp requis (ex: +2693XXXXXX)",
    }),
  logo: z.string().optional().or(z.literal("")),
  banner: z.string().optional().or(z.literal("")),
  mobileMoneyName: z.string().trim().max(80).optional().or(z.literal("")),
  huriMoney: optionalPhone.optional().or(z.literal("")),
  mvola: optionalPhone.optional().or(z.literal("")),
  orangeMoney: optionalPhone.optional().or(z.literal("")),
});
export type StoreInput = z.infer<typeof storeSchema>;

// ─── Produit ─────────────────────────────────────────────────

export const productSchema = z
  .object({
    title: z.string().trim().min(3, "Titre trop court").max(120),
    description: z.string().trim().max(4000).optional().or(z.literal("")),
    price: z
      .number({ message: "Prix requis" })
      .int("Prix entier en KMF")
      .min(100, "Minimum 100 KMF")
      .max(100_000_000),
    stock: z.number({ message: "Stock requis" }).int().min(0),
    isMadeToOrder: z.boolean(),
    isActive: z.boolean(),
    categoryId: z.string().min(1, "Catégorie requise"),
    images: z.array(z.string()).min(1, "Ajoutez au moins une image").max(8),
  })
  .refine((d) => d.isMadeToOrder || d.stock >= 0, { path: ["stock"], message: "Stock invalide" });
export type ProductInput = z.infer<typeof productSchema>;

// ─── Checkout ────────────────────────────────────────────────

export const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(2, "Nom requis").max(80),
    customerPhone: z
      .string()
      .trim()
      .min(7, "Téléphone requis")
      .max(20),
    customerAddress: z.string().trim().min(3, "Adresse / quartier requis").max(200),
    customerCity: z.string().trim().max(80).optional().or(z.literal("")),
    island: islandEnum,
    note: z.string().trim().max(500).optional().or(z.literal("")),
    paymentMethod: paymentMethodEnum,
    transactionRef: z.string().trim().max(60).optional().or(z.literal("")),
    paymentProofUrl: z.string().optional().or(z.literal("")),
  })
  .refine(
    (d) =>
      !(d.paymentMethod === "HURI_MONEY" || d.paymentMethod === "MVOLA") ||
      Boolean(d.transactionRef) ||
      Boolean(d.paymentProofUrl),
    {
      path: ["transactionRef"],
      message: "Saisissez la référence SMS ou ajoutez une capture d'écran",
    },
  );
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const checkoutItemsSchema = z
  .array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    }),
  )
  .min(1, "Panier vide")
  .max(50);

// ─── Catégorie (admin) ───────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  icon: z.string().trim().max(40).optional().or(z.literal("")),
});
export type CategoryInput = z.infer<typeof categorySchema>;
