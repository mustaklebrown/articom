import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { StoreForm } from "@/components/dashboard/store-form";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  // Vérifier si une boutique existe déjà
  const existingStore = await prisma.store.findUnique({
    where: { userId: user.id },
  });

  if (existingStore) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D96B27]">
            Configuration Initiale
          </span>
          <h1 className="text-3xl font-extrabold text-[#0F2C4C]">
            Ouvrez votre Boutique Artisanale
          </h1>
          <p className="text-xs sm:text-sm text-[#0F2C4C]/70">
            Renseignez les détails de votre atelier pour commencer à exposer et recevoir des commandes sur WhatsApp.
          </p>
        </div>

        <div className="rounded-3xl border border-[#0F2C4C]/10 bg-white p-6 sm:p-8 shadow-xl">
          <StoreForm defaultValues={{ whatsappNumber: (user as any).phone || "" }} />
        </div>
      </div>
    </div>
  );
}
