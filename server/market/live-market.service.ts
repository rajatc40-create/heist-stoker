import { mockMarketData } from "@/lib/mock-market-data";
import { fetchYahooChartAssets } from "@/server/market/yahoo-chart-provider";
import { defaultMarketSymbols } from "@/server/market/symbol-map";
import type { MarketAsset } from "@/types/platform";

export interface LiveMarketSnapshot {
  assets: MarketAsset[];
  source: "yahoo-chart" | "mock-fallback";
  liveCount: number;
  fallbackCount: number;
  updatedAt: string;
}

export async function getLiveMarketSnapshot(symbols = defaultMarketSymbols): Promise<LiveMarketSnapshot> {
  const assets = await fetchYahooChartAssets(symbols);
  const missingSymbols = symbols.filter((symbol) => !assets.some((asset) => asset.symbol === symbol.toUpperCase()));
  const missingFallbacks = mockMarketData
    .filter((asset) => missingSymbols.includes(asset.symbol))
    .map((asset) => ({ ...asset, dataSource: "mock" as const }));
  const merged = [...assets, ...missingFallbacks];
  const liveCount = merged.filter((asset) => asset.dataSource === "live").length;

  return {
    assets: merged,
    source: liveCount > 0 ? "yahoo-chart" : "mock-fallback",
    liveCount,
    fallbackCount: merged.length - liveCount,
    updatedAt: new Date().toISOString()
  };
}
