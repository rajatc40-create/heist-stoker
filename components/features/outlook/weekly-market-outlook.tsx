import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { psychologyQuotes, weeklyOutlook } from "@/lib/platform-content";

export function WeeklyMarketOutlook() {
  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Weekly Market Outlook</CardTitle>
            <Badge>Student Plan</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">A simple weekly routine for scanner, option chain, and journal review.</p>
        </CardHeader>
        <CardContent className="grid gap-3">
          {weeklyOutlook.map((item) => (
            <div key={item.day} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold">
                    <CalendarCheck className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.day}</p>
                    <p className="text-sm text-gold">{item.focus}</p>
                  </div>
                </div>
                <Badge variant="outline">Plan</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.plan}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardHeader>
          <CardTitle>Trading Psychology Quotes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {psychologyQuotes.map((item) => (
            <div key={item.quote} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <CheckCircle2 className="size-5 text-bullish" />
              <p className="mt-3 text-sm font-semibold leading-6 text-white">{item.quote}</p>
              <p className="mt-2 text-xs text-muted-foreground">{item.focus}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
