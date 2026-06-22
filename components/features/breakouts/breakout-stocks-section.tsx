import Link from "next/link";
import { ArrowUpRight, Radar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scanBreakouts } from "@/lib/scanners/breakoutScanner";
import { scanTopGainers } from "@/lib/scanners/topGainerScanner";
import { formatPercent } from "@/lib/utils";

export function BreakoutStocksSection() {
  const breakouts = scanBreakouts();
  const gainers = scanTopGainers(undefined, 6);
  const rows = breakouts.length ? breakouts : gainers;

  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Breakout Stocks</CardTitle>
              <Badge variant="bullish">
                <Radar className="mr-1 size-3" />
                Scanner Ready
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Stocks and indices near breakout or momentum continuation zones.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/scanner">
              <ArrowUpRight />
              Full Scanner
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Scanner</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-white">{item.symbol}</TableCell>
                  <TableCell>
                    <Badge>{item.scanner}</Badge>
                  </TableCell>
                  <TableCell>{item.price.toLocaleString("en-IN")}</TableCell>
                  <TableCell className={item.changePercent >= 0 ? "text-bullish" : "text-bearish"}>
                    {formatPercent(item.changePercent)}
                  </TableCell>
                  <TableCell className="min-w-[260px] text-muted-foreground">{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-md border border-bullish/30 bg-bullish/10 text-bullish">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="font-bold text-white">Breakout rule</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Wait for retest or volume confirmation before adding a demo trade.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/demo-trading">Paper Trade</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
