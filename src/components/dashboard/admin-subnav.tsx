"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Sparkles,
  Layers,
  Store,
} from "lucide-react";

export function AdminSubnav() {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/orders",
      label: "Toutes les Commandes",
      icon: ShoppingBag,
      active: pathname.startsWith("/admin/orders"),
    },
    {
      href: "/admin/users",
      label: "Utilisateurs & Rôles",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      href: "/admin/settings",
      label: "Paramètres & Configurations",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
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
                <Icon className={`h-4 w-4 ${link.active ? "text-[#C5A059]" : "text-[#0F2C4C]/60"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
