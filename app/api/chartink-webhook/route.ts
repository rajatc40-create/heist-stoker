import { NextResponse } from "next/server";
import { saveChartinkWebhook, type ChartinkWebhookPayload } from "@/server/chartink/alerts.service";

export const dynamic = "force-dynamic";

const fallbackWebhookSecret = "heist-stoker-chartink-secret";

export async function POST(request: Request) {
  if (!isValidWebhookRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid Chartink webhook token." }, { status: 401 });
  }

  let payload: ChartinkWebhookPayload;

  try {
    payload = (await request.json()) as ChartinkWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Webhook body must be valid JSON." }, { status: 400 });
  }

  try {
    const result = saveChartinkWebhook(payload);

    return NextResponse.json({
      ok: true,
      inserted: result.inserted,
      duplicates: result.duplicates,
      alerts: result.alerts
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Chartink webhook could not be saved." },
      { status: 400 }
    );
  }
}

function isValidWebhookRequest(request: Request) {
  const expectedSecret = process.env.CHARTINK_WEBHOOK_SECRET || fallbackWebhookSecret;
  const url = new URL(request.url);
  const authorization = request.headers.get("authorization") ?? "";
  const bearerToken = authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7).trim() : "";
  const suppliedSecret =
    request.headers.get("x-chartink-token") ||
    request.headers.get("x-webhook-token") ||
    url.searchParams.get("token") ||
    bearerToken;

  return suppliedSecret === expectedSecret;
}
