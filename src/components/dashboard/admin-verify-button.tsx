"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export function AdminVerifyStoreButton({
  storeId,
  isVerified,
}: {
  storeId: string;
  isVerified: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, isVerified: !isVerified }),
      });

      if (!res.ok) throw new Error("Erreur de mise à jour");

      toast.success(
        !isVerified ? "Boutique certifiée avec succès !" : "Certification retirée."
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
      variant={isVerified ? "outline" : "gold"}
      size="sm"
      className="text-xs"
    >
      {isVerified ? "Retirer le badge" : "Certifier Artisan"}
    </Button>
  );
}
