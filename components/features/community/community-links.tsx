import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { communityLinks } from "@/lib/platform-content";

export function CommunityLinks() {
  return (
    <Card className="border-gold/20 bg-black/35">
      <CardHeader>
        <CardTitle>Telegram & WhatsApp Community Links</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">Keep student communication, alerts, and lesson updates in one place.</p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {communityLinks.map((link) => (
          <div key={link.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <MessageCircle className="size-5 text-bullish" />
            <h2 className="mt-4 text-lg font-bold text-white">{link.name}</h2>
            <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted-foreground">{link.description}</p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <a href={link.href} target="_blank" rel="noreferrer">
                <ArrowUpRight />
                Open Link
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
