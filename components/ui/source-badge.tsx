import { Badge } from "@/components/ui/badge";

type SourceKind = "NSE Official" | "Yahoo Delayed" | "Chartink Alert" | "Manual Demo Data" | "Paper Mode";

const sourceStyles: Record<SourceKind, "bullish" | "outline" | "secondary"> = {
  "NSE Official": "bullish",
  "Yahoo Delayed": "outline",
  "Chartink Alert": "secondary",
  "Manual Demo Data": "outline",
  "Paper Mode": "outline"
};

export function SourceBadge({ source }: { source: SourceKind }) {
  return <Badge variant={sourceStyles[source]}>{source}</Badge>;
}
