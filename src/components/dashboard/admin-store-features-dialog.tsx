"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles,
  Headphones,
  Globe2,
  Megaphone,
  CheckCircle,
  XCircle,
  Sliders,
  X,
  Save,
  ShieldCheck,
  Store as StoreIcon,
} from "lucide-react";

export interface StoreFeaturesData {
  id: string;
  name: string;
  slug: string;
  subscriptionPlan: "BASIC" | "PRO" | "ENTERPRISE";
  billingPeriod: "MONTHLY" | "YEARLY";
  hasMarketingTools: boolean;
  hasTelepromoter: boolean;
  hasInternationalShipping: boolean;
  telepromoterName: string | null;
  telepromoterPhone: string | null;
  isVerified: boolean;
  isActive: boolean;
}

interface AdminStoreFeaturesDialogProps {
  store: StoreFeaturesData;
}

export function AdminStoreFeaturesDialog({ store }: AdminStoreFeaturesDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [plan, setPlan] = useState<"BASIC" | "PRO" | "ENTERPRISE">(store.subscriptionPlan);
  const [billingPeriod, setBillingPeriod] = useState<"MONTHLY" | "YEARLY">(store.billingPeriod || "MONTHLY");
  const [hasMarketingTools, setHasMarketingTools] = useState(store.hasMarketingTools);
  const [hasTelepromoter, setHasTelepromoter] = useState(store.hasTelepromoter);
  const [hasInternationalShipping, setHasInternationalShipping] = useState(store.hasInternationalShipping);
  const [telepromoterName, setTelepromoterName] = useState(store.telepromoterName || "");
  const [telepromoterPhone, setTelepromoterPhone] = useState(store.telepromoterPhone || "");
  const [isVerified, setIsVerified] = useState(store.isVerified);
  const [isActive, setIsActive] = useState(store.isActive);

  function handlePlanPreset(selectedPlan: "BASIC" | "PRO" | "ENTERPRISE") {
    setPlan(selectedPlan);
    if (selectedPlan === "ENTERPRISE") {
      setHasMarketingTools(true);
      setHasTelepromoter(true);
      setHasInternationalShipping(true);
      if (!telepromoterName) setTelepromoterName("Amina (Télévendeuse KOMO-ART)");
      if (!telepromoterPhone) setTelepromoterPhone("+269 333 45 67");
    } else if (selectedPlan === "PRO") {
      setHasMarketingTools(true);
      setHasTelepromoter(false);
      setHasInternationalShipping(true);
    } else {
      setHasMarketingTools(false);
      setHasTelepromoter(false);
      setHasInternationalShipping(false);
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stores/${store.id}/features`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionPlan: plan,
          billingPeriod,
          hasMarketingTools,
          hasTelepromoter,
          telepromoterName: hasTelepromoter ? telepromoterName : null,
          telepromoterPhone: hasTelepromoter ? telepromoterPhone : null,
          hasInternationalShipping,
          isVerified,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de mise à jour");

      toast.success(data.message || "Fonctionnalités mises à jour !");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Gérer les fonctionnalités et options de cet atelier"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#0F2C4C]/15 bg-white text-xs font-bold text-[#0F2C4C] hover:bg-[#0F2C4C] hover:text-white shadow-2xs transition-all"
      >
        <Sliders className="h-3.5 w-3.5 text-[#D96B27]" />
        <span>Fonctionnalités</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            {/* Header Dialog */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0F2C4C] text-[#C5A059] flex items-center justify-center">
                  <StoreIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0F2C4C]">
                    Fonctionnalités de l&apos;Atelier : {store.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">/store/{store.slug}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 1. Choix du Forfait SaaS */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#0F2C4C] uppercase tracking-wider">
                Forfait SaaS Associé
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "BASIC", label: "Basic", desc: "Vitrine simple" },
                  { id: "PRO", label: "Pro", desc: "Marketing + Export" },
                  { id: "ENTERPRISE", label: "Entreprise", desc: "Télévendeur VIP" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePlanPreset(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      plan === item.id
                        ? "border-[#D96B27] bg-[#D96B27]/5 shadow-xs"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="font-extrabold text-xs text-[#0F2C4C]">{item.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Options et modules activés */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-extrabold text-[#0F2C4C] uppercase tracking-wider">
                Modules & Fonctionnalités Granulaires
              </label>

              {/* Module Marketing */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 hover:bg-[#F8F8F6] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={hasMarketingTools}
                  onChange={(e) => setHasMarketingTools(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-md border-stone-300 text-[#D96B27] focus:ring-[#D96B27]"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-[#0F2C4C] flex items-center gap-1.5">
                    <Megaphone className="h-3.5 w-3.5 text-purple-600" />
                    Outils Marketing & Bannières
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Permet à l&apos;artisan de configurer une bannière promotionnelle et de mettre en avant ses pièces phares.
                  </div>
                </div>
              </label>

              {/* Module Télévendeur */}
              <div className="p-3.5 rounded-2xl border border-stone-200 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTelepromoter}
                    onChange={(e) => setHasTelepromoter(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-md border-stone-300 text-[#D96B27] focus:ring-[#D96B27]"
                  />
                  <div className="space-y-0.5 text-xs">
                    <div className="font-bold text-[#0F2C4C] flex items-center gap-1.5">
                      <Headphones className="h-3.5 w-3.5 text-[#D96B27]" />
                      Service Télévendeur Dédié (KOMO-ART VIP)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Un agent commercial dédié gère les relances WhatsApp et clôture les ventes pour cet artisan.
                    </div>
                  </div>
                </label>

                {hasTelepromoter && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#0F2C4C]">
                        Nom du Télévendeur
                      </label>
                      <input
                        type="text"
                        value={telepromoterName}
                        onChange={(e) => setTelepromoterName(e.target.value)}
                        placeholder="Ex : Amina (Conseillère Moroni)"
                        className="w-full rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#0F2C4C]">
                        Ligne WhatsApp Télévendeur
                      </label>
                      <input
                        type="text"
                        value={telepromoterPhone}
                        onChange={(e) => setTelepromoterPhone(e.target.value)}
                        placeholder="+269 333 45 67"
                        className="w-full rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-mono font-medium focus:border-[#D96B27] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Module Expédition Internationale */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 hover:bg-[#F8F8F6] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={hasInternationalShipping}
                  onChange={(e) => setHasInternationalShipping(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-md border-stone-300 text-[#D96B27] focus:ring-[#D96B27]"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-[#0F2C4C] flex items-center gap-1.5">
                    <Globe2 className="h-3.5 w-3.5 text-sky-600" />
                    Expédition Internationale (Diaspora Comorienne & Export)
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Affiche le badge &quot;Livraison Diaspora Disponible&quot; sur les créations de cet atelier.
                  </div>
                </div>
              </label>

              {/* Badges & État Boutique */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-2xl border border-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="h-4 w-4 rounded-md border-stone-300 text-[#C5A059] focus:ring-[#C5A059]"
                  />
                  <span className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-[#C5A059]" />
                    Artisan Vérifié
                  </span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-2xl border border-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded-md border-stone-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <span className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1">
                    {isActive ? (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-600" />
                    )}
                    Vitrine Active
                  </span>
                </label>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0F2C4C] text-white text-xs font-bold hover:bg-[#183e68] shadow-md transition-all"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{loading ? "Enregistrement..." : "Appliquer les Modifications"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
