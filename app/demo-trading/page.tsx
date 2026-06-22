import { DemoTradingModule } from "@/components/features/demo-trading/trading-ticket";
import { AppShell } from "@/components/layout/app-shell";

export default function DemoTradingPage() {
  return (
    <AppShell title="Demo Trading" subtitle="Paper trades with staged targets, risk, and review-ready lifecycle actions.">
      <DemoTradingModule />
    </AppShell>
  );
}
