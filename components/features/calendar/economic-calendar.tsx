import { Clock, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { economicEvents } from "@/lib/platform-content";

export function EconomicCalendar() {
  return (
    <Card className="border-gold/20 bg-black/35">
      <CardHeader>
        <CardTitle>Economic Calendar</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">A practical trading-day calendar for market preparation and journal review.</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        {economicEvents.map((event) => (
          <div key={`${event.date}-${event.time}-${event.event}`} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold">
                  <Landmark className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-white">{event.event}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={event.impact === "High" ? "bearish" : "outline"}>{event.impact}</Badge>
                <Badge variant="secondary">
                  <Clock className="mr-1 size-3" />
                  {event.time}
                </Badge>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{event.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
