import Link from "next/link";
import { requireArtisanStore } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/dashboard/product-form";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const { store } = await requireArtisanStore();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#F8F8F6] py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#0F2C4C]/15 text-[#0F2C4C] hover:bg-[#F8F8F6]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F2C4C]">
              Ajouter une Nouvelle Création
            </h1>
            <p className="text-xs text-[#0F2C4C]/60">
              Atelier {store.name}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xl">
          <ProductForm categories={categories} storeId={store.id} />
        </div>
      </div>
    </div>
  );
}
