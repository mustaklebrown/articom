"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Role } from "@/generated/prisma/enums";

export function AdminRoleSelector({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(currentRole);
  const [loading, setLoading] = useState(false);

  async function handleRoleChange(newRole: Role) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) throw new Error("Erreur de modification du rôle");

      setRole(newRole);
      toast.success("Rôle utilisateur mis à jour !");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={role}
      disabled={loading}
      onChange={(e) => handleRoleChange(e.target.value as Role)}
      className="h-8 rounded-lg border border-[#0F2C4C]/20 bg-white px-2 text-xs font-semibold text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none disabled:opacity-50"
    >
      <option value="CUSTOMER">Client (CUSTOMER)</option>
      <option value="ARTISAN">Artisan (ARTISAN)</option>
      <option value="SUPER_ADMIN">Super-Admin (SUPER_ADMIN)</option>
    </select>
  );
}
