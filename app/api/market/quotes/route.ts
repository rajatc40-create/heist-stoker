import { NextResponse } from "next/server";
import { getLiveMarketSnapshot } from "@/server/market/live-market.service";
import { defaultMarketSymbols } from "@/server/market/symbol-map";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols =
    searchParams
      .get("symbols")
      ?.split(",")
      .map((symbol) => symbol.trim().toUpperCase())
      .filter(Boolean) ?? defaultMarketSymbols;

  const snapshot = await getLiveMarketSnapshot(symbols);

  return NextResponse.json(snapshot);
}
