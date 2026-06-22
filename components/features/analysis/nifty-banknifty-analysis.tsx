import { Activity, ArrowUpRight, ShieldCheck, Target } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMarketData } from "@/lib/mock-market-data";
import { formatPercent } from "@/lib/utils";
import type { MarketAsset } from "@/types/platform";

const focusLevels = [
  { label: "Previous High", value: "Resistance check" },
  { label: "Previous Low", value: "Liquidity support" },
  { label: "Opening Range", value: "First 30 min" },
  { label: "VWAP Bias", value: "Trend filter" }
];

function getIndexLevels(asset: MarketAsset) {
  const price = asset.price;
  const step = asset.symbol === "BANKNIFTY" ? 250 : 100;

  const support1 = Math.floor((price - step * 0.6) / 10) * 10;
  const support2 = Math.floor((price - step * 1.2) / 10) * 10;
  const resistance1 = Math.ceil((price + step * 0.6) / 10) * 10;
  const resistance2 = Math.ceil((price + step * 1.2) / 10) * 10;

  return {
    support1,
    support2,
    resistance1,
    resistance2,
    zone:
      asset.changePercent >= 0
        ? "Bullish bias above support. Watch resistance breakout with retest."
        : "Weak bias below resistance. Wait for support reaction before any trade."
  };
}

export function NiftyBankNiftyAnalysis() {
  const indices = ["NIFTY", "BANKNIFTY"]
    .map((symbol) => mockMarketData.find((asset) => asset.symbol === symbol))
    .filter((asset): asset is MarketAsset => Boolean(asset));

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {indices.map((asset) => (
          <Card key={asset.symbol} className="border-gold/20 bg-black/35">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>{asset.symbol} Analysis</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{asset.name} / {asset.timeframe} practice view</p>
              </div>
              <Badge variant={asset.changePercent >= 0 ? "bullish" : "bearish"}>
                {formatPercent(asset.changePercent)}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Price" value={asset.price.toLocaleString("en-IN")} />
                <Metric label="RSI" value={asset.rsi.toFixed(1)} />
                <Metric label="Volume" value={asset.volume.toLocaleString("en-IN")} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Support 1" value={getIndexLevels(asset).support1.toLocaleString("en-IN")} />
                <Metric label="Support 2" value={getIndexLevels(asset).support2.toLocaleString("en-IN")} />
                <Metric label="Resistance 1" value={getIndexLevels(asset).resistance1.toLocaleString("en-IN")} />
                <Metric label="Resistance 2" value={getIndexLevels(asset).resistance2.toLocaleString("en-IN")} />
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-gold" />
                  <p className="font-semibold text-white">Bias Plan</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Above previous high, wait for retest and bullish candle. Below previous low, avoid chasing and wait for
                  liquidity sweep confirmation.
                </p>
              </div>
              <div className="rounded-lg border border-gold/20 bg-gold/10 p-4">
                <p className="text-sm font-semibold text-white">{asset.symbol} Support / Resistance Zone</p>
                <p className="mt-2 text-sm leading-6 text-white/75">{getIndexLevels(asset).zone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-black/35">
        <CardHeader>
          <CardTitle>Index Trading Checklist</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Use before NIFTY or BANKNIFTY paper trades.</p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {focusLevels.map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <ShieldCheck className="size-5 text-bullish" />
              <p className="mt-3 text-sm font-bold text-white">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-gold/20 bg-gold/10">
        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-md border border-gold/30 bg-black/35 text-gold">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="font-bold text-white">Option chain practice is connected to Demo Trading.</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Open CE/PE data before placing a paper trade.</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/option-chain">
              <ArrowUpRight />
              Open Option Chain
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
