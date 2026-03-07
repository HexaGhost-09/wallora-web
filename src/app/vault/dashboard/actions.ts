"use server";

import { db } from "@/lib/db";
import { webAnalytics, downloads, admins, systemLogs, apkVersions } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    // Total counts
    const totalVisits = await db.select({ count: sql<number>`count(*)` }).from(webAnalytics);
    const totalDownloads = await db.select({ count: sql<number>`count(*)` }).from(downloads);
    const totalAdmins = await db.select({ count: sql<number>`count(*)` }).from(admins);
    
    // Daily counts (Postgres native comparison)
    const dailyVisits = await db.select({ count: sql<number>`count(*)` })
      .from(webAnalytics)
      .where(sql`${webAnalytics.visitedAt}::date = CURRENT_DATE`);
    
    const dailyDownloads = await db.select({ count: sql<number>`count(*)` })
      .from(downloads)
      .where(sql`${downloads.downloadedAt}::date = CURRENT_DATE`);

    // Monthly counts
    const monthlyVisits = await db.select({ count: sql<number>`count(*)` })
      .from(webAnalytics)
      .where(sql`${webAnalytics.visitedAt} >= date_trunc('month', CURRENT_DATE)`);
    
    const monthlyDownloads = await db.select({ count: sql<number>`count(*)` })
      .from(downloads)
      .where(sql`${downloads.downloadedAt} >= date_trunc('month', CURRENT_DATE)`);

    // Live users (active in last 5 mins using native interval)
    const liveUsers = await db.select({ count: sql<number>`count(distinct ${webAnalytics.ipAddress})` })
      .from(webAnalytics)
      .where(sql`${webAnalytics.visitedAt} >= now() - interval '5 minutes'`);

    const recentLogs = await db.select()
      .from(systemLogs)
      .orderBy(desc(systemLogs.createdAt))
      .limit(10);

    return {
      totalVisits: Number(totalVisits[0].count) || 0,
      totalDownloads: Number(totalDownloads[0].count) || 0,
      dailyVisits: Number(dailyVisits[0].count) || 0,
      dailyDownloads: Number(dailyDownloads[0].count) || 0,
      monthlyVisits: Number(monthlyVisits[0].count) || 0,
      monthlyDownloads: Number(monthlyDownloads[0].count) || 0,
      liveUsers: Number(liveUsers[0].count) || 0,
      admins: Number(totalAdmins[0].count) || 0,
      recentLogs: recentLogs.map(log => ({
        ...log,
        createdAt: log.createdAt?.toISOString() || new Date().toISOString()
      }))
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalVisits: 0,
      totalDownloads: 0,
      dailyVisits: 0,
      dailyDownloads: 0,
      monthlyVisits: 0,
      monthlyDownloads: 0,
      liveUsers: 0,
      admins: 0,
      recentLogs: []
    };
  }
}

export async function getApkVersions() {
  return await db.select().from(apkVersions).orderBy(desc(apkVersions.createdAt));
}

export async function createApkVersion(data: any) {
  return await db.insert(apkVersions).values(data);
}

export async function deleteApkVersion(id: number) {
  return await db.delete(apkVersions).where(sql`id = ${id}`);
}

export async function getFullLogs() {
  return await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(100);
}

export async function checkDatabaseConnection() {
  try {
    const start = Date.now();
    await db.execute(sql`SELECT 1`);
    const duration = Date.now() - start;
    return { status: "healthy", latency: duration, error: null };
  } catch (error: any) {
    console.error("Database connection check failed:", error);
    
    // Check if the var exists at all to help debug Netlify caching
    const hasUrlAtRuntime = !!process.env.DATABASE_URL;
    const urlLength = process.env.DATABASE_URL?.length || 0;
    
    return { 
      status: "unreachable", 
      latency: 0, 
      error: (error?.message || String(error)) + `\n\n[Debug] Runtime URL exists: ${hasUrlAtRuntime} (length: ${urlLength})` 
    };
  }
}

