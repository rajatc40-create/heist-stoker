import { mockMarketData } from "@/lib/mock-market-data";
import type { BrokerAdapter } from "@/server/brokers/types";

export const binanceAdapter: BrokerAdapter = {
  id: "binance",
  name: "Binance",
  async connect() {
    return { connected: false, message: "Binance API keys are not configured yet." };
  },
  async getQuotes(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
