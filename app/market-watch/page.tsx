import { MarketWidgets } from "@/components/features/market/market-widgets";
import { AppShell } from "@/components/layout/app-shell";

export default function MarketWatchPage() {
  return (
    <AppShell title="Market Watch" subtitle="Top gainers, top losers, most active assets, heatmap, and trends.">
      <MarketWidgets />
    </AppShell>
  );
}
