import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { apkVersions } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        version: apkVersions.versionName,
        downloads: apkVersions.githubDownloadCount,
      })
      .from(apkVersions)
      .orderBy(desc(apkVersions.createdAt));

    // Report GitHub's actual release-asset download counters only.
    // Local website tracking is kept separately to avoid double-counting.
    return NextResponse.json(rows.map(row => ({
      version: row.version,
      downloads: Number(row.downloads || 0),
    })), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load release stats:", error);
    return NextResponse.json({ error: "Unable to load release statistics" }, { status: 500 });
  }
}
