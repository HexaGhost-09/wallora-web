import { NextRequest, NextResponse } from "next/server";
import { trackDownload } from "@/lib/db/tracking";
import { db } from "@/lib/db";
import { apkVersions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apkId = parseInt(params.id);
    
    // 1. Get the APK details
    const apk = await db.query.apkVersions.findFirst({
      where: eq(apkVersions.id, apkId),
    });

    if (!apk) {
      return NextResponse.json({ error: "APK not found" }, { status: 404 });
    }

    // 2. Track the download async
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";
    await trackDownload(apkId, ip, ua);

    // 3. Redirect to the actual download URL
    return NextResponse.redirect(new URL(apk.downloadUrl));
  } catch (error) {
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 });
  }
}
