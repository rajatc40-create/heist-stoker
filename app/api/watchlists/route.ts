import { NextResponse } from "next/server";
import { mockWatchlists } from "@/lib/mock-market-data";

export async function GET() {
  return NextResponse.json({ watchlists: mockWatchlists });
}

export async function POST(request: Request) {
  const payload = await request.json();

  return NextResponse.json(
    {
      watchlist: {
        id: `wl-${Date.now()}`,
        symbols: [],
        createdAt: new Date().toISOString(),
        ...payload
      }
    },
    { status: 201 }
  );
}
