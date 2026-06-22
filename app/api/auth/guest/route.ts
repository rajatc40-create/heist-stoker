import { NextResponse } from "next/server";
import { createGuestSession } from "@/server/auth/auth.service";

export async function POST() {
  return NextResponse.json(createGuestSession());
}
