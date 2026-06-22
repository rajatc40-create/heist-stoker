import { NextResponse } from "next/server";
import { mockTrades } from "@/lib/mock-market-data";

export async function GET() {
  return NextResponse.json({ trades: mockTrades });
}

export async function POST(request: Request) {
  const payload = await request.json();

  return NextResponse.json(
    {
      trade: {
        id: `trd-${Date.now()}`,
        status: "OPEN",
        openedAt: new Date().toISOString(),
        ...payload
      }
    },
    { status: 201 }
  );
}
