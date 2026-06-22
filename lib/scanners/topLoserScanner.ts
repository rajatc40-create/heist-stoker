import { mockMarketData } from "@/lib/mock-market-data";
import type { ScannerResult } from "@/types/platform";

export function scanTopLosers(data = mockMarketData, limit = 5): ScannerResult[] {
  // ADD YOUR CUSTOM SCANNER LOGIC HERE
  return [...data]
    .filter((asset) => asset.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, limit)
    .map((asset) => ({
      id: `top-loser-${asset.symbol}`,
      scanner: "Top Losers",
      symbol: asset.symbol,
      price: asset.price,
      rsi: asset.rsi,
      volume: asset.volume,
      changePercent: asset.changePercent,
      timeframe: asset.timeframe,
      reason: `Down ${Math.abs(asset.changePercent).toFixed(2)}% with bearish pressure.`,
      assetClass: asset.assetClass
    }));
}
