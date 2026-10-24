"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?: "navbar" | "admin" | "ghost" | "icon";
  redirectTo?: string;
}

export function LogoutButton({
  className = "",
  variant = "navbar",
  redirectTo = "/login",
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await signOut();
      toast.success("Vous avez été déconnecté.");
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "admin") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        title="Se déconnecter"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white/90 text-xs font-bold hover:bg-rose-500/20 hover:text-rose-300 transition-colors ${className}`}
      >
        <LogOut className="h-3.5 w-3.5" />
        <span>{loading ? "..." : "Déconnexion"}</span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        title="Se déconnecter"
        aria-label="Se déconnecter"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#0F2C4C]/15 text-[#0F2C4C]/80 hover:bg-rose-50 hover:text-rose-600 transition-colors ${className}`}
      >
        <LogOut className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Se déconnecter"
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0F2C4C]/15 text-xs sm:text-sm font-bold text-[#0F2C4C]/80 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all ${className}`}
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{loading ? "..." : "Déconnexion"}</span>
    </button>
  );
}
