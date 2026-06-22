import { mockMarketData } from "@/lib/mock-market-data";
import type { MarketDataProvider } from "@/server/brokers/types";

export const tradingViewProvider: MarketDataProvider = {
  id: "tradingview",
  name: "TradingView",
  async fetchMarketSnapshot(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
