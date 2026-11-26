import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { apkVersions, downloads } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        version: apkVersions.versionName,
        githubDownloads: apkVersions.githubDownloadCount,
        trackedDownloads: sql<number>`count(${downloads.id})::int`,
      })
      .from(apkVersions)
      .leftJoin(downloads, eq(downloads.apkId, apkVersions.id))
      .groupBy(apkVersions.id)
      .orderBy(desc(apkVersions.createdAt));

    return NextResponse.json(rows.map(row => ({
      version: row.version,
      downloads: Number(row.githubDownloads || 0) + Number(row.trackedDownloads || 0),
    })), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load release stats:", error);
    return NextResponse.json({ error: "Unable to load release statistics" }, { status: 500 });
  }
}
