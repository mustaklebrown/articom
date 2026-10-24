"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Store, User } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "artisan" ? "ARTISAN" : "CUSTOMER";

  const [accountType, setAccountType] = useState<"ARTISAN" | "CUSTOMER">(initialType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      toast.error("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        email,
        password,
        name,
        // @ts-ignore
        phone,
      });

      if (res.error) {
        toast.error(res.error.message || "Erreur lors de l'inscription.");
      } else {
        toast.success("Compte créé avec succès !");
        if (accountType === "ARTISAN") {
          router.push("/onboarding");
        } else {
          router.push("/explore");
        }
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-8 shadow-xl space-y-6">
      {/* Sélection type de compte */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAccountType("ARTISAN")}
          className={`flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all ${
            accountType === "ARTISAN"
              ? "border-[#D96B27] bg-[#D96B27]/10 text-[#D96B27] font-bold"
              : "border-[#0F2C4C]/10 text-[#0F2C4C]/70 hover:bg-[#F8F8F6]"
          }`}
        >
          <Store className="h-5 w-5 mb-1 text-[#D96B27]" />
          <span className="text-xs">Je suis Artisan</span>
        </button>

        <button
          type="button"
          onClick={() => setAccountType("CUSTOMER")}
          className={`flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all ${
            accountType === "CUSTOMER"
              ? "border-[#0F2C4C] bg-[#0F2C4C]/10 text-[#0F2C4C] font-bold"
              : "border-[#0F2C4C]/10 text-[#0F2C4C]/70 hover:bg-[#F8F8F6]"
          }`}
        >
          <User className="h-5 w-5 mb-1 text-[#0F2C4C]" />
          <span className="text-xs">Je suis Client</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
            {accountType === "ARTISAN" ? "Nom de l'Artisan / Maître d'Atelier *" : "Nom complet *"}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Fundi Ali"
            className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
            Adresse Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="artisan@komo-art.km"
            className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
            Numéro WhatsApp / Téléphone *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+2693XXXXXX"
            className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Mot de Passe *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 car."
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Confirmer *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répéter"
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} size="lg" className="w-full shadow-lg mt-2">
          {loading ? "Création du compte..." : "Créer mon Compte"}
        </Button>
      </form>

      <div className="border-t border-[#0F2C4C]/10 pt-4 text-center">
        <p className="text-xs text-[#0F2C4C]/70">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-bold text-[#D96B27] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
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
          Rejoignez l&apos;Aventure KOMO-ART
        </h2>
        <p className="text-xs text-[#0F2C4C]/60">
          Choisissez votre profil pour continuer
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="p-8 text-center text-xs text-[#0F2C4C]/50">Chargement...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
