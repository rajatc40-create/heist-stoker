import { mockMarketData } from "@/lib/mock-market-data";
import type { MarketDataProvider } from "@/server/brokers/types";

export const twelveDataProvider: MarketDataProvider = {
  id: "twelve-data",
  name: "Twelve Data",
  async fetchMarketSnapshot(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
