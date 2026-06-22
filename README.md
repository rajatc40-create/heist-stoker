# HEIST STOKER

**DECODE SMART MONEY**

Professional paper trading platform foundation for stocks, indices, forex, and crypto. The current build uses mock market data only and keeps all real-money trading integrations behind future-ready adapter boundaries.

## Status

- Next.js App Router foundation
- React + TypeScript UI
- Tailwind CSS dark theme
- Shadcn-style component layer
- Zustand paper-trading store
- Node.js backend route handlers
- SQLite/PostgreSQL-ready schema
- Yahoo Finance chart feed for delayed live quotes
- Mock fallback data when the live feed is unavailable
- Broker/data provider adapter structure

Scanner calculations now run on live/delayed Yahoo chart prices when available. Each scanner file still includes:

```ts
// ADD YOUR CUSTOM SCANNER LOGIC HERE
```

## Folder Structure

```txt
.
├── app
│   ├── admin/page.tsx
│   ├── analytics/page.tsx
│   ├── api
│   │   ├── auth/guest/route.ts
│   │   ├── market/quotes/route.ts
│   │   ├── scanners/route.ts
│   │   ├── settings/route.ts
│   │   ├── trades/route.ts
│   │   └── watchlists/route.ts
│   ├── dashboard/page.tsx
│   ├── demo-trading/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── market-watch/page.tsx
│   ├── page.tsx
│   ├── scanner/page.tsx
│   ├── settings/page.tsx
│   ├── trading-journal/page.tsx
│   ├── watchlist/page.tsx
│   └── youtube/page.tsx
├── components
│   ├── branding
│   │   ├── auth-panel.tsx
│   │   ├── brand-mark.tsx
│   │   └── hero-section.tsx
│   ├── features
│   │   ├── admin/admin-panel.tsx
│   │   ├── analytics/analytics-dashboard.tsx
│   │   ├── dashboard/dashboard-home.tsx
│   │   ├── demo-trading/trading-ticket.tsx
│   │   ├── journal/trading-journal.tsx
│   │   ├── market/market-widgets.tsx
│   │   ├── market/metric-card.tsx
│   │   ├── scanner/scanner-board.tsx
│   │   ├── settings/settings-panel.tsx
│   │   ├── watchlist/watchlist-manager.tsx
│   │   └── youtube/youtube-channel.tsx
│   ├── layout
│   │   ├── app-shell.tsx
│   │   ├── mobile-nav.tsx
│   │   └── sidebar.tsx
│   └── ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
├── lib
│   ├── constants.ts
│   ├── db
│   │   ├── schema.sql
│   │   └── schema.ts
│   ├── mock-market-data.ts
│   ├── scanners
│   │   ├── breakoutScanner.ts
│   │   ├── customScannerTemplate.ts
│   │   ├── index.ts
│   │   ├── rsiScanner.ts
│   │   ├── topGainerScanner.ts
│   │   ├── topLoserScanner.ts
│   │   └── volumeSpikeScanner.ts
│   └── utils.ts
├── server
│   ├── api/routes.ts
│   ├── auth/auth.service.ts
│   ├── brokers
│   │   ├── adapters
│   │   │   ├── alphaVantage.ts
│   │   │   ├── angelOne.ts
│   │   │   ├── binance.ts
│   │   │   ├── mt5.ts
│   │   │   ├── tradingView.ts
│   │   │   ├── twelveData.ts
│   │   │   ├── upstox.ts
│   │   │   ├── yahooFinance.ts
│   │   │   └── zerodha.ts
│   │   ├── index.ts
│   │   └── types.ts
│   ├── db/client.ts
│   └── market
│       ├── live-market.service.ts
│       ├── symbol-map.ts
│       └── yahoo-chart-provider.ts
├── store/trading-store.ts
├── types/platform.ts
├── .env.example
├── components.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── pnpm-lock.yaml
├── tailwind.config.ts
└── tsconfig.json
```

## Frontend Structure

- `app/page.tsx` and `app/dashboard/page.tsx`: dashboard/home experience.
- `components/layout`: sidebar, mobile navigation, and app shell.
- `components/branding`: HEIST STOKER brand mark, hero, and auth panel.
- `components/features`: page modules for scanner, trading, watchlist, journal, analytics, YouTube, admin, and settings.
- `components/ui`: local Shadcn-style primitives for buttons, cards, tables, tabs, inputs, switches, labels, badges, and textareas.

## Backend Structure

- `app/api/*`: Next.js route handlers.
- `server/auth/auth.service.ts`: guest, email intent, and Google auth configuration stubs.
- `server/db/client.ts`: SQLite client using `better-sqlite3`.
- `server/market/*`: Yahoo Finance chart data normalization with mock fallback.
- `server/brokers/types.ts`: broker and market-data provider contracts.
- `server/brokers/adapters/*`: isolated future integration files for Zerodha, Upstox, Angel One, Binance, MT5, TradingView, Yahoo Finance, Alpha Vantage, and Twelve Data.

## Database Schema

Schema file: `lib/db/schema.sql`

Tables:

- `Users`
- `Trades`
- `Watchlists`
- `WatchlistSymbols`
- `TradeJournal`
- `Settings`

The SQL is SQLite-compatible and can be translated to PostgreSQL by replacing `TEXT` IDs with `UUID`, `DATETIME` with `TIMESTAMPTZ`, and using PostgreSQL enum/check policies as needed.

## Authentication Setup

Current UI supports:

- Guest Login
- Email Login
- Google Login

Current backend stubs:

- `POST /api/auth/guest`
- `createEmailLoginIntent(email)`
- `getGoogleAuthConfig()`

Add values in `.env.local`:

```env
AUTH_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

For production, connect NextAuth/Auth.js, Clerk, Supabase Auth, or a custom session service behind `server/auth/auth.service.ts`.

## Scanner Module

Scanner files:

- `lib/scanners/rsiScanner.ts`
- `lib/scanners/topGainerScanner.ts`
- `lib/scanners/topLoserScanner.ts`
- `lib/scanners/volumeSpikeScanner.ts`
- `lib/scanners/breakoutScanner.ts`
- `lib/scanners/customScannerTemplate.ts`

Active scanners:

- RSI Oversold: RSI period 14, condition `RSI < 30`
- RSI Overbought: RSI period 14, condition `RSI > 70`
- Top Gainers
- Top Losers
- Volume Spike: current volume greater than `2x` average volume
- Breakout Scanner: current price greater than previous high

Live scanner source:

- API: `GET /api/scanners`
- Provider: Yahoo Finance chart data through `server/market/yahoo-chart-provider.ts`
- Fallback: `lib/mock-market-data.ts`

Future placeholders:

- RSI 4 Scanner
- EMA 34 Scanner
- PDH Scanner
- PDL Scanner
- Liquidity Sweep Scanner
- HH LL Scanner
- Smart Money Scanner
- Wave Theory Scanner
- Option Selling Scanner

## Demo Trading Module

Supports:

- Buy trade
- Sell trade
- Entry price
- Quantity
- Stop loss
- Target 1
- Target 2
- Target 3
- Save trade
- Edit trade
- Delete trade
- Duplicate trade
- Close trade
- Open P&L
- Closed P&L
- Risk reward
- Trade duration
- Live/delayed current price
- Open P&L recalculation from current price
- Manual `Use Live Price` button for entry price

State lives in `store/trading-store.ts`.

Current prices are fetched from:

```txt
GET /api/market/quotes?symbols=NIFTY,BANKNIFTY,RELIANCE,BTCUSDT
```

## Watchlist Module

Supports:

- Create watchlists
- Add symbol
- Remove symbol
- Show mock price/change data when the symbol exists in `lib/mock-market-data.ts`

## Trading Journal

Fields:

- Trade notes
- Mistake
- Lesson learned
- Psychology notes
- Screenshot upload filename capture

## Analytics Page

Metrics:

- Win rate
- Average winner
- Average loser
- Profit factor
- Drawdown
- Monthly performance

Charts:

- Equity curve
- Monthly P&L
- Win/loss ratio

Charts use `recharts`.

## YouTube Page

Channel:

- HEIST STOKER

Includes:

- Banner
- Video cards
- Subscribe button

## Admin Panel

Admin can:

- Add scanner
- Remove scanner
- Enable scanner
- Disable scanner
- Edit settings placeholder

## Settings Page

Settings include:

- Website name
- Theme
- Scanner settings
- RSI settings
- YouTube link

## Branding And Theme

Brand:

- Name: `HEIST STOKER`
- Tagline: `DECODE SMART MONEY`
- Concepts: `Liquidity • Psychology • Wave Theory`

Theme:

- Dark black background
- Gold accent
- White text
- Green bullish state
- Red bearish state

Theme configuration is in:

- `tailwind.config.ts`
- `app/globals.css`
- `lib/constants.ts`

## API Routes

```txt
POST /api/auth/guest
GET  /api/market/quotes
GET  /api/scanners
GET  /api/trades
POST /api/trades
GET  /api/watchlists
POST /api/watchlists
GET  /api/settings
PUT  /api/settings
```

## Run Locally

```bash
npm install
npm run dev
```

This workspace was verified with pnpm:

```bash
pnpm install
pnpm run typecheck
pnpm run build
pnpm exec next dev --hostname 127.0.0.1 --port 3000
```

If pnpm blocks native package build scripts, run `pnpm approve-builds` and approve native builds only when you need local SQLite execution or Next image optimization.

Open:

```txt
http://localhost:3000
```

Useful checks:

```bash
npm run typecheck
npm run build
```

## Integration Plan

1. Keep Yahoo chart feed for quick delayed demo testing.
2. Add official API keys for Alpha Vantage, Twelve Data, or a paid market data provider when you need stronger reliability.
3. Implement broker-specific API clients in `server/brokers/adapters`.
4. Normalize provider payloads into `MarketAsset`.
5. Store scanner snapshots and trades in SQLite or PostgreSQL.
6. Keep real-money order placement disabled until risk controls, audit logs, and broker sandbox testing are complete.
7. Add TradingView webhook ingestion through a secured route using `TRADINGVIEW_WEBHOOK_SECRET`.
8. Add MT5 bridge calls through `MT5_BRIDGE_URL`.

## Safety Note

This project is paper trading only. Do not connect live order placement until authentication, authorization, broker sandbox testing, rate limits, order validation, and audit logging are implemented.

Yahoo Finance chart data is suitable for demo and delayed market checks, not professional execution-grade trading.
