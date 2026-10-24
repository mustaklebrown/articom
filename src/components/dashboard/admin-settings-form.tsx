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

      <div className="flex items-center justify-end pt-2">
        <Button type="submit" disabled={loading} size="lg" className="shadow-md">
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Enregistrement..." : "Enregistrer les Configurations"}
        </Button>
      </div>
    </form>
  );
}
