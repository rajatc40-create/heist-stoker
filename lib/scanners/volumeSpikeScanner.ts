import { mockMarketData } from "@/lib/mock-market-data";
import type { ScannerResult } from "@/types/platform";

export function scanVolumeSpikes(data = mockMarketData): ScannerResult[] {
  // ADD YOUR CUSTOM SCANNER LOGIC HERE
  return data
    .filter((asset) => asset.volume > asset.averageVolume * 2)
    .map((asset) => ({
      id: `volume-spike-${asset.symbol}`,
      scanner: "Volume Spike",
      symbol: asset.symbol,
      price: asset.price,
      rsi: asset.rsi,
      volume: asset.volume,
      changePercent: asset.changePercent,
      timeframe: asset.timeframe,
      reason: `Current volume is ${(asset.volume / asset.averageVolume).toFixed(1)}x average volume.`,
      assetClass: asset.assetClass
    }));
}
