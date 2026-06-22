import { Brain, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { psychologyQuotes } from "@/lib/platform-content";

const rules = ["No revenge trading", "Wait for setup", "Journal every trade", "Respect stop loss"];

export function PsychologyQuotes() {
  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader>
          <CardTitle>Trading Psychology Quotes</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Short reminders for discipline before demo trading.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {psychologyQuotes.map((item) => (
            <div key={item.quote} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <Brain className="size-5 text-gold" />
              <p className="mt-4 text-base font-bold leading-7 text-white">{item.quote}</p>
              <Badge className="mt-4" variant="outline">{item.focus}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardHeader>
          <CardTitle>Discipline Rules</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {rules.map((rule) => (
            <div key={rule} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-white">
              <CheckCircle2 className="size-4 text-bullish" />
              {rule}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
