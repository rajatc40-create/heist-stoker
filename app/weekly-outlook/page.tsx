import { WeeklyMarketOutlook } from "@/components/features/outlook/weekly-market-outlook";
import { AppShell } from "@/components/layout/app-shell";

export default function WeeklyOutlookPage() {
  return (
    <AppShell title="Weekly Outlook" subtitle="A weekly student routine for market preparation and review.">
      <WeeklyMarketOutlook />
    </AppShell>
  );
}
