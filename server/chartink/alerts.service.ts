import { randomUUID } from "crypto";
import { createRequire } from "module";
import type { ChartinkAlert } from "@/types/platform";

interface NodeSqliteStatement {
  run: (...params: unknown[]) => { changes: number };
  get: (...params: unknown[]) => unknown;
  all: (...params: unknown[]) => unknown[];
}

interface NodeSqliteDatabase {
  exec: (sql: string) => void;
  prepare: (sql: string) => NodeSqliteStatement;
}

const nodeRequire = createRequire(import.meta.url);
const { DatabaseSync } = nodeRequire("node:sqlite") as {
  DatabaseSync: new (filename: string) => NodeSqliteDatabase;
};

let chartinkDatabase: NodeSqliteDatabase | null = null;

export interface ChartinkWebhookPayload {
  stocks?: unknown;
  trigger_prices?: unknown;
  triggered_at?: unknown;
  scan_name?: unknown;
  scan_url?: unknown;
  alert_name?: unknown;
}

interface ChartinkAlertRow {
  id: string;
  stock: string;
  trigger_price: number | null;
  scan_name: string;
  scan_url: string | null;
  alert_name: string | null;
  triggered_at: string;
  received_at: string;
}

export interface ChartinkSaveResult {
  inserted: number;
  duplicates: number;
  alerts: ChartinkAlert[];
}

export function ensureChartinkAlertsTable() {
  getChartinkDatabase().exec(`
    CREATE TABLE IF NOT EXISTS ChartinkAlerts (
      id TEXT PRIMARY KEY,
      stock TEXT NOT NULL,
      trigger_price REAL,
      scan_name TEXT NOT NULL,
      scan_url TEXT,
      alert_name TEXT,
      triggered_at DATETIME NOT NULL,
      received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      raw_payload TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_chartink_alerts_dedupe
    ON ChartinkAlerts(stock, scan_name, triggered_at);

    CREATE INDEX IF NOT EXISTS idx_chartink_alerts_recent
    ON ChartinkAlerts(triggered_at DESC, received_at DESC);
  `);
}

export function saveChartinkWebhook(payload: ChartinkWebhookPayload): ChartinkSaveResult {
  ensureChartinkAlertsTable();

  const stocks = toStringList(payload.stocks).map((stock) => stock.toUpperCase());
  const triggerPrices = toNumberList(payload.trigger_prices);
  const scanName = toSingleLine(payload.scan_name) || "Chartink Scanner";
  const scanUrl = toSingleLine(payload.scan_url) || null;
  const alertName = toSingleLine(payload.alert_name) || null;
  const triggeredAt = toIsoDateTime(payload.triggered_at);
  const rawPayload = JSON.stringify(payload);

  if (!stocks.length) {
    throw new Error("Chartink webhook payload must include at least one stock.");
  }

  const database = getChartinkDatabase();
  const insertAlert = database.prepare(`
    INSERT OR IGNORE INTO ChartinkAlerts (
      id,
      stock,
      trigger_price,
      scan_name,
      scan_url,
      alert_name,
      triggered_at,
      raw_payload
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const selectAlert = database.prepare(`
    SELECT id, stock, trigger_price, scan_name, scan_url, alert_name, triggered_at, received_at
    FROM ChartinkAlerts
    WHERE stock = ? AND scan_name = ? AND triggered_at = ?
  `);

  let inserted = 0;
  let duplicates = 0;
  const alerts: ChartinkAlert[] = [];

  database.exec("BEGIN IMMEDIATE TRANSACTION");

  try {
    stocks.forEach((stock, index) => {
      const triggerPrice = triggerPrices[index] ?? (triggerPrices.length === 1 ? triggerPrices[0] : null);
      const result = insertAlert.run(randomUUID(), stock, triggerPrice, scanName, scanUrl, alertName, triggeredAt, rawPayload);

      if (result.changes > 0) {
        inserted += 1;
      } else {
        duplicates += 1;
      }

      const row = selectAlert.get(stock, scanName, triggeredAt) as ChartinkAlertRow | undefined;
      if (row) {
        alerts.push(mapChartinkAlert(row));
      }
    });

    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }

  return { inserted, duplicates, alerts };
}

export function listChartinkAlerts(limit = 50): ChartinkAlert[] {
  ensureChartinkAlertsTable();

  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 200);
  const rows = getChartinkDatabase()
    .prepare(
      `
      SELECT id, stock, trigger_price, scan_name, scan_url, alert_name, triggered_at, received_at
      FROM ChartinkAlerts
      ORDER BY datetime(triggered_at) DESC, datetime(received_at) DESC
      LIMIT ?
    `
    )
    .all(safeLimit) as ChartinkAlertRow[];

  return rows.map(mapChartinkAlert);
}

function getChartinkDatabase() {
  if (!chartinkDatabase) {
    const filename = process.env.DATABASE_URL?.replace("file:", "") || "heist-stoker.sqlite";
    chartinkDatabase = new DatabaseSync(filename);
    chartinkDatabase.exec("PRAGMA journal_mode = WAL");
    chartinkDatabase.exec("PRAGMA foreign_keys = ON");
  }

  return chartinkDatabase;
}

function mapChartinkAlert(row: ChartinkAlertRow): ChartinkAlert {
  return {
    id: row.id,
    stock: row.stock,
    triggerPrice: row.trigger_price,
    scanName: row.scan_name,
    scanUrl: row.scan_url,
    alertName: row.alert_name,
    triggeredAt: row.triggered_at,
    receivedAt: row.received_at
  };
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(stringify).map(cleanText).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(/[\n,]+/).map(cleanText).filter(Boolean);
  }

  const cleaned = cleanText(stringify(value));
  return cleaned ? [cleaned] : [];
}

function toNumberList(value: unknown): number[] {
  return toStringList(value)
    .map((entry) => Number(entry.replace(/[^\d.-]/g, "")))
    .filter((entry) => Number.isFinite(entry));
}

function toSingleLine(value: unknown) {
  return cleanText(stringify(value)).replace(/\s+/g, " ");
}

function stringify(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function cleanText(value: string) {
  return value.trim();
}

function toIsoDateTime(value: unknown) {
  const raw = toSingleLine(value);
  const parsed = raw ? new Date(raw) : new Date();

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}
