"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Headphones,
  CreditCard,
  Settings,
  Sparkles,
} from "lucide-react";

export function DashboardSubnav({
  storePlan = "BASIC",
}: {
  storePlan?: "BASIC" | "PRO" | "ENTERPRISE";
}) {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/marketing",
      label: "Outils Marketing",
      icon: Megaphone,
      badge: storePlan === "BASIC" ? "Pro" : undefined,
      active: pathname.startsWith("/dashboard/marketing"),
    },
    {
      href: "/dashboard/telepromoter",
      label: "Mon Télévendeur",
      icon: Headphones,
      badge: storePlan !== "ENTERPRISE" ? "Entreprise" : "Actif",
      active: pathname.startsWith("/dashboard/telepromoter"),
    },
    {
      href: "/dashboard/subscription",
      label: "Mon Abonnement",
      icon: CreditCard,
      active: pathname.startsWith("/dashboard/subscription"),
    },
    {
      href: "/dashboard/settings",
      label: "Paramètres Vitrine",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <div className="border-b border-[#0F2C4C]/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  link.active
                    ? "bg-[#0F2C4C] text-white shadow-xs"
                    : "text-[#0F2C4C]/70 hover:bg-[#F8F8F6] hover:text-[#0F2C4C]"
                }`}
              >
                <Icon className={`h-4 w-4 ${link.active ? "text-[#D96B27]" : "text-[#0F2C4C]/60"}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      link.badge === "Actif"
                        ? "bg-emerald-500/20 text-emerald-700"
                        : "bg-[#D96B27]/15 text-[#D96B27]"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
