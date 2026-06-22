import type { HighMoneyFlowItem, MorningBreakfastItem } from "@/types/platform";

const NSE_HOME = "https://www.nseindia.com/";
const NSE_PRE_OPEN_URL = "https://www.nseindia.com/api/market-data-pre-open?key=NIFTY";

interface MorningBreakfastSnapshot {
  items: MorningBreakfastItem[];
  highMoneyFlowItems: HighMoneyFlowItem[];
  updatedAt: string;
  source: "nse-official";
  message?: string;
}

interface PreOpenCandidate {
  symbol: string;
  prevClose: number;
  iep: number;
  change: number;
  percentChange: number;
  valueLakhs: number;
  finalQuantity: number;
}

function parseNseTimestamp(value: string | null) {
  if (!value) {
    return new Date().toISOString();
  }

  const match = value.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);

  if (!match) {
    return new Date().toISOString();
  }

  const [, day, monthText, year, hour, minute, second] = match;
  const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(
    monthText
  );

  if (monthIndex < 0) {
    return new Date().toISOString();
  }

  return new Date(Number(year), monthIndex, Number(day), Number(hour), Number(minute), Number(second)).toISOString();
}

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readPath(source: unknown, path: string[]) {
  let current: unknown = source;

  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

function firstNumber(source: unknown, paths: string[][]) {
  for (const path of paths) {
    const parsed = parseNumber(readPath(source, path));

    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function firstString(source: unknown, paths: string[][]) {
  for (const path of paths) {
    const value = readPath(source, path);

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function rankMap<T>(items: T[], selector: (item: T) => number) {
  const sorted = [...items].sort((left, right) => selector(right) - selector(left));

  return new Map(sorted.map((item, index) => [item, sorted.length - index]));
}

function buildMorningReason(item: PreOpenCandidate, position: number, strongestByValue: string, strongestByQuantity: string) {
  const reasons = [`${item.symbol} selected because pre-open change is positive.`];

  if (position === 1) {
    reasons.push("It ranks highest on the Morning Score mix.");
  }

  if (item.symbol === strongestByValue) {
    reasons.push("Value is among the strongest in NIFTY 50 pre-open.");
  }

  if (item.symbol === strongestByQuantity) {
    reasons.push("Final quantity is also leading.");
  }

  return reasons.join(" ");
}

function normalizePreOpenCandidates(payload: unknown) {
  const rows = Array.isArray((payload as { data?: unknown[] })?.data) ? (payload as { data: unknown[] }).data : [];

  return rows
    .map((row) => {
      const symbol = firstString(row, [["metadata", "symbol"], ["symbol"]]);
      const prevClose = firstNumber(row, [["metadata", "previousClose"], ["detail", "preOpenMarket", "previousClose"]]);
      const iep = firstNumber(row, [["metadata", "iep"], ["detail", "preOpenMarket", "IEP"], ["detail", "preOpenMarket", "iep"]]);
      const change = firstNumber(row, [["metadata", "change"], ["detail", "preOpenMarket", "Change"], ["detail", "preOpenMarket", "change"]]);
      const percentChange = firstNumber(row, [["metadata", "pChange"], ["metadata", "perChange"], ["detail", "preOpenMarket", "perChange"]]);
      const turnoverValue = firstNumber(row, [
        ["detail", "preOpenMarket", "totalTurnover"],
        ["detail", "preOpenMarket", "totalTradedValue"],
        ["metadata", "totalTurnover"],
        ["metadata", "value"]
      ]);
      const finalQuantity = firstNumber(row, [
        ["detail", "preOpenMarket", "finalQuantity"],
        ["metadata", "finalQuantity"],
        ["detail", "preOpenMarket", "totalTradedVolume"]
      ]);

      if (
        !symbol ||
        prevClose === null ||
        iep === null ||
        change === null ||
        percentChange === null ||
        turnoverValue === null ||
        finalQuantity === null
      ) {
        return null;
      }

      return {
        symbol,
        prevClose,
        iep,
        change,
        percentChange,
        valueLakhs: turnoverValue / 100000,
        finalQuantity
      } satisfies PreOpenCandidate;
    })
    .filter((item): item is PreOpenCandidate => item !== null)
    .filter((item) => item.percentChange > 0 && item.valueLakhs > 0 && item.finalQuantity > 0);
}

function buildMorningBreakfastItems(candidates: PreOpenCandidate[]) {
  const percentRanks = rankMap(candidates, (item) => item.percentChange);
  const valueRanks = rankMap(candidates, (item) => item.valueLakhs);
  const quantityRanks = rankMap(candidates, (item) => item.finalQuantity);
  const strongestByValue = [...candidates].sort((left, right) => right.valueLakhs - left.valueLakhs)[0]?.symbol ?? "";
  const strongestByQuantity = [...candidates].sort((left, right) => right.finalQuantity - left.finalQuantity)[0]?.symbol ?? "";

  return candidates
    .map((item) => {
      const morningScore =
        (percentRanks.get(item) ?? 0) * 0.3 + (valueRanks.get(item) ?? 0) * 0.5 + (quantityRanks.get(item) ?? 0) * 0.2;

      return {
        ...item,
        morningScore: Number(morningScore.toFixed(2))
      };
    })
    .sort((left, right) => right.morningScore - left.morningScore)
    .slice(0, 4)
    .map((item, index) => ({
      rank: index + 1,
      ...item,
      highlighted: true,
      reason: buildMorningReason(item, index + 1, strongestByValue, strongestByQuantity)
    }));
}

function buildHighMoneyFlowItems(candidates: PreOpenCandidate[]) {
  const topValue = [...candidates].sort((left, right) => right.valueLakhs - left.valueLakhs).slice(0, 10);
  const strongestSymbol = topValue[0]?.symbol ?? "";

  return topValue.map((item, index) => ({
    rank: index + 1,
    symbol: item.symbol,
    percentChange: item.percentChange,
    valueLakhs: item.valueLakhs,
    finalQuantity: item.finalQuantity,
    iep: item.iep,
    highlighted: index < 4,
    reason:
      item.symbol === strongestSymbol
        ? `${item.symbol} is leading because value is highest in the pre-open positive list.`
        : `${item.symbol} is selected because positive change is backed by strong money flow.`
  }));
}

export async function getMorningBreakfastSnapshot(): Promise<MorningBreakfastSnapshot> {
  const headers = {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    accept: "application/json,text/plain,*/*",
    "accept-language": "en-US,en;q=0.9",
    referer: "https://www.nseindia.com/market-data/pre-open-market-cm-and-emerge-market",
    origin: "https://www.nseindia.com",
    pragma: "no-cache",
    "cache-control": "no-cache"
  };

  const homeResponse = await fetch(NSE_HOME, {
    headers,
    cache: "no-store"
  });

  const cookie = homeResponse.headers.get("set-cookie") ?? "";

  const response = await fetch(NSE_PRE_OPEN_URL, {
    headers: {
      ...headers,
      cookie
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`NSE pre-open feed returned ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const candidates = normalizePreOpenCandidates(payload);
  const items = buildMorningBreakfastItems(candidates);
  const highMoneyFlowItems = buildHighMoneyFlowItems(candidates);
  const lastUpdateTime = firstString(payload, [["data", "0", "detail", "preOpenMarket", "lastUpdateTime"]]);

  return {
    items,
    highMoneyFlowItems,
    updatedAt: parseNseTimestamp(lastUpdateTime),
    source: "nse-official",
    message: items.length ? undefined : "No positive NIFTY 50 pre-open movers available yet."
  };
}
