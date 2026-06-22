import { NextResponse } from "next/server";
import { getMorningBreakfastSnapshot } from "@/server/market/nse-pre-open";

export async function GET() {
  try {
    const snapshot = await getMorningBreakfastSnapshot();
    return NextResponse.json(snapshot);
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Morning Breakfast scanner unavailable";

    return NextResponse.json(
      {
        items: [],
        highMoneyFlowItems: [],
        updatedAt: new Date().toISOString(),
        source: "nse-official",
        message
      },
      { status: 200 }
    );
  }
}
