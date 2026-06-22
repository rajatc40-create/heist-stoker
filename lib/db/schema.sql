CREATE TABLE IF NOT EXISTS Users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'guest',
  role TEXT NOT NULL DEFAULT 'trader',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Trades (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  asset_class TEXT NOT NULL CHECK (asset_class IN ('Stocks', 'Indices', 'Forex', 'Crypto')),
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  entry_price REAL NOT NULL,
  quantity REAL NOT NULL,
  stop_loss REAL NOT NULL,
  target_1 REAL NOT NULL,
  target_2 REAL NOT NULL,
  target_3 REAL NOT NULL,
  exit_price REAL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
  notes TEXT,
  opened_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Watchlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WatchlistSymbols (
  id TEXT PRIMARY KEY,
  watchlist_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  asset_class TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (watchlist_id, symbol),
  FOREIGN KEY (watchlist_id) REFERENCES Watchlists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TradeJournal (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  trade_id TEXT,
  symbol TEXT NOT NULL,
  trade_notes TEXT,
  mistake TEXT,
  lesson_learned TEXT,
  psychology_notes TEXT,
  screenshot_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (trade_id) REFERENCES Trades(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Settings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  website_name TEXT NOT NULL DEFAULT 'HEIST STOKER',
  theme TEXT NOT NULL DEFAULT 'Dark Gold',
  scanner_refresh_seconds INTEGER NOT NULL DEFAULT 30,
  rsi_period INTEGER NOT NULL DEFAULT 14,
  rsi_oversold INTEGER NOT NULL DEFAULT 30,
  rsi_overbought INTEGER NOT NULL DEFAULT 70,
  youtube_link TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

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
