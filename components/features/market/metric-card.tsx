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
          : "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30";

  return (
    <Card className="h-full border-[#334155] bg-[#111827]">
      <CardContent className="flex min-h-[124px] items-center justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-400">{label}</p>
          <p className="mt-3 truncate text-[28px] font-bold leading-none text-slate-50">{value}</p>
        </div>
        <div className={`grid size-12 shrink-0 place-items-center rounded-2xl border ${toneClass}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
