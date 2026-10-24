"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { slugify } from "@/lib/format";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  storeId: string;
}

export function ProductForm({ categories, storeId }: ProductFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">(1);
  const [isMadeToOrder, setIsMadeToOrder] = useState(false);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [imageUrl, setImageUrl] = useState("/images/wood-chest.jpg");
  const [loading, setLoading] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || price === "" || !categoryId) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          title,
          slug,
          description,
          price: Number(price),
          stock: isMadeToOrder ? 0 : Number(stock),
          isMadeToOrder,
          categoryId,
          images: [imageUrl],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur de création.");
      }

      toast.success("Produit ajouté avec succès !");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
          Titre de la création *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="ex: Coffre Traditionnel en Palissandre"
          className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
            Catégorie d&apos;artisanat *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
            Prix en KMF (Franc Comorien) *
          </label>
          <input
            type="number"
            required
            min={100}
            value={price}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
            placeholder="ex: 45000"
            className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
            Stock disponible
          </label>
          <input
            type="number"
            min={0}
            disabled={isMadeToOrder}
            value={stock}
            onChange={(e) => setStock(e.target.value ? Number(e.target.value) : "")}
            className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none disabled:opacity-50"
          />
        </div>

        <div className="pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isMadeToOrder}
              onChange={(e) => setIsMadeToOrder(e.target.checked)}
              className="rounded text-[#D96B27]"
            />
            <span className="text-xs font-bold text-[#0F2C4C]">
              Fabrication sur commande uniquement
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
          Description & Histoire de la pièce
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Matières utilisées, dimensions, inspirations..."
          className="w-full rounded-xl border border-[#0F2C4C]/20 bg-white p-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-[#0F2C4C] block mb-1">
          Image de présentation (URL ou image locale)
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="/images/wood-chest.jpg"
          className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
        />
      </div>

      <Button type="submit" disabled={loading} size="lg" className="w-full shadow-lg">
        {loading ? "Création..." : "Publier sur la Marketplace"}
      </Button>
    </form>
  );
}
