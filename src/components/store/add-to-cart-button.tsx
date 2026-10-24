"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  store: {
    slug: string;
    name: string;
  };
  product: {
    productId: string;
    slug: string;
    title: string;
    price: number;
    image?: string;
    maxQuantity?: number;
  };
}

export function AddToCartButton({ store, product }: AddToCartButtonProps) {
  const { addItem } = useCart(store.slug);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(store, product, 1);
    setAdded(true);
    toast.success(`"${product.title}" ajouté au panier !`);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Button
      onClick={handleAdd}
      size="lg"
      className="w-full shadow-lg gap-2 text-base font-bold"
    >
      {added ? (
        <>
          <Check className="h-5 w-5 text-white" />
          <span>Ajouté au Panier !</span>
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          <span>Ajouter au Panier</span>
        </>
      )}
    </Button>
  );
}
