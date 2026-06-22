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
      ? "text-bullish bg-bullish/10 border-bullish/20"
      : tone === "red"
        ? "text-bearish bg-bearish/10 border-bearish/20"
        : tone === "white"
          ? "text-[#111827] bg-[#F8FAFC] border-[#E5E7EB]"
          : "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/20";

  return (
    <Card className="h-full border-[#E5E7EB] bg-white shadow-sm">
      <CardContent className="flex min-h-[112px] items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="truncate text-sm text-[#6B7280]">{label}</p>
          <p className="mt-2 truncate text-[26px] font-bold leading-none text-[#111827]">{value}</p>
        </div>
        <div className={`grid size-11 shrink-0 place-items-center rounded-xl border ${toneClass}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
