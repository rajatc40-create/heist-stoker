import { mockMarketData } from "@/lib/mock-market-data";
import { resolveYahooSymbol } from "@/server/market/symbol-map";
import type { MarketAsset } from "@/types/platform";

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        symbol?: string;
        regularMarketPrice?: number;
        regularMarketTime?: number;
        regularMarketVolume?: number;
        previousClose?: number;
        chartPreviousClose?: number;
        regularMarketDayHigh?: number;
        longName?: string;
        shortName?: string;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
          high?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
    error?: {
      code?: string;
      description?: string;
    };
  };
}

export async function fetchYahooChartAssets(symbols: string[]): Promise<MarketAsset[]> {
  const uniqueSymbols = Array.from(new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean)));
  const assets = await Promise.all(uniqueSymbols.map(fetchYahooChartAsset));

  return assets.filter((asset): asset is MarketAsset => Boolean(asset));
}

async function fetchYahooChartAsset(symbol: string): Promise<MarketAsset | null> {
  const mapping = resolveYahooSymbol(symbol);
  const fallback = mockMarketData.find((asset) => asset.symbol === mapping.symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    mapping.providerSymbol
  )}?range=5d&interval=5m`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
        "user-agent": "HEIST-STOKER/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo chart returned ${response.status}`);
    }

    const payload = (await response.json()) as YahooChartResponse;
    const result = payload.chart?.result?.[0];

    if (!result) {
      throw new Error(payload.chart?.error?.description ?? "Yahoo chart returned no result");
    }

    const quote = result.indicators?.quote?.[0];
    const closes = compactNumberArray(quote?.close);
    const highs = compactNumberArray(quote?.high);
    const volumes = compactNumberArray(quote?.volume);
    const price = result.meta?.regularMarketPrice ?? closes.at(-1) ?? fallback?.price;

    if (!price) {
      throw new Error("Yahoo chart returned no usable price");
    }

    const previousClose = result.meta?.previousClose ?? result.meta?.chartPreviousClose ?? closes.at(-2) ?? price;
    const previousHigh = highs.slice(0, -1).reduce((max, value) => Math.max(max, value), highs.at(-1) ?? price);
    const volume = result.meta?.regularMarketVolume ?? volumes.at(-1) ?? fallback?.volume ?? 0;
    const averageVolume = average(volumes.slice(-60)) || fallback?.averageVolume || Math.max(volume, 1);
    const rsi = calculateRsi(closes, 14) ?? fallback?.rsi ?? 50;
    const asOfSeconds = result.meta?.regularMarketTime ?? result.timestamp?.at(-1);

    return {
      symbol: mapping.symbol,
      providerSymbol: mapping.providerSymbol,
      name: result.meta?.longName ?? result.meta?.shortName ?? mapping.name,
      assetClass: mapping.assetClass,
      price,
      previousHigh,
      rsi,
      volume,
      averageVolume,
      changePercent: previousClose ? ((price - previousClose) / previousClose) * 100 : 0,
      timeframe: "5m",
      dataSource: "live",
      asOf: asOfSeconds ? new Date(asOfSeconds * 1000).toISOString() : new Date().toISOString()
    };
  } catch {
    return fallback ? { ...fallback, dataSource: "mock", providerSymbol: mapping.providerSymbol } : null;
  }
}

function compactNumberArray(values?: Array<number | null>) {
  return (values ?? []).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function calculateRsi(closes: number[], period: number) {
  if (closes.length <= period) {
    return null;
  }

  const recent = closes.slice(-(period + 1));
  let gains = 0;
  let losses = 0;

  for (let index = 1; index < recent.length; index += 1) {
    const change = recent[index] - recent[index - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  const averageGain = gains / period;
  const averageLoss = losses / period;

  if (averageLoss === 0) {
    return 100;
  }

  const relativeStrength = averageGain / averageLoss;
  return 100 - 100 / (1 + relativeStrength);
}
