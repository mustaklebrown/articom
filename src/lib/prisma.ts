import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Instance Prisma singleton.
 * En développement, le hot-reload de Next.js recrée les modules : on stocke
 * l'instance sur globalThis pour éviter d'ouvrir une nouvelle connexion à chaque fois.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL n'est pas défini");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma && "systemSetting" in globalForPrisma.prisma
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
