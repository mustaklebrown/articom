import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AppRole = "SUPER_ADMIN" | "ARTISAN" | "CUSTOMER";

/** Session courante (mémoïsée pour la durée de la requête). */
export const getSession = cache(async () => {
  try {
    const reqHeaders = await headers();
    return await auth.api.getSession({ headers: reqHeaders });
  } catch (e) {
    return null;
  }
});

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/** Exige une session, sinon redirige vers /login. */
export async function requireUser(redirectTo = "/login") {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  if ((user as any).banned) {
    redirect("/login?error=banned");
  }
  return user;
}

/** Exige un rôle donné ; renvoie l'utilisateur. */
export async function requireRole(role: AppRole | AppRole[]) {
  const roles = Array.isArray(role) ? role : [role];
  const targetNext = roles.includes("SUPER_ADMIN") ? "/admin" : "/dashboard";
  const user = await requireUser(`/login?next=${targetNext}`);
  if (!roles.includes(user.role as AppRole)) {
    redirect(`/login?error=forbidden&required=${roles.join(",")}&current=${user.role}`);
  }
  return user;
}

/**
 * Exige un artisan avec boutique. Si l'utilisateur n'a pas encore de boutique,
 * il est redirigé vers l'onboarding (ou vers /admin si SUPER_ADMIN).
 */
export const requireArtisanStore = cache(async () => {
  const user = await requireUser("/login?next=/dashboard");
  const store = await prisma.store.findUnique({ where: { userId: user.id } });
  if (!store) {
    if (user.role === "SUPER_ADMIN") {
      redirect("/admin");
    }
    redirect("/onboarding");
  }
  if (user.role !== "ARTISAN" && user.role !== "SUPER_ADMIN") redirect("/");
  return { user, store };
});
