"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatKMF, formatEUR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Smartphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { buildOrderMessage, buildPaymentSentMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import type { Island, PaymentMethod } from "@/generated/prisma/enums";

interface StoreCheckoutDrawerProps {
  store: {
    id: string;
    name: string;
    slug: string;
    whatsappNumber: string;
    mobileMoneyName?: string | null;
    huriMoney?: string | null;
    mvola?: string | null;
    orangeMoney?: string | null;
    island: Island;
    city: string;
  };
}

export function StoreCheckoutDrawer({ store }: StoreCheckoutDrawerProps) {
  const { items, total, count, updateQuantity, removeItem, clearCart } = useCart(store.slug);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");

  // Formulaire Checkout
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState(store.city);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("WHATSAPP_DIRECT");
  const [transactionRef, setTransactionRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  if (count === 0 && !isOpen) return null;

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error("Veuillez remplir vos coordonnées de livraison.");
      return;
    }

    if ((paymentMethod === "HURI_MONEY" || paymentMethod === "MVOLA") && !transactionRef) {
      toast.error("Veuillez saisir la référence de transaction SMS reçue après votre transfert.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Création de la commande côté serveur
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          storeSlug: store.slug,
          customerName,
          customerPhone,
          customerAddress,
          customerCity,
          island: store.island,
          note,
          paymentMethod,
          transactionRef: transactionRef || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création de la commande");
      }

      setCreatedOrder(data.order);
      setStep("success");
      clearCart();
      toast.success("Commande enregistrée avec succès !");

      // Si WhatsApp direct, ouvrir le lien automatiquement
      if (paymentMethod === "WHATSAPP_DIRECT") {
        const msg = buildOrderMessage({
          orderNumber: data.order.orderNumber,
          storeName: store.name,
          items: items.map((i) => ({
            title: i.title,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          totalAmount: total,
          customerName,
          customerPhone,
          customerAddress,
          customerCity,
          island: store.island,
          paymentMethod,
          note,
        });
        const waLink = buildWhatsAppLink(store.whatsappNumber, msg);
        window.open(waLink, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Bouton Panier Flottant en bas à droite */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#0F2C4C] px-5 py-3 text-white shadow-2xl hover:bg-[#D96B27] transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D96B27] text-xs font-extrabold text-white">
            {count}
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-semibold text-white/70 uppercase">
            Panier {store.name}
          </div>
          <div className="text-sm font-extrabold">{formatKMF(total)}</div>
        </div>
      </button>

      {/* MODAL / DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in-50">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-[#0F2C4C]/10">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-[#0F2C4C]/10 px-6 py-4 bg-[#F8F8F6]">
              <div>
                <h3 className="font-extrabold text-[#0F2C4C] text-lg">
                  {step === "cart" && `Panier Atelier : ${store.name}`}
                  {step === "checkout" && "Finaliser ma Commande"}
                  {step === "success" && "Commande Confirmée !"}
                </h3>
                <span className="text-xs text-[#0F2C4C]/60">
                  {step === "cart" && `${count} article${count > 1 ? "s" : ""}`}
                  {step === "checkout" && "WhatsApp Business & Mobile Money"}
                  {step === "success" && `Réf: #${createdOrder?.orderNumber}`}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (step === "success") setStep("cart");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F2C4C]/5 text-[#0F2C4C] hover:bg-[#0F2C4C]/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* CONTENU MODAL */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ÉTAPE 1 : LISTE DES ARTICLES */}
              {step === "cart" && (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-[#0F2C4C]/5 bg-[#F8F8F6]"
                      >
                        <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white">
                          <Image
                            src={item.image || "/images/wood-chest.jpg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-[#0F2C4C] truncate">
                            {item.title}
                          </h4>
                          <div className="text-xs font-extrabold text-[#D96B27]">
                            {formatKMF(item.price)}
                          </div>
                        </div>

                        {/* Sélecteur quantité */}
                        <div className="flex items-center gap-1.5 bg-white rounded-xl border border-[#0F2C4C]/10 p-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg text-[#0F2C4C] hover:bg-[#F8F8F6]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#0F2C4C]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg text-[#0F2C4C] hover:bg-[#F8F8F6]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Supprimer */}
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-[#0F2C4C]/40 hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Récapitulatif Total */}
                  <div className="pt-4 border-t border-[#0F2C4C]/10 space-y-2">
                    <div className="flex justify-between text-sm text-[#0F2C4C]/70">
                      <span>Sous-total</span>
                      <span>{formatKMF(total)}</span>
                    </div>
                    <div className="flex justify-between items-baseline font-extrabold text-[#0F2C4C] text-lg">
                      <span>Total à régler</span>
                      <div className="text-right">
                        <div>{formatKMF(total)}</div>
                        <div className="text-xs text-[#0F2C4C]/50 font-normal">
                          {formatEUR(total)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep("checkout")}
                    size="lg"
                    className="w-full shadow-lg"
                  >
                    Passer la commande ({formatKMF(total)})
                  </Button>
                </>
              )}

              {/* ÉTAPE 2 : TUNNEL DE COMMANDE HYBRIDE */}
              {step === "checkout" && (
                <form onSubmit={handleCreateOrder} className="space-y-5">
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F2C4C]">
                      1. Coordonnées de Livraison
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#0F2C4C]/80 block mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="ex: Ahmed Bacar"
                          className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#0F2C4C]/80 block mb-1">
                          Numéro WhatsApp / Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+2693245678"
                          className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0F2C4C]/80 block mb-1">
                        Adresse / Quartier de livraison *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="ex: Coulée, près de la grande mosquée"
                        className="h-10 w-full rounded-xl border border-[#0F2C4C]/20 bg-white px-3 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Mode de paiement */}
                  <div className="space-y-3 pt-3 border-t border-[#0F2C4C]/10">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F2C4C]">
                      2. Choix du Mode de Règlement
                    </h4>

                    {/* Option 1: WhatsApp Direct */}
                    <label
                      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "WHATSAPP_DIRECT"
                          ? "border-[#25D366] bg-[#25D366]/5 shadow-xs"
                          : "border-[#0F2C4C]/10 hover:bg-[#F8F8F6]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "WHATSAPP_DIRECT"}
                        onChange={() => setPaymentMethod("WHATSAPP_DIRECT")}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-bold text-sm text-[#0F2C4C]">
                          <MessageCircle className="h-4 w-4 text-[#25D366]" />
                          <span>Finaliser directement sur WhatsApp</span>
                        </div>
                        <p className="text-xs text-[#0F2C4C]/70 mt-1">
                          Votre panier sera automatiquement envoyé sur le WhatsApp de l&apos;artisan avec toutes les instructions.
                        </p>
                      </div>
                    </label>

                    {/* Option 2: Mobile Money Local */}
                    {(store.huriMoney || store.mvola) && (
                      <label
                        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === "HURI_MONEY" || paymentMethod === "MVOLA"
                            ? "border-[#D96B27] bg-[#D96B27]/5 shadow-xs"
                            : "border-[#0F2C4C]/10 hover:bg-[#F8F8F6]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "HURI_MONEY" || paymentMethod === "MVOLA"}
                          onChange={() =>
                            setPaymentMethod(store.huriMoney ? "HURI_MONEY" : "MVOLA")
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-bold text-sm text-[#0F2C4C]">
                            <Smartphone className="h-4 w-4 text-[#D96B27]" />
                            <span>Paiement par Mobile Money (Huri Money / MVola)</span>
                          </div>
                          <p className="text-xs text-[#0F2C4C]/70 mt-1">
                            Transférez le montant exact sur le compte Mobile Money de l&apos;artisan.
                          </p>
                        </div>
                      </label>
                    )}

                    {/* Bloc instructions Mobile Money */}
                    {(paymentMethod === "HURI_MONEY" || paymentMethod === "MVOLA") && (
                      <div className="p-4 rounded-2xl bg-[#0F2C4C] text-white space-y-3 animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#C5A059] uppercase">
                            Bénéficiaire de l&apos;Atelier
                          </span>
                          <span className="text-xs font-semibold text-white/80">
                            {store.mobileMoneyName || store.name}
                          </span>
                        </div>

                        {store.huriMoney && (
                          <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2">
                            <span>Huri Money :</span>
                            <span className="font-extrabold text-[#C5A059]">{store.huriMoney}</span>
                          </div>
                        )}

                        {store.mvola && (
                          <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2">
                            <span>MVola :</span>
                            <span className="font-extrabold text-[#D96B27]">{store.mvola}</span>
                          </div>
                        )}

                        <div className="border-t border-white/10 pt-2">
                          <label className="text-xs font-bold text-white block mb-1">
                            Référence SMS de la transaction *
                          </label>
                          <input
                            type="text"
                            required
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder="ex: TXN-892302"
                            className="h-10 w-full rounded-xl bg-white/10 px-3 text-xs text-white placeholder:text-white/40 border border-white/20 focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("cart")}
                      className="w-1/3"
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-2/3 shadow-lg"
                    >
                      {isSubmitting ? "Validation..." : `Confirmer (${formatKMF(total)})`}
                    </Button>
                  </div>
                </form>
              )}

              {/* ÉTAPE 3 : CONFIRMATION COMMANDE */}
              {step === "success" && createdOrder && (
                <div className="text-center py-6 space-y-5">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-[#0F2C4C]">
                      Marahaba ! Votre commande est enregistrée
                    </h4>
                    <p className="text-xs text-[#0F2C4C]/70 mt-1">
                      Numéro de commande :{" "}
                      <span className="font-bold text-[#D96B27]">#{createdOrder.orderNumber}</span>
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F8F6] p-4 text-left text-xs space-y-2 border border-[#0F2C4C]/10">
                    <div className="flex justify-between">
                      <span className="text-[#0F2C4C]/60">Atelier :</span>
                      <span className="font-bold text-[#0F2C4C]">{store.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#0F2C4C]/60">Montant total :</span>
                      <span className="font-bold text-[#0F2C4C]">
                        {formatKMF(createdOrder.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#0F2C4C]/60">Mode de paiement :</span>
                      <span className="font-bold text-[#D96B27]">
                        {createdOrder.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Bouton pour relancer sur WhatsApp */}
                  <Button
                    variant="whatsapp"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      const msg =
                        createdOrder.paymentMethod === "WHATSAPP_DIRECT"
                          ? buildOrderMessage({
                              orderNumber: createdOrder.orderNumber,
                              storeName: store.name,
                              items: createdOrder.items || [],
                              totalAmount: createdOrder.totalAmount,
                              customerName: createdOrder.customerName,
                              customerPhone: createdOrder.customerPhone,
                              customerAddress: createdOrder.customerAddress,
                              customerCity: createdOrder.customerCity,
                              island: store.island,
                              paymentMethod: createdOrder.paymentMethod,
                              transactionRef: createdOrder.transactionRef,
                            })
                          : buildPaymentSentMessage({
                              orderNumber: createdOrder.orderNumber,
                              storeName: store.name,
                              items: createdOrder.items || [],
                              totalAmount: createdOrder.totalAmount,
                              customerName: createdOrder.customerName,
                              customerPhone: createdOrder.customerPhone,
                              customerAddress: createdOrder.customerAddress,
                              customerCity: createdOrder.customerCity,
                              island: store.island,
                              paymentMethod: createdOrder.paymentMethod,
                              transactionRef: createdOrder.transactionRef,
                            });
                      window.open(buildWhatsAppLink(store.whatsappNumber, msg), "_blank");
                    }}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Contacter l&apos;artisan sur WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
