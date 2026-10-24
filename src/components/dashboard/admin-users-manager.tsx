"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Store,
  ShoppingBag,
  Trash2,
  Download,
  AlertTriangle,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "SUPER_ADMIN" | "ARTISAN" | "CUSTOMER";
  phone: string | null;
  banned: boolean;
  banReason: string | null;
  createdAt: string | Date;
  store: {
    id: string;
    name: string;
    slug: string;
    subscriptionPlan: string;
    isVerified: boolean;
    isActive: boolean;
    _count?: { products: number };
  } | null;
  _count?: { orders: number };
}

interface AdminUsersManagerProps {
  initialUsers: AdminUserItem[];
  currentAdminEmail: string;
}

export function AdminUsersManager({
  initialUsers,
  currentAdminEmail,
}: AdminUsersManagerProps) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [banModalUser, setBanModalUser] = useState<AdminUserItem | null>(null);
  const [banReasonInput, setBanReasonInput] = useState("");
  const [deleteModalUser, setDeleteModalUser] = useState<AdminUserItem | null>(null);

  // Filtrage intelligent
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.store && u.store.name.toLowerCase().includes(q));

      const matchRole =
        roleFilter === "ALL" || u.role === roleFilter;

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && !u.banned) ||
        (statusFilter === "BANNED" && u.banned) ||
        (statusFilter === "VERIFIED" && u.emailVerified) ||
        (statusFilter === "UNVERIFIED" && !u.emailVerified);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Statistiques globales
  const stats = useMemo(() => {
    return {
      total: users.length,
      superAdmins: users.filter((u) => u.role === "SUPER_ADMIN").length,
      artisans: users.filter((u) => u.role === "ARTISAN").length,
      customers: users.filter((u) => u.role === "CUSTOMER").length,
      banned: users.filter((u) => u.banned).length,
    };
  }, [users]);

  // Action : Changement de rôle
  async function handleRoleChange(userId: string, newRole: "SUPER_ADMIN" | "ARTISAN" | "CUSTOMER") {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de modification");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Rôle changé en ${newRole}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  // Action : Basculer Vérification Email
  async function handleToggleEmailVerified(user: AdminUserItem) {
    const nextVal = !user.emailVerified;
    setActionLoading(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailVerified: nextVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de mise à jour");

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, emailVerified: nextVal } : u))
      );
      toast.success(nextVal ? "Email marqué comme vérifié" : "Email marqué comme non-vérifié");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  // Action : Suspendre / Réactiver l'utilisateur
  async function handleConfirmBan() {
    if (!banModalUser) return;
    const userId = banModalUser.id;
    const nextBanned = !banModalUser.banned;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banned: nextBanned,
          banReason: nextBanned ? banReasonInput || "Non-respect des règles de la marketplace" : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la suspension");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                banned: nextBanned,
                banReason: nextBanned ? banReasonInput || "Non-respect des règles" : null,
              }
            : u
        )
      );

      toast.success(
        nextBanned
          ? `Le compte ${banModalUser.email} a été suspendu.`
          : `Le compte ${banModalUser.email} a été réactivé.`
      );
      setBanModalUser(null);
      setBanReasonInput("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  // Action : Supprimer l'utilisateur
  async function handleConfirmDelete() {
    if (!deleteModalUser) return;
    const userId = deleteModalUser.id;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de suppression");

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success(data.message || "Utilisateur supprimé définitivement");
      setDeleteModalUser(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  // Action : Exporter en CSV
  function exportCSV() {
    const headers = ["ID,Nom,Email,Email Verifie,Telephone,Role,Statut,Boutique,Commandes,Date Inscription"];
    const rows = filteredUsers.map((u) => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      u.emailVerified ? "Oui" : "Non",
      `"${u.phone || ""}"`,
      u.role,
      u.banned ? "Suspendu" : "Actif",
      `"${u.store ? u.store.name.replace(/"/g, '""') : ""}"`,
      u._count?.orders ?? 0,
      `"${formatDate(u.createdAt)}"`,
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `komo-art-utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fichier CSV généré avec succès !");
  }

  return (
    <div className="space-y-6">
      {/* 1. STATS BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[#0F2C4C]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase">
            <span>Total Comptes</span>
            <Users className="h-4 w-4 text-[#0F2C4C]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F2C4C] mt-1">{stats.total}</div>
        </div>

        <div className="rounded-2xl border border-[#0F2C4C]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase">
            <span>Artisans</span>
            <Store className="h-4 w-4 text-[#D96B27]" />
          </div>
          <div className="text-2xl font-extrabold text-[#D96B27] mt-1">{stats.artisans}</div>
        </div>

        <div className="rounded-2xl border border-[#0F2C4C]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase">
            <span>Acheteurs</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F2C4C] mt-1">{stats.customers}</div>
        </div>

        <div className="rounded-2xl border border-[#0F2C4C]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]/60 uppercase">
            <span>Super-Admins</span>
            <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
          </div>
          <div className="text-2xl font-extrabold text-[#C5A059] mt-1">{stats.superAdmins}</div>
        </div>

        <div
          className={`rounded-2xl border p-4 shadow-xs col-span-2 sm:col-span-1 ${
            stats.banned > 0
              ? "border-rose-300 bg-rose-50/70"
              : "border-[#0F2C4C]/10 bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase">
            <span>Suspendus</span>
            <UserX className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">{stats.banned}</div>
        </div>
      </div>

      {/* 2. RECHERCHE & FILTRES */}
      <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F2C4C]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, tél, boutique..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-[#F8F8F6] text-xs font-medium focus:border-[#D96B27] focus:bg-white focus:outline-hidden transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Filtre Rôle */}
          <div className="flex items-center gap-1 bg-[#F8F8F6] p-1 rounded-2xl border border-stone-200">
            {["ALL", "SUPER_ADMIN", "ARTISAN", "CUSTOMER"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  roleFilter === role
                    ? "bg-[#0F2C4C] text-white shadow-xs"
                    : "text-[#0F2C4C]/70 hover:text-[#0F2C4C]"
                }`}
              >
                {role === "ALL" ? "Tous" : role === "SUPER_ADMIN" ? "Admin" : role === "ARTISAN" ? "Artisans" : "Clients"}
              </button>
            ))}
          </div>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-stone-200 bg-[#F8F8F6] px-3.5 py-2 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIVE">Comptes Actifs</option>
            <option value="BANNED">Comptes Suspendus</option>
            <option value="VERIFIED">Email Vérifié</option>
            <option value="UNVERIFIED">Email Non Vérifié</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            title="Exporter en CSV"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-[#0F2C4C]/15 bg-white text-xs font-bold text-[#0F2C4C] hover:bg-[#F8F8F6] shadow-2xs transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 3. TABLEAU DES UTILISATEURS */}
      <div className="overflow-x-auto rounded-3xl border border-[#0F2C4C]/10 bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#0F2C4C]/10 bg-[#F8F8F6] text-[#0F2C4C] font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Utilisateur</th>
              <th className="py-3.5 px-4">Email & Vérification</th>
              <th className="py-3.5 px-4">Rôle & Droits</th>
              <th className="py-3.5 px-4">Boutique / Commandes</th>
              <th className="py-3.5 px-4">Inscription</th>
              <th className="py-3.5 px-4 text-right">Actions Contrôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0F2C4C]/5">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-500">
                  <UserX className="h-8 w-8 mx-auto text-stone-300 mb-2" />
                  <p className="font-bold">Aucun utilisateur ne correspond à vos critères.</p>
                  <p className="text-[11px] text-stone-400">Modifiez votre recherche ou vos filtres.</p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isRootAdmin = u.email === "admin@komo-art.km";
                const isCurrentAdmin = u.email === currentAdminEmail;

                return (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      u.banned
                        ? "bg-rose-50/40 hover:bg-rose-50/70"
                        : "hover:bg-[#F8F8F6]/70"
                    }`}
                  >
                    {/* Nom + Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                            u.banned
                              ? "bg-rose-100 text-rose-700 border border-rose-300"
                              : u.role === "SUPER_ADMIN"
                              ? "bg-[#0F2C4C] text-[#C5A059]"
                              : u.role === "ARTISAN"
                              ? "bg-[#D96B27]/15 text-[#D96B27]"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#0F2C4C] flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isRootAdmin && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#C5A059]/20 text-[#8C6D27] uppercase">
                                Principal
                              </span>
                            )}
                          </div>
                          {u.banned ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                              <ShieldAlert className="h-3 w-3" />
                              Suspendu : {u.banReason || "Règles violées"}
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-500 font-mono">
                              {u.phone || "Tél non renseigné"}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email + Email Vérifié toggle */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="font-mono text-[11px] text-[#0F2C4C]/90 font-medium">
                          {u.email}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleEmailVerified(u)}
                          disabled={actionLoading === u.id}
                          title="Cliquer pour basculer le statut de vérification"
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                            u.emailVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {u.emailVerified ? (
                            <>
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              Email Vérifié
                            </>
                          ) : (
                            <>
                              <Clock className="h-2.5 w-2.5" />
                              Non Vérifié
                            </>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Rôle */}
                    <td className="py-3.5 px-4">
                      {isRootAdmin ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#C5A059] bg-[#0F2C4C] px-2.5 py-1 rounded-xl">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          SUPER_ADMIN
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(
                              u.id,
                              e.target.value as "SUPER_ADMIN" | "ARTISAN" | "CUSTOMER"
                            )
                          }
                          disabled={actionLoading === u.id}
                          className="rounded-xl border border-stone-200 bg-white px-2.5 py-1 text-xs font-bold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
                        >
                          <option value="CUSTOMER">CUSTOMER (Acheteur)</option>
                          <option value="ARTISAN">ARTISAN (Vendeur)</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN (Admin)</option>
                        </select>
                      )}
                    </td>

                    {/* Boutique / Commandes */}
                    <td className="py-3.5 px-4">
                      {u.store ? (
                        <div className="space-y-0.5">
                          <Link
                            href={`/store/${u.store.slug}`}
                            target="_blank"
                            className="font-bold text-[#D96B27] hover:underline flex items-center gap-1"
                          >
                            <Store className="h-3 w-3" />
                            {u.store.name}
                          </Link>
                          <div className="text-[10px] text-stone-500">
                            {u.store._count?.products ?? 0} produits • Forfait {u.store.subscriptionPlan}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-stone-500">
                          <ShoppingBag className="h-3 w-3 text-stone-400" />
                          <span>{u._count?.orders ?? 0} commandes passées</span>
                        </div>
                      )}
                    </td>

                    {/* Date d'inscription */}
                    <td className="py-3.5 px-4 text-[#0F2C4C]/60 text-[11px] whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>

                    {/* Actions de modération */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Bouton Détails */}
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          title="Voir les détails complets du profil"
                          className="p-1.5 rounded-xl border border-[#0F2C4C]/15 text-[#0F2C4C] hover:bg-[#0F2C4C] hover:text-white transition-colors"
                        >
                          <Users className="h-3.5 w-3.5" />
                        </button>

                        {/* Bouton Suspendre / Réactiver */}
                        {!isRootAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setBanModalUser(u);
                              setBanReasonInput(u.banReason || "");
                            }}
                            title={u.banned ? "Réactiver ce compte" : "Suspendre ce compte"}
                            className={`p-1.5 rounded-xl border transition-colors ${
                              u.banned
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                                : "border-rose-200 bg-rose-50/60 text-rose-600 hover:bg-rose-600 hover:text-white"
                            }`}
                          >
                            {u.banned ? (
                              <UserCheck className="h-3.5 w-3.5" />
                            ) : (
                              <UserX className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}

                        {/* Bouton Supprimer */}
                        {!isRootAdmin && !isCurrentAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeleteModalUser(u)}
                            title="Supprimer définitivement cet utilisateur"
                            className="p-1.5 rounded-xl border border-stone-200 text-stone-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1 : DÉTAILS DE L'UTILISATEUR */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0F2C4C] text-[#C5A059] flex items-center justify-center font-extrabold text-sm">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0F2C4C]">
                    Fiche Utilisateur : {selectedUser.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">{selectedUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#0F2C4C]/60 uppercase text-[10px]">Email</span>
                <p className="font-mono font-medium text-[#0F2C4C]">{selectedUser.email}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#0F2C4C]/60 uppercase text-[10px]">Téléphone</span>
                <p className="font-mono font-medium text-[#0F2C4C]">{selectedUser.phone || "—"}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#0F2C4C]/60 uppercase text-[10px]">Rôle Actuel</span>
                <p className="font-bold text-[#0F2C4C]">{selectedUser.role}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#0F2C4C]/60 uppercase text-[10px]">Statut du Compte</span>
                <p className="font-bold">
                  {selectedUser.banned ? (
                    <span className="text-rose-600">Suspendu ({selectedUser.banReason})</span>
                  ) : (
                    <span className="text-emerald-600">Actif & Autorisé</span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#0F2C4C]/60 uppercase text-[10px]">Email Vérifié</span>
                <p className="font-medium text-[#0F2C4C]">
                  {selectedUser.emailVerified ? "Oui" : "Non (en attente)"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#0F2C4C]/60 uppercase text-[10px]">Inscription</span>
                <p className="text-[#0F2C4C]">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>

            {/* Section Boutique (si artisan) */}
            {selectedUser.store && (
              <div className="rounded-2xl border border-[#0F2C4C]/10 bg-[#F8F8F6] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F2C4C]">
                  <span className="flex items-center gap-1.5">
                    <Store className="h-4 w-4 text-[#D96B27]" />
                    Atelier : {selectedUser.store.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0F2C4C] text-[#C5A059] font-extrabold">
                    Forfait {selectedUser.store.subscriptionPlan}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <span>Créations enregistrées : {selectedUser.store._count?.products ?? 0}</span>
                  <Link
                    href={`/store/${selectedUser.store.slug}`}
                    target="_blank"
                    className="font-bold text-[#D96B27] hover:underline"
                  >
                    Voir la vitrine ↗
                  </Link>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-[#0F2C4C] text-white text-xs font-bold hover:bg-[#183e68]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 : SUSPENDRE / RÉACTIVER L'UTILISATEUR */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  banModalUser.banned
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {banModalUser.banned ? (
                  <UserCheck className="h-6 w-6" />
                ) : (
                  <ShieldAlert className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0F2C4C]">
                  {banModalUser.banned ? "Réactiver l'utilisateur" : "Suspendre l'utilisateur"}
                </h3>
                <p className="text-xs text-stone-500 font-mono">{banModalUser.email}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              {banModalUser.banned
                ? "En réactivant cet utilisateur, il pourra de nouveau se connecter à la marketplace et accéder à ses services."
                : "En suspendant cet utilisateur, toutes ses sessions actives seront révoquées immédiatement et il ne pourra plus se connecter."}
            </p>

            {!banModalUser.banned && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F2C4C]">
                  Motif de la suspension (optionnel) :
                </label>
                <input
                  type="text"
                  value={banReasonInput}
                  onChange={(e) => setBanReasonInput(e.target.value)}
                  placeholder="Ex : Non-respect des conditions de vente, litige..."
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-medium focus:border-[#D96B27] focus:outline-hidden"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setBanModalUser(null);
                  setBanReasonInput("");
                }}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                disabled={actionLoading === banModalUser.id}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                  banModalUser.banned
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {banModalUser.banned ? "Confirmer la Réactivation" : "Confirmer la Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3 : CONFIRMATION DE SUPPRESSION */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-rose-900">
                  Suppression Définitive
                </h3>
                <p className="text-xs text-stone-500 font-mono">{deleteModalUser.email}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Êtes-vous absolument sûr de vouloir supprimer définitivement le compte de{" "}
              <strong>{deleteModalUser.name}</strong> ? Cette action est irréversible et supprimera
              ses données, sessions et boutique associée si existante.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={actionLoading === deleteModalUser.id}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm transition-all"
              >
                Supprimer Définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
