import { NextResponse } from "next/server";
import { getCalendarEvents } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  try {
    const result = await getCalendarEvents();
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Could not fetch calendar events." },
      { status: 500 },
    );
  }
}
