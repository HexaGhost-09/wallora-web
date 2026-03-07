import { NextRequest, NextResponse } from "next/server";
import { trackVisit } from "@/lib/db/tracking";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : (req.headers.get("x-real-ip") || "unknown");
    const ua = req.headers.get("user-agent") || "unknown";

    console.log(`[Analytics] Tracking visit to ${path} from ${ip}`);
    await trackVisit(path, ip, ua, referrer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[Analytics Error] Failed to track: ${error}`);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
