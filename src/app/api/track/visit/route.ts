import { NextRequest, NextResponse } from "next/server";
import { trackVisit } from "@/lib/db/tracking";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";

    await trackVisit(path, ip, ua, referrer);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
