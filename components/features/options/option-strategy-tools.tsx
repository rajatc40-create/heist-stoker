import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/source-badge";

const strategyCards = [
  {
    title: "Iron Condor",
    market: "Sideways",
    setup: "Sell OTM CE and PE, hedge both wings, define max risk before entry."
  },
  {
    title: "Iron Fly",
    market: "Low range expiry",
    setup: "Sell ATM straddle with hedges when you expect price to remain near max pain."
  },
  {
    title: "Bull Put Spread",
    market: "Bullish to neutral",
    setup: "Sell higher put and buy lower hedge put near support after confirmation."
  }
];

export function OptionStrategyTools() {
  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Option Strategy Tools</CardTitle>
              <SourceBadge source="Paper Mode" />
              <SourceBadge source="Manual Demo Data" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Strategy desk for structure planning, lot discipline, and option selling practice.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Data may be delayed. Confirm before trade.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/option-chain">
              <ArrowUpRight />
              Option Chain
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {strategyCards.map((strategy) => (
            <div key={strategy.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-gold">{strategy.title}</p>
              <p className="mt-2 text-sm font-medium text-white">{strategy.market}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{strategy.setup}</p>
              <Button asChild size="sm" className="mt-4 w-full">
                <Link href="/demo-trading">Practice Structure</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardContent className="flex items-start gap-3 p-5">
          <div className="grid size-10 shrink-0 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="font-bold text-white">Practice first, execute later.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Use these structures to rehearse lot sizing, defined risk, stop loss handling, and journal review inside education mode.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
