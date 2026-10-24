import { Navbar } from "@/components/marketplace/navbar";
import { Footer } from "@/components/marketplace/footer";
import { PricingSection } from "@/components/pricing/pricing-section";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Tarifs & Abonnements Artisans | KOMO-ART",
  description:
    "Découvrez nos forfaits Basic, Pro et Entreprise pour artisans et coopératives aux Comores. Outils marketing, bannières et service télévendeur dédié.",
};

export default async function PricingPage() {
  const user = await getCurrentUser();
  let currentPlan = "BASIC";

  if (user) {
    const store = await prisma.store.findUnique({
      where: { userId: user.id },
      select: { subscriptionPlan: true },
    });
    if (store) {
      currentPlan = store.subscriptionPlan;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6]">
      <Navbar />
      <main className="grow">
        <PricingSection isLoggedIn={!!user} currentPlan={currentPlan} />
      </main>
      <Footer />
    </div>
  );
}
