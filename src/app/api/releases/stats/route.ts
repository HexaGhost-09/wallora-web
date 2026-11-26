import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { apkVersions, downloads as downloadEvents } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows, drimeRows] = await Promise.all([
      db
        .select({
          id: apkVersions.id,
          version: apkVersions.versionName,
          githubDownloads: apkVersions.githubDownloadCount,
        })
        .from(apkVersions)
        .orderBy(desc(apkVersions.createdAt)),
      db
        .select({
          apkId: downloadEvents.apkId,
          count: sql<number>`count(*)`,
        })
        .from(downloadEvents)
        .where(sql`${downloadEvents.userAgent} LIKE 'drime:%'`)
        .groupBy(downloadEvents.apkId),
    ]);

    const drimeCounts = new Map(
      drimeRows.map(row => [row.apkId, Number(row.count) || 0])
    );

    // GitHub's real asset counter + successful Server 2 requests recorded by this site.
    return NextResponse.json(rows.map(row => ({
      version: row.version,
      downloads: Number(row.githubDownloads || 0) + (drimeCounts.get(row.id) || 0),
    })), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load release stats:", error);
    return NextResponse.json({ error: "Unable to load release statistics" }, { status: 500 });
  }
}
