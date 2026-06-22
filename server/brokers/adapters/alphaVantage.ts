import { mockMarketData } from "@/lib/mock-market-data";
import type { MarketDataProvider } from "@/server/brokers/types";

export const alphaVantageProvider: MarketDataProvider = {
  id: "alpha-vantage",
  name: "Alpha Vantage",
  async fetchMarketSnapshot(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
