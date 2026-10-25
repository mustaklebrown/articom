"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Save,
  Phone,
  MessageCircle,
  Coins,
  Megaphone,
  Mail,
  ShieldAlert,
  Sparkles,
  Sliders,
  UserPlus,
  Store,
  Headphones,
  Globe2,
  CreditCard,
  CloudUpload,
} from "lucide-react";

interface AdminSettingsFormProps {
  initialSettings: Record<string, string>;
}

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [loading, setLoading] = useState(false);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur de mise à jour");
      }

      toast.success(data.message || "Configurations enregistrées avec succès !");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Impossible d'enregistrer les paramètres");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* 1. RÈGLEMENTS & MOBILE MONEY OFFICIEL KOMO-ART */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#0F2C4C]/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D96B27]/10 text-[#D96B27]">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2C4C]">
              Coordonnées Mobile Money Officielles de la Plateforme
            </h3>
            <p className="text-xs text-[#0F2C4C]/60">
              Ces numéros sont affichés aux artisans lorsqu&apos;ils souscrivent à un abonnement Pro ou Entreprise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Numéro Huri Money (Comores Telecom)
            </label>
            <input
              type="text"
              value={settings.PLATFORM_HURI_MONEY || ""}
              onChange={(e) => handleChange("PLATFORM_HURI_MONEY", e.target.value)}
              placeholder="+269 333 00 00"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Numéro MVola (Telma Comores)
            </label>
            <input
              type="text"
              value={settings.PLATFORM_MVOLA || ""}
              onChange={(e) => handleChange("PLATFORM_MVOLA", e.target.value)}
              placeholder="+269 444 00 00"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            Ligne WhatsApp Conciergerie Officielle KOMO-ART
          </label>
          <input
            type="text"
            value={settings.WHATSAPP_CONCIERGE || ""}
            onChange={(e) => handleChange("WHATSAPP_CONCIERGE", e.target.value)}
            placeholder="+269 333 99 99"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
          />
        </div>
      </div>

      {/* 2. FINANCES, COMMISSIONS & DEVISES */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#0F2C4C]/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2C4C] text-[#C5A059]">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2C4C]">
              Paramètres Financiers & Taux de Change
            </h3>
            <p className="text-xs text-[#0F2C4C]/60">
              Taux de conversion KMF/EUR et pourcentages de commission sur les ventes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Taux Parité KMF pour 1 Euro
            </label>
            <input
              type="text"
              value={settings.KMF_PER_EUR || "491.96775"}
              onChange={(e) => handleChange("KMF_PER_EUR", e.target.value)}
              placeholder="491.96775"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
            <p className="text-[10px] text-[#0F2C4C]/50">Parité officielle fixe</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Commission Forfait Basic (%)
            </label>
            <input
              type="text"
              value={settings.COMMISSION_BASIC || "5"}
              onChange={(e) => handleChange("COMMISSION_BASIC", e.target.value)}
              placeholder="5"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Commission Forfait Pro (%)
            </label>
            <input
              type="text"
              value={settings.COMMISSION_PRO || "2.5"}
              onChange={(e) => handleChange("COMMISSION_PRO", e.target.value)}
              placeholder="2.5"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3. COMMUNICATION & ANNONCES GLOBALES */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#0F2C4C]/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2C4C]">
              Communication Globale & Support
            </h3>
            <p className="text-xs text-[#0F2C4C]/60">
              Messages diffusés sur la marketplace et contact d&apos;assistance.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0F2C4C]">
            Message d&apos;Annonce Globale (Haut de page)
          </label>
          <input
            type="text"
            value={settings.GLOBAL_ANNOUNCEMENT || ""}
            onChange={(e) => handleChange("GLOBAL_ANNOUNCEMENT", e.target.value)}
            placeholder="Ex : Bienvenue sur KOMO-ART — Lancement de la saison des mariages comoriens !"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email de Contact Support Super-Admin
            </label>
            <input
              type="email"
              value={settings.PLATFORM_EMAIL || "contact@komo-art.km"}
              onChange={(e) => handleChange("PLATFORM_EMAIL", e.target.value)}
              placeholder="contact@komo-art.km"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              Mode Maintenance Plateforme
            </label>
            <select
              value={settings.MAINTENANCE_MODE || "false"}
              onChange={(e) => handleChange("MAINTENANCE_MODE", e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="false">Désactivé (Marketplace en ligne)</option>
              <option value="true">Activé (Accès restreint pour maintenance)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. CONTRÔLE DES MODULES & FONCTIONNALITÉS GLOBALES (FEATURE FLAGS) */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#0F2C4C]/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2C4C]/5 text-[#0F2C4C]">
            <Sliders className="h-5 w-5 text-[#D96B27]" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2C4C]">
              Contrôle des Modules & Fonctionnalités Plateforme (Feature Flags)
            </h3>
            <p className="text-xs text-[#0F2C4C]/60">
              Activez ou suspendez les grands modules fonctionnels de la marketplace KOMO-ART en temps réel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Inscriptions */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#F8F8F6] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
                <UserPlus className="h-4 w-4 text-[#D96B27]" />
                Inscriptions Ouvertes
              </div>
              <p className="text-[11px] text-stone-500">
                Autorise de nouveaux acheteurs et artisans à créer un compte.
              </p>
            </div>
            <select
              value={settings.FEATURE_ALLOW_REGISTRATIONS || "true"}
              onChange={(e) => handleChange("FEATURE_ALLOW_REGISTRATIONS", e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="true">Activé</option>
              <option value="false">Fermé</option>
            </select>
          </div>

          {/* Création de Boutiques */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#F8F8F6] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
                <Store className="h-4 w-4 text-[#0F2C4C]" />
                Création de Boutiques
              </div>
              <p className="text-[11px] text-stone-500">
                Autorise les artisans à ouvrir un nouvel atelier en ligne.
              </p>
            </div>
            <select
              value={settings.FEATURE_ALLOW_STORE_CREATION || "true"}
              onChange={(e) => handleChange("FEATURE_ALLOW_STORE_CREATION", e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="true">Activé</option>
              <option value="false">Fermé</option>
            </select>
          </div>

          {/* Commandes WhatsApp */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#F8F8F6] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                Commandes Directes WhatsApp
              </div>
              <p className="text-[11px] text-stone-500">
                Affiche les boutons d&apos;achat et de contact WhatsApp sur les créations.
              </p>
            </div>
            <select
              value={settings.FEATURE_WHATSAPP_CHECKOUT || "true"}
              onChange={(e) => handleChange("FEATURE_WHATSAPP_CHECKOUT", e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="true">Activé</option>
              <option value="false">Désactivé</option>
            </select>
          </div>

          {/* Outils Marketing */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#F8F8F6] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
                <Megaphone className="h-4 w-4 text-purple-600" />
                Outils Marketing & Bannières
              </div>
              <p className="text-[11px] text-stone-500">
                Active le module de bannières promo et mise en avant pour les artisans.
              </p>
            </div>
            <select
              value={settings.FEATURE_MARKETING_TOOLS || "true"}
              onChange={(e) => handleChange("FEATURE_MARKETING_TOOLS", e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="true">Activé</option>
              <option value="false">Désactivé</option>
            </select>
          </div>

          {/* Télévendeur Dédié */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#F8F8F6] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-[#D96B27]" />
                Service Télévendeur Dédié
              </div>
              <p className="text-[11px] text-stone-500">
                Active le service commercial télévendeur KOMO-ART aux Comores.
              </p>
            </div>
            <select
              value={settings.FEATURE_TELEPROMOTER || "true"}
              onChange={(e) => handleChange("FEATURE_TELEPROMOTER", e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="true">Activé</option>
              <option value="false">Désactivé</option>
            </select>
          </div>

          {/* Expédition Internationale */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#F8F8F6] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-sky-600" />
                Expédition Internationale (Diaspora)
              </div>
              <p className="text-[11px] text-stone-500">
                Affiche les options de fret et livraison vers la France et l&apos;international.
              </p>
            </div>
            <select
              value={settings.FEATURE_INTERNATIONAL_SHIPPING || "true"}
              onChange={(e) => handleChange("FEATURE_INTERNATIONAL_SHIPPING", e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="true">Activé</option>
              <option value="false">Désactivé</option>
            </select>
          </div>

          {/* Abonnements SaaS Payants */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#F8F8F6] flex items-center justify-between gap-4 sm:col-span-2">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Souscriptions & Abonnements Payants en Ligne
              </div>
              <p className="text-[11px] text-stone-500">
                Permet aux artisans de soumettre des demandes d&apos;abonnements Pro et Entreprise avec règlement Mobile Money.
              </p>
            </div>
            <select
              value={settings.FEATURE_SUBSCRIPTIONS || "true"}
              onChange={(e) => handleChange("FEATURE_SUBSCRIPTIONS", e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
            >
              <option value="true">Activé (Paiements d&apos;abonnements ouverts)</option>
              <option value="false">Désactivé (Accès gratuit ou sur invitation)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. CONFIGURATION CLOUDINARY & STOCKAGE MÉDIAS */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#0F2C4C]/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
            <CloudUpload className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2C4C]">
              Configuration Cloudinary (Upload d&apos;Images)
            </h3>
            <p className="text-xs text-[#0F2C4C]/60">
              Paramètres pour l&apos;upload haute performance des photos de créations, logos et bannières. En cas d&apos;absence de ces clés, le système bascule automatiquement sur Neon Object Storage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Cloudinary Cloud Name
            </label>
            <input
              type="text"
              value={settings.CLOUDINARY_CLOUD_NAME || ""}
              onChange={(e) => handleChange("CLOUDINARY_CLOUD_NAME", e.target.value)}
              placeholder="ex: dyxxxxxxx"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Cloudinary API Key
            </label>
            <input
              type="text"
              value={settings.CLOUDINARY_API_KEY || ""}
              onChange={(e) => handleChange("CLOUDINARY_API_KEY", e.target.value)}
              placeholder="ex: 628986692437749"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Cloudinary API Secret
            </label>
            <input
              type="password"
              value={settings.CLOUDINARY_API_SECRET || ""}
              onChange={(e) => handleChange("CLOUDINARY_API_SECRET", e.target.value)}
              placeholder="••••••••••••••••••••••••••••"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F2C4C]">
              Dossier Cloudinary (Folder racine)
            </label>
            <input
              type="text"
              value={settings.CLOUDINARY_UPLOAD_FOLDER || "KOMO-ART"}
              onChange={(e) => handleChange("CLOUDINARY_UPLOAD_FOLDER", e.target.value)}
              placeholder="KOMO-ART"
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2">
        <Button type="submit" disabled={loading} size="lg" className="shadow-md">
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Enregistrement..." : "Enregistrer les Configurations"}
        </Button>
      </div>
    </form>
  );
}
