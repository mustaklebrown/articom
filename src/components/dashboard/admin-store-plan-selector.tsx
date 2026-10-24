"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/generated/prisma/enums";

export function AdminStorePlanSelector({
  storeId,
  currentPlan,
}: {
  storeId: string;
  currentPlan: SubscriptionPlan;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<SubscriptionPlan>(currentPlan);
  const [loading, setLoading] = useState(false);

  async function handleChange(newPlan: SubscriptionPlan) {
    if (newPlan === plan) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/store-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, plan: newPlan }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la modification");
      }

      setPlan(newPlan);
      toast.success(data.message || `Forfait mis à jour en ${newPlan}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Impossible de changer le forfait");
    } finally {
      setLoading(false);
    }
  }

  const badgeColor =
    plan === "ENTERPRISE"
      ? "bg-[#0F2C4C] text-[#C5A059] border-[#0F2C4C]"
      : plan === "PRO"
      ? "bg-[#D96B27]/10 text-[#D96B27] border-[#D96B27]/30"
      : "bg-stone-100 text-stone-700 border-stone-200";

  return (
    <select
      value={plan}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value as SubscriptionPlan)}
      aria-label="Sélectionner le forfait d'abonnement"
      className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${badgeColor}`}
    >
      <option value="BASIC">Basic (Gratuit)</option>
      <option value="PRO">Pro (Marketing)</option>
      <option value="ENTERPRISE">Entreprise (Télévendeur)</option>
    </select>
  );
}
