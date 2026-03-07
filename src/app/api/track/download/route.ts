import { NextRequest, NextResponse } from "next/server";
import { trackDownload } from "@/lib/db/tracking";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";

    // Track an anonymous download (no specific apkId)
    await trackDownload(null, ip, ua);

    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 });
  }
}
