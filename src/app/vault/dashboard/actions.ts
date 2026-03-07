"use server";

import { db } from "@/lib/db";
import { webAnalytics, downloads, admins, systemLogs, apkVersions } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total counts
    const totalVisits = await db.select({ count: sql<number>`count(*)` }).from(webAnalytics);
    const totalDownloads = await db.select({ count: sql<number>`count(*)` }).from(downloads);
    const totalAdmins = await db.select({ count: sql<number>`count(*)` }).from(admins);
    
    // Daily counts
    const dailyVisits = await db.select({ count: sql<number>`count(*)` })
      .from(webAnalytics)
      .where(sql`${webAnalytics.visitedAt} >= ${startOfToday}`);
    
    const dailyDownloads = await db.select({ count: sql<number>`count(*)` })
      .from(downloads)
      .where(sql`${downloads.downloadedAt} >= ${startOfToday}`);

    // Monthly counts
    const monthlyVisits = await db.select({ count: sql<number>`count(*)` })
      .from(webAnalytics)
      .where(sql`${webAnalytics.visitedAt} >= ${startOfMonth}`);
    
    const monthlyDownloads = await db.select({ count: sql<number>`count(*)` })
      .from(downloads)
      .where(sql`${downloads.downloadedAt} >= ${startOfMonth}`);

    // Live users (active in last 5 mins)
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const liveUsers = await db.select({ count: sql<number>`count(distinct ${webAnalytics.ipAddress})` })
      .from(webAnalytics)
      .where(sql`${webAnalytics.visitedAt} >= ${fiveMinsAgo}`);

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

