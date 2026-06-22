"use client";

import { useMemo, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { aiAssistantPrompts } from "@/lib/platform-content";

export function AiTradingAssistant() {
  const [prompt, setPrompt] = useState(aiAssistantPrompts[0]);
  const answer = useMemo(() => buildAssistantAnswer(prompt), [prompt]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>AI Trading Assistant</CardTitle>
            <Badge>
              <Sparkles className="mr-1 size-3" />
              Education Mode
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask for NIFTY bias, risk plans, journal review, scanner explanation, and weekly preparation help.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="min-h-[140px]"
            placeholder="Ask about NIFTY, BANKNIFTY, scanner result, risk plan, or journal review"
          />
          <Button className="w-full md:w-fit">
            <Send />
            Generate Guidance
          </Button>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-gold" />
              <p className="font-bold text-white">Assistant Response</p>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{answer}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardHeader>
          <CardTitle>Quick Prompts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {aiAssistantPrompts.map((item) => (
            <Button key={item} type="button" variant="outline" className="justify-start whitespace-normal text-left" onClick={() => setPrompt(item)}>
              {item}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function buildAssistantAnswer(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("weekly")) {
    return [
      "1. Start the week by marking last week's high, low, and key option zones.",
      "2. Decide which days are for scanner aggression and which days are only for review.",
      "3. Keep separate plans for NIFTY, BANKNIFTY, and one backup stock list.",
      "4. Set a weekly max loss rule before the first trade."
    ].join("\n");
  }

  if (normalized.includes("scanner")) {
    return [
      "1. Scanner result is a shortlist, not a final trade signal.",
      "2. Check whether price, volume, and structure are aligned with the scanner tag.",
      "3. Avoid entries when scanner result appears after an extended candle.",
      "4. Save only the best setup into your paper trade and journal."
    ].join("\n");
  }

  if (normalized.includes("banknifty") || normalized.includes("option") || normalized.includes("risk plan")) {
    return [
      "1. Mark BANKNIFTY support and resistance before selecting CE or PE.",
      "2. Use lot size and max risk first, then decide strike and side.",
      "3. Keep stop loss written before entry and avoid averaging in paper practice.",
      "4. Review whether the trade matched bias, option chain, and timing."
    ].join("\n");
  }

  if (normalized.includes("psychology") || normalized.includes("mistake") || normalized.includes("journal")) {
    return [
      "1. Name the emotion before naming the setup.",
      "2. Check whether entry followed your scanner rule or was forced.",
      "3. Write one lesson and one prevention rule for the next session.",
      "4. Take the next trade only after the checklist is clean."
    ].join("\n");
  }

  if (normalized.includes("checklist") || normalized.includes("pre-market")) {
    return [
      "1. Check global market mood, GIFTY, VIX, NIFTY, and BANKNIFTY.",
      "2. Mark PDH, PDL, opening range, liquidity zones, and major option strikes.",
      "3. Keep only 2 to 3 high quality stocks or indices in focus.",
      "4. Decide max loss and best setup before market opens."
    ].join("\n");
  }

  return [
    "1. Start with NIFTY and BANKNIFTY bias, not random stocks.",
    "2. Use scanner alerts as a shortlist, then confirm with price action.",
    "3. Enter only in paper mode with defined stop loss, lot size, and target.",
    "4. Save the result in Trading Journal for review."
  ].join("\n");
}
