"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatKMF, formatDate } from "@/lib/format";
import { Check, X, Headphones, Sparkles, Clock, AlertCircle } from "lucide-react";

interface RequestItem {
  id: string;
  storeId: string;
  requestedPlan: "BASIC" | "PRO" | "ENTERPRISE";
  billingPeriod: "MONTHLY" | "YEARLY";
  paymentMethod: string;
  transactionRef: string | null;
  notes: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string | Date;
  store: {
    id: string;
    name: string;
    whatsappNumber: string;
    subscriptionPlan: "BASIC" | "PRO" | "ENTERPRISE";
  };
}

export function AdminSubscriptionRequests({ requests }: { requests: RequestItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(requestId: string, status: "APPROVED" | "REJECTED") {
    setLoadingId(requestId);
    try {
      const res = await fetch("/api/admin/subscription-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du traitement");
      }

      toast.success(data.message);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoadingId(null);
    }
  }

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white border border-[#0F2C4C]/10 text-xs text-[#0F2C4C]/60 space-y-1">
        <Clock className="h-6 w-6 text-[#0F2C4C]/30 mx-auto mb-2" />
        <p className="font-bold">Aucune demande d&apos;abonnement en attente</p>
        <p>Les nouvelles demandes de passage en Pro ou Entreprise apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#0F2C4C]/10 bg-white shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#0F2C4C]/10 bg-[#F8F8F6] text-[#0F2C4C]">
            <th className="py-3 px-4 font-bold">Boutique</th>
            <th className="py-3 px-4 font-bold">Forfait Demandé</th>
            <th className="py-3 px-4 font-bold">Période</th>
            <th className="py-3 px-4 font-bold">Moyen de Règlement</th>
            <th className="py-3 px-4 font-bold">Réf. Transaction</th>
            <th className="py-3 px-4 font-bold">Date</th>
            <th className="py-3 px-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0F2C4C]/5">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-[#F8F8F6]/60 transition-colors">
              <td className="py-3 px-4">
                <span className="font-bold text-[#0F2C4C] block">{req.store.name}</span>
                <span className="text-[10px] text-[#0F2C4C]/60">{req.store.whatsappNumber}</span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    req.requestedPlan === "ENTERPRISE"
                      ? "bg-[#0F2C4C] text-[#C5A059]"
                      : "bg-[#D96B27]/10 text-[#D96B27]"
                  }`}
                >
                  {req.requestedPlan === "ENTERPRISE" ? (
                    <Headphones className="h-3 w-3" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  {req.requestedPlan}
                </span>
              </td>
              <td className="py-3 px-4 text-[#0F2C4C]/80 font-medium">
                {req.billingPeriod === "YEARLY" ? "Annuel (-20%)" : "Mensuel"}
              </td>
              <td className="py-3 px-4 font-semibold text-[#0F2C4C]">
                {req.paymentMethod}
              </td>
              <td className="py-3 px-4 font-mono font-bold text-[#D96B27]">
                {req.transactionRef || "—"}
              </td>
              <td className="py-3 px-4 text-[#0F2C4C]/60">
                {formatDate(req.createdAt)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={loadingId === req.id}
                    onClick={() => handleAction(req.id, "APPROVED")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Valider & Activer
                  </button>
                  <button
                    type="button"
                    disabled={loadingId === req.id}
                    onClick={() => handleAction(req.id, "REJECTED")}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 disabled:opacity-50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Rejeter
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
