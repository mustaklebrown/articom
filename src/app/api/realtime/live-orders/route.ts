import { NextResponse } from "next/server";
import { getSealedOrdersQuery, isNeonRealtimeConfigured } from "@/lib/neon-realtime";

export async function GET(request: Request) {
  try {
    if (!isNeonRealtimeConfigured) {
      return NextResponse.json(
        { error: "Neon Realtime n'est pas configuré" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId") || undefined;

    const sealedQuery = await getSealedOrdersQuery(storeId);

    return NextResponse.json({
      success: true,
      realtimeUrl: process.env.NEON_REALTIME_URL,
      sealedQuery,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur Realtime" },
      { status: 500 }
    );
  }
}
