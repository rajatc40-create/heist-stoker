"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { mockMarketData } from "@/lib/mock-market-data";
import type { MarketAsset } from "@/types/platform";

interface MarketQuotesResponse {
  assets: MarketAsset[];
  source: "yahoo-chart" | "mock-fallback";
  liveCount: number;
  fallbackCount: number;
  updatedAt: string;
}

export function useLiveMarketData(symbols?: string[], refreshMs = 30000) {
  const defaultSymbols = useMemo(() => mockMarketData.map((asset) => asset.symbol), []);
  const symbolList = symbols?.length ? symbols : defaultSymbols;
  const symbolsKey = symbolList.map((symbol) => symbol.toUpperCase()).join(",");
  const [assets, setAssets] = useState<MarketAsset[]>(mockMarketData);
  const [source, setSource] = useState<MarketQuotesResponse["source"]>("mock-fallback");
  const [liveCount, setLiveCount] = useState(0);
  const [fallbackCount, setFallbackCount] = useState(mockMarketData.length);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(symbolsKey)}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Live feed returned ${response.status}`);
      }

      const payload = (await response.json()) as MarketQuotesResponse;
      setAssets(payload.assets);
      setSource(payload.source);
      setLiveCount(payload.liveCount);
      setFallbackCount(payload.fallbackCount);
      setUpdatedAt(payload.updatedAt);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Live feed unavailable");
      setSource("mock-fallback");
    } finally {
      setIsLoading(false);
    }
  }, [symbolsKey]);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), refreshMs);

    return () => window.clearInterval(interval);
  }, [refresh, refreshMs]);

  const priceBySymbol = useMemo(
    () => new Map(assets.map((asset) => [asset.symbol, asset.price])),
    [assets]
  );

  return {
    assets,
    source,
    liveCount,
    fallbackCount,
    updatedAt,
    isLoading,
    error,
    refresh,
    priceBySymbol
  };
}
