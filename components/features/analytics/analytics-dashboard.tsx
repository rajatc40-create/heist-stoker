"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { equityCurve, monthlyPerformance } from "@/lib/mock-market-data";
import { formatCurrency } from "@/lib/utils";
import { calculateTradePnl, useTradingStore } from "@/store/trading-store";

export function AnalyticsDashboard() {
  const trades = useTradingStore((state) => state.trades);
  const closedTrades = trades.filter((trade) => trade.status === "CLOSED");
  const winners = closedTrades.filter((trade) => calculateTradePnl(trade) > 0);
  const losers = closedTrades.filter((trade) => calculateTradePnl(trade) < 0);
  const grossProfit = winners.reduce((total, trade) => total + calculateTradePnl(trade), 0);
  const grossLoss = Math.abs(losers.reduce((total, trade) => total + calculateTradePnl(trade), 0));
  const averageWinner = winners.length ? grossProfit / winners.length : 0;
  const averageLoser = losers.length ? grossLoss / losers.length : 0;
  const profitFactor = grossLoss ? grossProfit / grossLoss : grossProfit > 0 ? grossProfit : 0;
  const winRate = closedTrades.length ? (winners.length / closedTrades.length) * 100 : 0;
  const drawdown = -5200;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <AnalyticsStat label="Win Rate" value={`${winRate.toFixed(1)}%`} />
        <AnalyticsStat label="Average Winner" value={formatCurrency(averageWinner)} />
        <AnalyticsStat label="Average Loser" value={formatCurrency(averageLoser)} />
        <AnalyticsStat label="Profit Factor" value={profitFactor.toFixed(2)} />
        <AnalyticsStat label="Drawdown" value={formatCurrency(drawdown)} tone="red" />
        <AnalyticsStat
          label="Monthly Performance"
          value={formatCurrency(monthlyPerformance.at(-1)?.pnl ?? 0)}
          tone="green"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-white/10 bg-black/35">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="equityGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d8a83e" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#d8a83e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="day" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#0c0d10", border: "1px solid rgba(216,168,62,.35)" }} />
                <Area type="monotone" dataKey="equity" stroke="#d8a83e" fill="url(#equityGold)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/35">
          <CardHeader>
            <CardTitle>Monthly P&L</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="month" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#0c0d10", border: "1px solid rgba(216,168,62,.35)" }} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {monthlyPerformance.map((item) => (
                    <Cell key={item.month} fill={item.pnl >= 0 ? "#19c37d" : "#ff4b5c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/35 xl:col-span-2">
          <CardHeader>
            <CardTitle>Win Loss Ratio</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Wins", value: winners.length || 1, fill: "#19c37d" },
                    { name: "Losses", value: losers.length || 1, fill: "#ff4b5c" }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={92}
                  label
                />
                <Tooltip contentStyle={{ background: "#0c0d10", border: "1px solid rgba(216,168,62,.35)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsStat({ label, value, tone = "gold" }: { label: string; value: string; tone?: "gold" | "green" | "red" }) {
  const color = tone === "green" ? "text-bullish" : tone === "red" ? "text-bearish" : "text-gold";

  return (
    <Card className="border-white/10 bg-black/35">
      <CardContent className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className={`mt-3 text-xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
