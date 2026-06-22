import { NextResponse } from "next/server";
import { listChartinkAlerts } from "@/server/chartink/alerts.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 50);
  const alerts = listChartinkAlerts(Number.isFinite(limit) ? limit : 50);

  return NextResponse.json({
    alerts,
    count: alerts.length,
    updatedAt: new Date().toISOString()
  });
}
