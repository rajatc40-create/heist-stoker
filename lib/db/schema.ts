export const tableNames = [
  "Users",
  "Trades",
  "Watchlists",
  "WatchlistSymbols",
  "TradeJournal",
  "Settings",
  "ChartinkAlerts"
] as const;

export type TableName = (typeof tableNames)[number];

export interface Migration {
  id: string;
  description: string;
  sqlFile: string;
}

export const migrations: Migration[] = [
  {
    id: "001_init",
    description: "Initial HEIST STOKER paper trading schema.",
    sqlFile: "lib/db/schema.sql"
  }
];
