import { fetchYahooChartAssets } from "@/server/market/yahoo-chart-provider";
import type { MarketDataProvider } from "@/server/brokers/types";

export const yahooFinanceProvider: MarketDataProvider = {
  id: "yahoo-finance",
  name: "Yahoo Finance",
  async fetchMarketSnapshot(symbols) {
    return fetchYahooChartAssets(symbols);
  }
};
