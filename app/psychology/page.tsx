import { PsychologyQuotes } from "@/components/features/psychology/psychology-quotes";
import { AppShell } from "@/components/layout/app-shell";

export default function PsychologyPage() {
  return (
    <AppShell title="Psychology" subtitle="Trading psychology quotes and discipline checklist.">
      <PsychologyQuotes />
    </AppShell>
  );
}
