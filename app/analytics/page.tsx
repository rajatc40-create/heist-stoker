import { AnalyticsDashboard } from "@/components/features/analytics/analytics-dashboard";
import { AppShell } from "@/components/layout/app-shell";

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics" subtitle="Win rate, expectancy, profit factor, drawdown, and performance charts.">
      <AnalyticsDashboard />
    </AppShell>
  );
}
