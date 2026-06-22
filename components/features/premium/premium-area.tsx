import type { ReactNode } from "react";
import { CheckCircle2, Crown, MessageCircleMore, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { premiumPlans } from "@/lib/platform-content";

export function PremiumArea() {
  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Premium Membership</CardTitle>
            <Badge>Education Mode</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrade HEIST STOKER into a customer-ready student dashboard with scanner practice, paper trading, and mentorship access.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-4">
          {premiumPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-4 ${
                index === 2 ? "border-gold/35 bg-gold/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <Crown className="size-5 text-gold" />
                <Badge variant={index === 0 ? "bullish" : "outline"}>{plan.price}</Badge>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{plan.name}</h2>
              <div className="mt-4 grid gap-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-bullish" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Join Premium"
          description="Unlock all scanners, option strategy tools, weekly outlook, and advanced analytics."
          icon={<Crown className="size-5" />}
          buttonLabel="Join Premium"
        />
        <ActionCard
          title="Request WhatsApp Access"
          description="Get student updates, scanner notes, reminders, and practice desk coordination."
          icon={<MessageCircleMore className="size-5" />}
          buttonLabel="Request WhatsApp Access"
          tone="secondary"
        />
        <ActionCard
          title="Book Mentorship Call"
          description="Private trade review, risk planning, class notes, and live market practice guidance."
          icon={<PhoneCall className="size-5" />}
          buttonLabel="Book Mentorship Call"
          tone="outline"
        />
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  buttonLabel,
  icon,
  tone = "default"
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
  tone?: "default" | "secondary" | "outline";
}) {
  return (
    <Card className="border-white/10 bg-black/35">
      <CardContent className="p-5">
        <div className="grid size-10 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold">{icon}</div>
        <p className="mt-4 text-lg font-bold text-white">{title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <Button className="mt-5 w-full" variant={tone}>
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
