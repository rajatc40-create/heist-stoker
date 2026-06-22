import { mockMarketData } from "@/lib/mock-market-data";
import type { ScannerResult } from "@/types/platform";

export function scanBreakouts(data = mockMarketData): ScannerResult[] {
  // ADD YOUR CUSTOM SCANNER LOGIC HERE
  return data
    .filter((asset) => asset.price > asset.previousHigh)
    .map((asset) => ({
      id: `breakout-${asset.symbol}`,
      scanner: "Breakout Scanner",
      symbol: asset.symbol,
      price: asset.price,
      rsi: asset.rsi,
      volume: asset.volume,
      changePercent: asset.changePercent,
      timeframe: asset.timeframe,
      reason: `Current price ${asset.price} is above previous high ${asset.previousHigh}.`,
      assetClass: asset.assetClass
    }));
}
