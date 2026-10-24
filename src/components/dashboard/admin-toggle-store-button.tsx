"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Power, PowerOff } from "lucide-react";

export function AdminToggleStoreButton({
  storeId,
  isActive,
}: {
  storeId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/toggle-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, isActive: !isActive }),
      });

      if (!res.ok) throw new Error("Erreur de modification");

      toast.success(
        !isActive ? "Boutique réactivée avec succès !" : "Boutique suspendue."
      );
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={isActive ? "secondary" : "default"}
      size="sm"
      className="text-xs gap-1.5"
    >
      {isActive ? (
        <>
          <PowerOff className="h-3 w-3 text-amber-600" />
          <span>Suspendre</span>
        </>
      ) : (
        <>
          <Power className="h-3 w-3 text-emerald-600" />
          <span>Activer</span>
        </>
      )}
    </Button>
  );
}
