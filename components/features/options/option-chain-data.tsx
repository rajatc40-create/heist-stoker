import Link from "next/link";
import { ArrowUpRight, CandlestickChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/source-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const optionRows = [
  { strike: 23350, ce: 182, pe: 48, ceOi: "18.2L", peOi: "7.1L", bias: "CE strength" },
  { strike: 23400, ce: 148, pe: 64, ceOi: "14.8L", peOi: "9.4L", bias: "ATM watch" },
  { strike: 23450, ce: 112, pe: 86, ceOi: "11.1L", peOi: "12.3L", bias: "Decision zone" },
  { strike: 23500, ce: 82, pe: 118, ceOi: "8.4L", peOi: "15.8L", bias: "PE hedge" },
  { strike: 23550, ce: 56, pe: 154, ceOi: "6.2L", peOi: "18.9L", bias: "Resistance watch" }
];

const summaryCards = [
  { label: "ATM Strike", value: "23,450" },
  { label: "PCR", value: "1.08" },
  { label: "Max Pain", value: "23,500" },
  { label: "Highest CE OI", value: "23,350" },
  { label: "Highest PE OI", value: "23,550" },
  { label: "CE Writing Zone", value: "23,450 - 23,550" },
  { label: "PE Writing Zone", value: "23,350 - 23,450" },
  { label: "Support Zone", value: "23,350" },
  { label: "Resistance Zone", value: "23,550" },
  { label: "Bias", value: "Sideways to Bullish" }
];

export function OptionChainData() {
  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Option Chain Data</CardTitle>
              <SourceBadge source="Manual Demo Data" />
              <SourceBadge source="Paper Mode" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">NIFTY option chain practice data for paper trading decisions.</p>
            <p className="mt-1 text-xs text-muted-foreground">Data may be delayed. Confirm before trade.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/demo-trading">
              <ArrowUpRight />
              Demo Trading
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CE Premium</TableHead>
                <TableHead>Strike</TableHead>
                <TableHead>PE Premium</TableHead>
                <TableHead>CE OI</TableHead>
                <TableHead>PE OI</TableHead>
                <TableHead>Bias</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optionRows.map((row) => (
                <TableRow key={row.strike}>
                  <TableCell className="font-semibold text-bullish">{row.ce.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="font-bold text-white">{row.strike.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="font-semibold text-bearish">{row.pe.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{row.ceOi}</TableCell>
                  <TableCell>{row.peOi}</TableCell>
                  <TableCell>{row.bias}</TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/demo-trading">Paper Trade</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardContent className="flex items-start gap-3 p-5">
          <div className="grid size-10 shrink-0 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold">
            <CandlestickChart className="size-5" />
          </div>
          <div>
            <p className="font-bold text-white">Use option chain for practice and confirmation only.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              This board is built for education mode, paper execution planning, support and resistance confirmation, and strategy rehearsal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
