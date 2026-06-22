import { mockMarketData } from "@/lib/mock-market-data";
import type { ScannerResult } from "@/types/platform";

export function scanTopGainers(data = mockMarketData, limit = 5): ScannerResult[] {
  // ADD YOUR CUSTOM SCANNER LOGIC HERE
  return [...data]
    .filter((asset) => asset.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, limit)
    .map((asset) => ({
      id: `top-gainer-${asset.symbol}`,
      scanner: "Top Gainers",
      symbol: asset.symbol,
      price: asset.price,
      rsi: asset.rsi,
      volume: asset.volume,
      changePercent: asset.changePercent,
      timeframe: asset.timeframe,
      reason: `Up ${asset.changePercent.toFixed(2)}% with active volume.`,
      assetClass: asset.assetClass
    }));
}
