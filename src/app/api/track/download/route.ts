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

  // Only allow release assets from the Wallora GitHub repository.
  if (
    target.hostname !== "github.com" ||
    target.pathname.split("/").slice(0, 3).join("/") !== "/HexaGhost-09/wallora-2" ||
    !target.pathname.includes("/releases/download/")
  ) {
    return NextResponse.json({ error: "Unsupported download host" }, { status: 400 });
  }

  // The release asset is the source of truth. Neon is used for optional
  // download analytics and must never prevent a valid GitHub download.
  try {
    const [release] = await db
      .select({ id: apkVersions.id })
      .from(apkVersions)
      .where(eq(apkVersions.versionName, version))
      .limit(1);

    await trackDownload(release?.id ?? null, req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown", req.headers.get("user-agent") || "unknown");
  } catch (error) {
    console.error("Download analytics unavailable; continuing to GitHub asset:", error);
  }

  return NextResponse.redirect(target.toString(), 302);
}
