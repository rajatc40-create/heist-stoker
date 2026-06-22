import { NextResponse } from "next/server";

const settings = {
  websiteName: "HEIST STOKER",
  theme: "Dark Gold",
  scannerRefreshSeconds: 30,
  rsiPeriod: 14,
  rsiOversold: 30,
  rsiOverbought: 70,
  youtubeLink: "https://www.youtube.com/@HEISTSTOKER",
  heroBannerMode: "green",
  heroBannerCustomUrl: ""
};

export async function GET() {
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  return NextResponse.json({ settings: { ...settings, ...payload } });
}
