import type { MarketAsset, ScannerResult } from "@/types/platform";

export interface CustomScannerConfig {
  id: string;
  name: string;
  enabled: boolean;
  timeframe?: string;
}

export function runCustomScannerTemplate(
  data: MarketAsset[],
  config: CustomScannerConfig
): ScannerResult[] {
  // ADD YOUR CUSTOM SCANNER LOGIC HERE
  if (!config.enabled) {
    return [];
  }

  return data.map((asset) => ({
    id: `${config.id}-${asset.symbol}`,
    scanner: config.name,
    symbol: asset.symbol,
    price: asset.price,
    rsi: asset.rsi,
    volume: asset.volume,
    changePercent: asset.changePercent,
    timeframe: asset.timeframe,
    reason: "Template result waiting for a real condition.",
    assetClass: asset.assetClass
  }));
}

export const futureScannerPlaceholders = [
  "RSI 4 Scanner",
  "EMA 34 Scanner",
  "PDH Scanner",
  "PDL Scanner",
  "Liquidity Sweep Scanner",
  "HH LL Scanner",
  "Smart Money Scanner",
  "Wave Theory Scanner",
  "Option Selling Scanner"
];
