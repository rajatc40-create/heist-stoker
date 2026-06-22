"use client";

import { AlertTriangle, RefreshCcw, TrendingDown, TrendingUp, Wifi, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/source-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLiveMarketData } from "@/lib/hooks/use-live-market-data";
import { formatPercent } from "@/lib/utils";
import type { MarketAsset } from "@/types/platform";

export function MarketWidgets() {
  const { assets, source, liveCount, fallbackCount, updatedAt, isLoading, error, refresh } = useLiveMarketData();
  const gainers = [...assets].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...assets].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const active = [...assets].sort((a, b) => b.volume - a.volume).slice(0, 6);
  const trending = assets.filter((asset) => asset.volume > asset.averageVolume * 2 || asset.rsi > 70 || asset.rsi < 30);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="border-white/10 bg-black/35">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Market Watch</CardTitle>
              <MarketStatusPill source={source} liveCount={liveCount} fallbackCount={fallbackCount} />
              <SourceBadge source={source === "yahoo-chart" ? "Yahoo Delayed" : "Manual Demo Data"} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {source === "yahoo-chart" ? "Yahoo Finance delayed feed" : "Mock fallback feed"}
              {updatedAt ? ` - Updated ${new Date(updatedAt).toLocaleTimeString()}` : ""}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Data may be delayed. Confirm before trade.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={isLoading}>
            <RefreshCcw className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-bearish/25 bg-bearish/10 p-3 text-sm text-bearish">
              <AlertTriangle className="size-4" />
              {error}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Feed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.map((asset) => (
                <TableRow key={asset.symbol}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-white">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{asset.assetClass}</TableCell>
                  <TableCell>{asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className={asset.changePercent >= 0 ? "text-bullish" : "text-bearish"}>
                    {formatPercent(asset.changePercent)}
                  </TableCell>
                  <TableCell>{asset.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={asset.dataSource === "live" ? "bullish" : "outline"}>
                      {asset.dataSource === "live" ? "Live" : "Mock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <MarketList title="Top Gainers" items={gainers} tone="bullish" icon={TrendingUp} />
        <MarketList title="Top Losers" items={losers} tone="bearish" icon={TrendingDown} />
      </div>

      <Card className="border-white/10 bg-black/35 xl:col-span-2">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Market Heatmap</CardTitle>
            <SourceBadge source={source === "yahoo-chart" ? "Yahoo Delayed" : "Manual Demo Data"} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Fast visual scan across stocks, indices, forex, and crypto.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className={`rounded-md border p-3 ${
                  asset.changePercent >= 0
                    ? "border-bullish/25 bg-bullish/10"
                    : "border-bearish/25 bg-bearish/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold text-white">{asset.symbol}</p>
                  <Badge variant={asset.changePercent >= 0 ? "bullish" : "bearish"}>
                    {formatPercent(asset.changePercent)}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{asset.assetClass}</span>
                  <span>RSI {asset.rsi.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35 xl:col-span-2">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Trending Assets</CardTitle>
            <SourceBadge source={source === "yahoo-chart" ? "Yahoo Delayed" : "Manual Demo Data"} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">High volume, overbought, or oversold assets from the current feed.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trending.length ? (
              trending.map((asset) => (
                <Badge key={asset.symbol} variant={asset.changePercent >= 0 ? "bullish" : "bearish"}>
                  {asset.symbol} / RSI {asset.rsi.toFixed(1)}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No extreme scanner conditions right now.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MarketStatusPill({
  source,
  liveCount,
  fallbackCount
}: {
  source: "yahoo-chart" | "mock-fallback";
  liveCount: number;
  fallbackCount: number;
}) {
  return (
    <Badge variant={source === "yahoo-chart" ? "bullish" : "outline"}>
      <Wifi className="mr-1 size-3" />
      {liveCount} live / {fallbackCount} mock
    </Badge>
  );
}

function MarketList({
  title,
  items,
  tone,
  icon: Icon
}: {
  title: string;
  items: MarketAsset[];
  tone: "bullish" | "bearish";
  icon: LucideIcon;
}) {
  return (
    <Card className="border-white/10 bg-black/35">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{title}</CardTitle>
          <SourceBadge source="Yahoo Delayed" />
        </div>
        <div
          className={`grid size-9 place-items-center rounded-md border ${
            tone === "bullish" ? "border-bullish/30 bg-bullish/10 text-bullish" : "border-bearish/30 bg-bearish/10 text-bearish"
          }`}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between gap-3 rounded-md bg-white/[0.03] p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{asset.symbol}</p>
              <p className="truncate text-xs text-muted-foreground">{asset.name}</p>
            </div>
            <Badge variant={tone}>{formatPercent(asset.changePercent)}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
