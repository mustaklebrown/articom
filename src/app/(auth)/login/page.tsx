"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn, ShieldCheck, KeyRound, AlertCircle, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const errorParam = searchParams.get("error");
  const requiredRole = searchParams.get("required");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function fillSuperAdmin() {
    setEmail("admin@komo-art.km");
    setPassword("AdminPassword2026!");
    toast.info("Identifiants Super-Admin préremplis !");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Identifiants incorrects.");
      } else {
        toast.success("Connexion réussie !");
        
        // Redirection intelligente selon le rôle ou l'URL demandée
        if (nextParam) {
          router.push(nextParam);
        } else if (email.trim().toLowerCase() === "admin@komo-art.km") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-8 shadow-xl space-y-6">
      {/* Alerte si accès refusé à /admin */}
      {errorParam === "forbidden" && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Accès réservé au Super-Admin</p>
            <p className="text-[11px] text-amber-800">
              La page demandée requiert le rôle <strong>SUPER_ADMIN</strong>. Connectez-vous avec le compte administrateur officiel ci-dessous.
            </p>
          </div>
        </div>
      )}

      {/* Raccourci Démo Super-Admin */}
      <div className="rounded-2xl bg-[#0F2C4C]/5 border border-[#0F2C4C]/10 p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#0F2C4C]">
          <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
          <span className="font-bold">Espace Super-Admin ?</span>
        </div>
        <button
          type="button"
          onClick={fillSuperAdmin}
          className="text-[11px] font-bold text-[#D96B27] hover:underline flex items-center gap-1"
        >
          <KeyRound className="h-3 w-3" />
          Préremplir Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1.5">
            Adresse Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@komo-art.km ou artisan@..."
            className="h-11 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3.5 text-xs sm:text-sm text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1.5">
            Mot de Passe *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3.5 text-xs sm:text-sm text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
          />
        </div>

        <Button type="submit" disabled={loading} size="lg" className="w-full shadow-lg mt-2">
          <LogIn className="h-4 w-4 mr-1.5" />
          {loading ? "Connexion en cours..." : "Se Connecter"}
        </Button>
      </form>

      <div className="border-t border-[#0F2C4C]/10 pt-4 text-center">
        <p className="text-xs text-[#0F2C4C]/70">
          Pas encore de compte artisan ?{" "}
          <Link
            href="/register?type=artisan"
            className="font-bold text-[#D96B27] hover:underline"
          >
            Créer ma vitrine
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F8F8F6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-white shadow-xs border border-[#0F2C4C]/10 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
            <Image
              src="/images/komo-art-emblem.png"
              alt="KOMO-ART Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#0F2C4C]">
            KOMO<span className="text-[#D96B27]">-ART</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#0F2C4C]">
          Connexion à votre Espace
        </h2>
        <p className="text-xs text-[#0F2C4C]/60">
          Super-Admin, Artisans & Gestionnaires de Vitrine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="p-8 text-center text-xs text-[#0F2C4C]/50">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
