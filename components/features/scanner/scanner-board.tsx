"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { ChartinkAlertsTable } from "@/components/features/scanner/chartink-alerts-table";
import { HighMoneyFlowBoard } from "@/components/features/scanner/high-money-flow-board";
import { MorningBreakfastBoard } from "@/components/features/scanner/morning-breakfast-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { SourceBadge } from "@/components/ui/source-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runAllScanners } from "@/lib/scanners";
import { formatPercent } from "@/lib/utils";
import type { ScannerResult } from "@/types/platform";

const scannerTabs = [
  { id: "morning-breakfast", label: "Morning Breakfast", kind: "morning" as const },
  { id: "high-money-flow", label: "High Money Flow", kind: "high-money-flow" as const },
  { id: "top-gainers", label: "Top Gainers", kind: "table" as const, scannerName: "Top Gainers" },
  { id: "top-losers", label: "Top Losers", kind: "table" as const, scannerName: "Top Losers" },
  { id: "volume-spike", label: "Volume Spike", kind: "table" as const, scannerName: "Volume Spike" },
  { id: "rsi-oversold", label: "RSI Oversold", kind: "table" as const, scannerName: "RSI Oversold" },
  { id: "rsi-overbought", label: "RSI Overbought", kind: "table" as const, scannerName: "RSI Overbought" },
  { id: "breakout", label: "Breakout Scanner", kind: "table" as const, scannerName: "Breakout Scanner" },
  { id: "option-selling", label: "Option Selling Scanner", kind: "option-selling" as const }
];

interface ScannerApiResponse {
  results: ScannerResult[];
  market: {
    source: "yahoo-chart" | "mock-fallback";
    liveCount: number;
    fallbackCount: number;
    updatedAt: string;
  };
}

export function ScannerBoard() {
  const [activeTab, setActiveTab] = useState("morning-breakfast");
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [allResults, setAllResults] = useState<ScannerResult[]>(runAllScanners());
  const [marketStatus, setMarketStatus] = useState<ScannerApiResponse["market"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeScanner = scannerTabs.find((tab) => tab.id === activeTab) ?? scannerTabs[0];

  const results = useMemo(() => {
    if (activeScanner.kind !== "table") {
      return [];
    }

    return allResults.filter((result) => result.scanner === activeScanner.scannerName);
  }, [activeScanner, allResults]);

  useEffect(() => {
    async function loadScanners() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/scanners", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Scanner feed returned ${response.status}`);
        }

        const payload = (await response.json()) as ScannerApiResponse;
        setAllResults(payload.results);
        setMarketStatus(payload.market);
        setLastRefresh(payload.market.updatedAt);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Scanner live feed unavailable");
        setAllResults(runAllScanners());
      } finally {
        setIsLoading(false);
      }
    }

    void loadScanners();
    const interval = window.setInterval(() => setRefreshTick((current) => current + 1), 30000);

    return () => window.clearInterval(interval);
  }, [refreshTick]);

  return (
    <div className="grid gap-4">
      <ChartinkAlertsTable />

      <section className="rounded-2xl border border-[#334155] bg-[#111827] p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-slate-50">Scanner Workspace</h3>
              <SourceBadge source={marketStatus?.source === "yahoo-chart" ? "Yahoo Delayed" : "Manual Demo Data"} />
              <SourceBadge source="Paper Mode" />
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Morning Breakfast and High Money Flow use official NSE pre-open data. Remaining scanners use delayed or demo feeds.
            </p>
            <p className="mt-1 text-xs text-slate-500">Data may be delayed. Confirm before trade.</p>
          </div>
          <Button variant="outline" onClick={() => setRefreshTick((current) => current + 1)} disabled={isLoading}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
        <div className="mt-4 grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#334155] bg-[#0f172a] px-4 py-3 text-sm">
            <p className="text-slate-400">
              {marketStatus
                ? `${marketStatus.liveCount} delayed live / ${marketStatus.fallbackCount} demo feed`
                : "Loading scanner feed status"}
            </p>
            <p className="text-slate-400">
              Last refresh: <ClientTime value={lastRefresh} format="time" fallback="waiting for feed" />
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
              {scannerTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="border border-[#334155] bg-[#0f172a] text-slate-300 data-[state=active]:border-[#3B82F6]/40 data-[state=active]:bg-[#172554] data-[state=active]:text-slate-50"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {scannerTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.kind === "morning" ? <MorningBreakfastBoard /> : null}
                {tab.kind === "high-money-flow" ? <HighMoneyFlowBoard /> : null}
                {tab.kind === "table" ? (
                  <ScannerResultsPanel title={tab.label} results={results} error={error} isLoading={isLoading} />
                ) : null}
                {tab.kind === "option-selling" ? <OptionSellingScannerPanel /> : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function ScannerResultsPanel({
  title,
  results,
  error,
  isLoading
}: {
  title: string;
  results: ScannerResult[];
  error: string | null;
  isLoading: boolean;
}) {
  return (
    <Card className="border-[#334155] bg-[#111827]">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{title}</CardTitle>
          <SourceBadge source="Yahoo Delayed" />
        </div>
        <p className="text-xs text-slate-400">Data may be delayed. Confirm before trade.</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        {error ? <p className="text-sm text-bearish">{error}</p> : null}
        {isLoading && !results.length ? <p className="text-sm text-slate-400">Refreshing scanner data...</p> : null}
        <div className="overflow-x-auto rounded-xl border border-[#334155]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scanner</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>RSI</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Change %</TableHead>
                <TableHead>Timeframe</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length ? (
                results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <Badge>{result.scanner}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-white">{result.symbol}</TableCell>
                    <TableCell>{result.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>{result.rsi?.toFixed(1) ?? "-"}</TableCell>
                    <TableCell>{result.volume.toLocaleString("en-IN")}</TableCell>
                    <TableCell className={result.changePercent >= 0 ? "text-bullish" : "text-bearish"}>
                      {formatPercent(result.changePercent)}
                    </TableCell>
                    <TableCell>{result.timeframe}</TableCell>
                    <TableCell className="min-w-[220px] text-slate-400">{result.reason}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No scanner matches available right now.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function OptionSellingScannerPanel() {
  const ideas = [
    {
      structure: "Iron Condor",
      market: "Sideways index day",
      note: "Use when implied range is clear and you want controlled premium decay."
    },
    {
      structure: "Bull Put Spread",
      market: "Bullish to neutral",
      note: "Use when support is respected and you want defined downside risk."
    },
    {
      structure: "Call / Put Sell Watch",
      market: "Strong resistance or support",
      note: "Watch only in paper mode and size by lot before entry."
    }
  ];

  return (
    <Card className="border-[#334155] bg-[#111827]">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Option Selling Scanner</CardTitle>
          <SourceBadge source="Paper Mode" />
          <SourceBadge source="Manual Demo Data" />
        </div>
        <p className="text-sm text-slate-400">
          Education-only option selling desk for premium decay ideas, lot planning, and risk-defined structures.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {ideas.map((idea) => (
          <div key={idea.structure} className="rounded-xl border border-[#334155] bg-[#0f172a] p-4">
            <p className="text-sm font-semibold text-[#F59E0B]">{idea.structure}</p>
            <p className="mt-2 text-sm text-slate-50">{idea.market}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{idea.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
