"use client";

import Link from "next/link";
import { formatKMF, formatDate } from "@/lib/format";
import {
  Headphones,
  PhoneCall,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Clock,
  Globe2,
  TrendingUp,
} from "lucide-react";

interface TelepromoterManagerProps {
  store: {
    id: string;
    name: string;
    subscriptionPlan: "BASIC" | "PRO" | "ENTERPRISE";
    hasTelepromoter: boolean;
    telepromoterName: string | null;
    telepromoterPhone: string | null;
  };
  pendingOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    createdAt: Date | string;
  }[];
}

export function TelepromoterManager({ store, pendingOrders }: TelepromoterManagerProps) {
  const isEnterprise = store.subscriptionPlan === "ENTERPRISE" || store.hasTelepromoter;
  const advisorName = store.telepromoterName || "Amina (Conseillère Télévente Diaspora)";
  const advisorPhone = store.telepromoterPhone || "+269 333 45 67";
  const cleanPhone = advisorPhone.replace(/[^0-9]/g, "");

  if (!isEnterprise) {
    return (
      <div className="space-y-8">
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-gradient-to-br from-[#0F2C4C] via-[#13345a] to-[#0F2C4C] text-white p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C5A059]/20 text-[#C5A059] mx-auto">
            <Headphones className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] px-3 py-1 rounded-full bg-white/10">
              Exclusivité Forfait Entreprise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Un Télévendeur Dédié pour démultiplier vos ventes
            </h2>
            <p className="text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
              Ne perdez plus aucune vente. Un conseiller commercial KOMO-ART prend en charge vos clients, répond aux questions de la diaspora et relance par téléphone les commandes non finalisées.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs space-y-1">
              <PhoneCall className="h-5 w-5 text-[#C5A059]" />
              <div className="font-bold text-xs">Permanence d&apos;Appels</div>
              <div className="text-[11px] text-white/70">Disponibilité 6j/7 pour renseigner vos clients</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs space-y-1">
              <TrendingUp className="h-5 w-5 text-[#D96B27]" />
              <div className="font-bold text-xs">Relance Paniers</div>
              <div className="text-[11px] text-white/70">Relance téléphonique proactive des acheteurs</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs space-y-1">
              <Globe2 className="h-5 w-5 text-emerald-400" />
              <div className="font-bold text-xs">Ventes Diaspora</div>
              <div className="text-[11px] text-white/70">Accompagnement France, Mayotte & Réunion</div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C5A059] px-6 py-3 text-sm font-bold text-[#0F2C4C] hover:bg-[#d8b56f] shadow-lg transition-colors"
            >
              <span>Passer au Forfait Entreprise (45 000 KMF/mois)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F2C4C] text-[#C5A059] text-[10px] font-extrabold uppercase tracking-wider mb-1">
          <Headphones className="h-3 w-3" />
          Service Télévendeur Attitré
        </div>
        <h2 className="text-2xl font-extrabold text-[#0F2C4C]">
          Votre Force Commerciale Dédiée KOMO-ART
        </h2>
        <p className="text-xs text-[#0F2C4C]/60 mt-0.5">
          Ce conseiller prend les appels de vos clients, répond aux questions en shikomori & français et assure le suivi des commandes.
        </p>
      </div>

      {/* Carte du Télévendeur Attitré */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F2C4C] text-[#C5A059] text-xl font-extrabold shrink-0 shadow-md">
            <Headphones className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#0F2C4C]">{advisorName}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                En ligne
              </span>
            </div>
            <p className="text-xs text-[#0F2C4C]/60">
              Conseillère commerciale référente pour votre atelier • Ligne directe :{" "}
              <strong className="font-mono text-[#0F2C4C]">{advisorPhone}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${cleanPhone}?text=Bonjour%20${encodeURIComponent(advisorName)},%20je%20suis%20l'artisan%20de%20l'atelier%20${encodeURIComponent(store.name)}.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Échanger sur WhatsApp
          </a>
        </div>
      </div>

      {/* Commandes en attente de relance */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#0F2C4C]">
              Commandes en Attente de Relance ({pendingOrders.length})
            </h3>
            <p className="text-xs text-[#0F2C4C]/60">
              Ces commandes non finalisées sont automatiquement suivies par votre télévendeur.
            </p>
          </div>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#0F2C4C]/50 space-y-1">
            <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
            <p className="font-bold text-[#0F2C4C]">Toutes vos commandes sont à jour !</p>
            <p>Aucun panier abandonné ou commande en attente actuellement.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#0F2C4C]/10 text-[#0F2C4C]/50 uppercase font-bold tracking-wider">
                  <th className="pb-3">Commande</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Montant</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Statut Télévente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F2C4C]/5">
                {pendingOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8F8F6]/60">
                    <td className="py-3 font-mono font-bold text-[#D96B27]">{o.orderNumber}</td>
                    <td className="py-3 font-semibold text-[#0F2C4C]">
                      <div>{o.customerName}</div>
                      <div className="text-[11px] text-[#0F2C4C]/50 font-mono">{o.customerPhone}</div>
                    </td>
                    <td className="py-3 font-bold text-[#0F2C4C]">{formatKMF(o.totalAmount)}</td>
                    <td className="py-3 text-[#0F2C4C]/60">{formatDate(o.createdAt)}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F2C4C]/10 text-[#0F2C4C]">
                        <Clock className="h-3 w-3 text-[#D96B27]" />
                        Relance programmée
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
