import { angelOneAdapter } from "@/server/brokers/adapters/angelOne";
import { alphaVantageProvider } from "@/server/brokers/adapters/alphaVantage";
import { binanceAdapter } from "@/server/brokers/adapters/binance";
import { mt5Adapter } from "@/server/brokers/adapters/mt5";
import { tradingViewProvider } from "@/server/brokers/adapters/tradingView";
import { twelveDataProvider } from "@/server/brokers/adapters/twelveData";
import { upstoxAdapter } from "@/server/brokers/adapters/upstox";
import { yahooFinanceProvider } from "@/server/brokers/adapters/yahooFinance";
import { zerodhaAdapter } from "@/server/brokers/adapters/zerodha";

export const brokerAdapters = [
  zerodhaAdapter,
  upstoxAdapter,
  angelOneAdapter,
  binanceAdapter,
  mt5Adapter
];

export const marketDataProviders = [
  yahooFinanceProvider,
  alphaVantageProvider,
  twelveDataProvider,
  tradingViewProvider
];
