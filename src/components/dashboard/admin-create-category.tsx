"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function AdminCreateCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Store");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      toast.success(`Catégorie "${name}" créée avec succès !`);
      setName("");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Erreur de création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nouvelle catégorie (ex: Poterie, Tressage...)"
        className="h-10 flex-1 rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
      />
      <Button type="submit" disabled={loading} size="sm" className="gap-1.5 h-10 px-4">
        <Plus className="h-4 w-4" />
        <span>Ajouter</span>
      </Button>
    </form>
  );
}
