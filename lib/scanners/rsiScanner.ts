import { mockMarketData } from "@/lib/mock-market-data";
import type { MarketAsset, ScannerResult } from "@/types/platform";

export const DEFAULT_RSI_PERIOD = 14;
export const RSI_OVERSOLD_LEVEL = 30;
export const RSI_OVERBOUGHT_LEVEL = 70;

function toRsiResult(asset: MarketAsset, scanner: "RSI Oversold" | "RSI Overbought"): ScannerResult {
  return {
    id: `${scanner.toLowerCase().replace(/\s+/g, "-")}-${asset.symbol}`,
    scanner,
    symbol: asset.symbol,
    price: asset.price,
    rsi: asset.rsi,
    volume: asset.volume,
    changePercent: asset.changePercent,
    timeframe: asset.timeframe,
    reason:
      scanner === "RSI Oversold"
        ? `RSI ${asset.rsi.toFixed(1)} is below ${RSI_OVERSOLD_LEVEL}.`
        : `RSI ${asset.rsi.toFixed(1)} is above ${RSI_OVERBOUGHT_LEVEL}.`,
    assetClass: asset.assetClass
  };
}

export function scanRsiOversold(data = mockMarketData): ScannerResult[] {
  // ADD YOUR CUSTOM SCANNER LOGIC HERE
  return data
    .filter((asset) => asset.rsi < RSI_OVERSOLD_LEVEL)
    .map((asset) => toRsiResult(asset, "RSI Oversold"));
}

export function scanRsiOverbought(data = mockMarketData): ScannerResult[] {
  // ADD YOUR CUSTOM SCANNER LOGIC HERE
  return data
    .filter((asset) => asset.rsi > RSI_OVERBOUGHT_LEVEL)
    .map((asset) => toRsiResult(asset, "RSI Overbought"));
}
