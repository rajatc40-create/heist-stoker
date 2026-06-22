import { mockMarketData } from "@/lib/mock-market-data";
import type { BrokerAdapter } from "@/server/brokers/types";

export const upstoxAdapter: BrokerAdapter = {
  id: "upstox",
  name: "Upstox",
  async connect() {
    return { connected: false, message: "Upstox OAuth credentials are not configured yet." };
  },
  async getQuotes(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
