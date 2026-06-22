import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "gold" | "green" | "red" | "white";
}

export function MetricCard({ label, value, icon: Icon, tone = "gold" }: MetricCardProps) {
  const toneClass =
    tone === "green"
      ? "text-bullish bg-bullish/10 border-bullish/30"
      : tone === "red"
        ? "text-bearish bg-bearish/10 border-bearish/30"
        : tone === "white"
          ? "text-white bg-white/8 border-white/15"
          : "text-gold bg-gold/10 border-gold/30";

  return (
    <Card className="h-full border-white/10 bg-black/35">
      <CardContent className="flex min-h-[124px] items-center justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 truncate text-[30px] font-bold leading-none text-white">{value}</p>
        </div>
        <div className={`grid size-12 shrink-0 place-items-center rounded-2xl border ${toneClass}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
