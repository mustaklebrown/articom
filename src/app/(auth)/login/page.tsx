"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Identifiants incorrects.");
      } else {
        toast.success("Connexion réussie !");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F8F8F6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F2C4C] text-white font-extrabold text-xl shadow-md">
            <span className="text-[#D96B27]">K</span>A
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#0F2C4C]">
            KOMO<span className="text-[#D96B27]">-ART</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#0F2C4C]">
          Connexion à votre Espace
        </h2>
        <p className="text-xs text-[#0F2C4C]/60">
          Artisans & Gestionnaires de Vitrine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#0F2C4C] block mb-1.5">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@mshangama.km"
                className="h-11 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3.5 text-sm text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
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
                className="h-11 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3.5 text-sm text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
              />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full shadow-lg">
              {loading ? "Connexion..." : "Se Connecter"}
            </Button>
          </form>

          <div className="mt-6 border-t border-[#0F2C4C]/10 pt-4 text-center">
            <p className="text-xs text-[#0F2C4C]/70">
              Pas encore de compte ?{" "}
              <Link
                href="/register?type=artisan"
                className="font-bold text-[#D96B27] hover:underline"
              >
                Créer une boutique artisan
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
