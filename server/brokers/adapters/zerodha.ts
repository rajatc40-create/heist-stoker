import { mockMarketData } from "@/lib/mock-market-data";
import type { BrokerAdapter } from "@/server/brokers/types";

export const zerodhaAdapter: BrokerAdapter = {
  id: "zerodha",
  name: "Zerodha",
  async connect() {
    return { connected: false, message: "Zerodha Kite Connect credentials are not configured yet." };
  },
  async getQuotes(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
