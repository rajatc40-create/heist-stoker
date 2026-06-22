import { EconomicCalendar } from "@/components/features/calendar/economic-calendar";
import { AppShell } from "@/components/layout/app-shell";

export default function EconomicCalendarPage() {
  return (
    <AppShell title="Economic Calendar" subtitle="Market preparation calendar for paper trading discipline.">
      <EconomicCalendar />
    </AppShell>
  );
}
