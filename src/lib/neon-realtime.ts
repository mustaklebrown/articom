import { createRealtime, rawSql } from "@neon/realtime/server";

export const isNeonRealtimeConfigured = Boolean(
  process.env.NEON_REALTIME_SECRET && process.env.NEON_REALTIME_URL
);

export const realtime = isNeonRealtimeConfigured
  ? createRealtime({
      secret: process.env.NEON_REALTIME_SECRET!,
      db: "neondb",
    })
  : null;

/**
 * Prépare une requête live sealed pour la table des commandes
 */
export async function getSealedOrdersQuery(storeId?: string) {
  if (!realtime) {
    throw new Error("Neon Realtime n'est pas configuré");
  }

  const query = storeId
    ? rawSql(
        `SELECT id, "orderNumber", status, "totalAmount", "customerName", "customerPhone", "createdAt" FROM "order" WHERE "storeId" = $1 ORDER BY "createdAt" DESC LIMIT 20`,
        [storeId]
      )
    : rawSql(
        `SELECT id, "orderNumber", status, "totalAmount", "customerName", "customerPhone", "createdAt" FROM "order" ORDER BY "createdAt" DESC LIMIT 20`,
        []
      );

  return await realtime.seal({ query });
}
