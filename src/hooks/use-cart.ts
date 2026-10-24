"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number; // KMF
  image?: string;
  quantity: number;
  maxQuantity?: number; // stock dispo (undefined = sur commande)
}

interface StoreCart {
  storeSlug: string;
  storeName: string;
  items: CartItem[];
}

interface CartState {
  /** Paniers isolés par boutique : { [storeSlug]: StoreCart } */
  carts: Record<string, StoreCart>;
  addItem: (store: { slug: string; name: string }, item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQuantity: (storeSlug: string, productId: string, quantity: number) => void;
  removeItem: (storeSlug: string, productId: string) => void;
  clearCart: (storeSlug: string) => void;
}

const clampQty = (qty: number, max?: number) =>
  Math.max(1, max !== undefined ? Math.min(qty, Math.max(max, 1)) : Math.min(qty, 99));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      carts: {},

      addItem: (store, item, qty = 1) =>
        set((state) => {
          const cart = state.carts[store.slug] ?? { storeSlug: store.slug, storeName: store.name, items: [] };
          const existing = cart.items.find((i) => i.productId === item.productId);
          const items = existing
            ? cart.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, ...item, quantity: clampQty(i.quantity + qty, item.maxQuantity) }
                  : i,
              )
            : [...cart.items, { ...item, quantity: clampQty(qty, item.maxQuantity) }];
          return { carts: { ...state.carts, [store.slug]: { ...cart, storeName: store.name, items } } };
        }),

      updateQuantity: (storeSlug, productId, quantity) =>
        set((state) => {
          const cart = state.carts[storeSlug];
          if (!cart) return state;
          const items = cart.items.map((i) =>
            i.productId === productId ? { ...i, quantity: clampQty(quantity, i.maxQuantity) } : i,
          );
          return { carts: { ...state.carts, [storeSlug]: { ...cart, items } } };
        }),

      removeItem: (storeSlug, productId) =>
        set((state) => {
          const cart = state.carts[storeSlug];
          if (!cart) return state;
          const items = cart.items.filter((i) => i.productId !== productId);
          const carts = { ...state.carts };
          if (items.length === 0) delete carts[storeSlug];
          else carts[storeSlug] = { ...cart, items };
          return { carts };
        }),

      clearCart: (storeSlug) =>
        set((state) => {
          const carts = { ...state.carts };
          delete carts[storeSlug];
          return { carts };
        }),
    }),
    {
      name: "komo-art-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

const EMPTY: CartItem[] = [];

/** Hook pratique : panier d'une boutique donnée + totaux. */
export function useCart(storeSlug: string) {
  const cart = useCartStore((s) => s.carts[storeSlug]);
  const items = cart?.items ?? EMPTY;
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return {
    items,
    count,
    total,
    storeName: cart?.storeName,
    addItem,
    updateQuantity: (productId: string, qty: number) => updateQuantity(storeSlug, productId, qty),
    removeItem: (productId: string) => removeItem(storeSlug, productId),
    clearCart: () => clearCart(storeSlug),
  };
}

/** Nombre total d'articles toutes boutiques confondues (badge header global). */
export function useCartsSummary() {
  const carts = useCartStore((s) => s.carts);
  return Object.values(carts).map((c) => ({
    storeSlug: c.storeSlug,
    storeName: c.storeName,
    count: c.items.reduce((sum, i) => sum + i.quantity, 0),
    total: c.items.reduce((sum, i) => sum + i.quantity * i.price, 0),
  }));
}
