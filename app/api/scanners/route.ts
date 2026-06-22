import { NextResponse } from "next/server";
import { availableScanners } from "@/lib/constants";
import { runAllScanners } from "@/lib/scanners";
import { getLiveMarketSnapshot } from "@/server/market/live-market.service";

export async function GET() {
  const market = await getLiveMarketSnapshot();

  return NextResponse.json({
    scanners: availableScanners,
    results: runAllScanners(market.assets),
    market
  });
}
