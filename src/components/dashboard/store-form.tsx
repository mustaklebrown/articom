"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ISLANDS } from "@/lib/constants";
import { toast } from "sonner";
import { slugify } from "@/lib/format";
import type { Island } from "@/generated/prisma/enums";
import { ImageUpload } from "@/components/ui/image-upload";

interface StoreFormProps {
  initialData?: any;
  defaultValues?: {
    whatsappNumber?: string;
  };
}

export function StoreForm({ initialData, defaultValues }: StoreFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [island, setIsland] = useState<Island>(initialData?.island || "NGAZIDJA");
  const [city, setCity] = useState(initialData?.city || "Moroni");
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialData?.whatsappNumber || defaultValues?.whatsappNumber || ""
  );
  const [mobileMoneyName, setMobileMoneyName] = useState(initialData?.mobileMoneyName || "");
  const [huriMoney, setHuriMoney] = useState(initialData?.huriMoney || "");
  const [mvola, setMvola] = useState(initialData?.mvola || "");
  const [orangeMoney, setOrangeMoney] = useState(initialData?.orangeMoney || "");
  const [banner, setBanner] = useState(initialData?.banner || "/images/hero-workshop.jpg");
  const [logo, setLogo] = useState(initialData?.logo || "/images/wood-chest.jpg");
  const [loading, setLoading] = useState(false);

  function handleNameChange(val: string) {
    setName(val);
    if (!initialData) {
      setSlug(slugify(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData ? `/api/store/update` : `/api/store/create`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          island,
          city,
          whatsappNumber,
          mobileMoneyName,
          huriMoney,
          mvola,
          orangeMoney,
          banner,
          logo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur d'enregistrement.");
      }

      toast.success(initialData ? "Boutique mise à jour !" : "Boutique créée avec succès !");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F2C4C] pb-2 border-b border-[#0F2C4C]/10">
          Informations de l&apos;Atelier
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Nom de la Boutique / Atelier *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="ex: Atelier Mshangama"
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Lien web (slug) *
            </label>
            <div className="flex items-center">
              <span className="text-[11px] text-[#0F2C4C]/50 px-2.5 py-2.5 bg-[#F8F8F6] rounded-l-xl border border-r-0 border-[#0F2C4C]/20">
                /store/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="h-10 w-full rounded-r-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
            Biographie / Description de vos créations
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Présentez votre atelier, vos techniques et votre histoire..."
            className="w-full rounded-xl border border-[#0F2C4C]/20 bg-white p-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Île de localisation *
            </label>
            <select
              value={island}
              onChange={(e) => {
                const isl = e.target.value as Island;
                setIsland(isl);
                const found = ISLANDS.find((i) => i.value === isl);
                if (found && found.cities[0]) setCity(found.cities[0]);
              }}
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            >
              {ISLANDS.map((isl) => (
                <option key={isl.value} value={isl.value}>
                  {isl.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Ville / Localité *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="ex: Moroni, Mutsamudu..."
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>

          {/* Identité visuelle (Logo & Bannière) */}
          <div className="pt-4 border-t border-[#0F2C4C]/10 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F2C4C]">
              Identité Visuelle & Bannières
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUpload
                value={logo}
                onChange={setLogo}
                folder="stores"
                label="Logo de l'Atelier / Photo d'artisan"
                aspectRatio="square"
              />
              <ImageUpload
                value={banner}
                onChange={setBanner}
                folder="banners"
                label="Bannière d'en-tête de votre vitrine"
                aspectRatio="banner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Business & Mobile Money */}
      <div className="space-y-4 pt-4 border-t border-[#0F2C4C]/10">
        <h3 className="font-bold text-sm uppercase tracking-wider text-[#0F2C4C] pb-2 border-b border-[#0F2C4C]/10">
          WhatsApp Business & Paiements Mobile Money
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Numéro WhatsApp Business (Format International) *
            </label>
            <input
              type="tel"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+2693245678"
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Nom du Bénéficiaire Mobile Money
            </label>
            <input
              type="text"
              value={mobileMoneyName}
              onChange={(e) => setMobileMoneyName(e.target.value)}
              placeholder="ex: Ali Mshangama"
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Numéro Huri Money
            </label>
            <input
              type="tel"
              value={huriMoney}
              onChange={(e) => setHuriMoney(e.target.value)}
              placeholder="+2693XXXXXX"
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Numéro MVola
            </label>
            <input
              type="tel"
              value={mvola}
              onChange={(e) => setMvola(e.target.value)}
              placeholder="+2693XXXXXX"
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
              Numéro Orange Money
            </label>
            <input
              type="tel"
              value={orangeMoney}
              onChange={(e) => setOrangeMoney(e.target.value)}
              placeholder="+2694XXXXXX"
              className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} size="lg" className="w-full shadow-lg">
        {loading ? "Enregistrement..." : initialData ? "Mettre à jour la boutique" : "Créer ma Boutique"}
      </Button>
    </form>
  );
}
