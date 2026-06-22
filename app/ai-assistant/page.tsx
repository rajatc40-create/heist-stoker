import { AiTradingAssistant } from "@/components/features/assistant/ai-trading-assistant";
import { AppShell } from "@/components/layout/app-shell";

export default function AiAssistantPage() {
  return (
    <AppShell title="AI Assistant" subtitle="Education-mode trading assistant for planning and review.">
      <AiTradingAssistant />
    </AppShell>
  );
}
