import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { apkVersions } from "@/lib/db/schema";
import { trackDownload } from "@/lib/db/tracking";

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  const version = req.nextUrl.searchParams.get("version");

  if (!rawUrl || !version) {
    return NextResponse.json({ error: "Missing download URL or version" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid download URL" }, { status: 400 });
  }

  if (target.hostname !== "github.com" || !target.pathname.includes("/releases/download/")) {
    return NextResponse.json({ error: "Unsupported download host" }, { status: 400 });
  }

  try {
    const [release] = await db.select({ id: apkVersions.id })
      .from(apkVersions)
      .where(eq(apkVersions.versionName, version))
      .limit(1);

    if (!release) return NextResponse.json({ error: "Release version not found" }, { status: 404 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";
    await trackDownload(release.id, ip, ua);

    return NextResponse.redirect(target.toString());
  } catch (error) {
    console.error("Failed to process download:", error);
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 });
  }
}
