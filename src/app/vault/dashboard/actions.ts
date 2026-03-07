"use server";

import { db } from "@/lib/db";
import { webAnalytics, downloads, admins, systemLogs } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    const visitCount = await db.select({ count: sql<number>`count(*)` }).from(webAnalytics);
    const downloadCount = await db.select({ count: sql<number>`count(*)` }).from(downloads);
    const adminCount = await db.select({ count: sql<number>`count(*)` }).from(admins);
    
    const recentLogs = await db.select()
      .from(systemLogs)
      .orderBy(desc(systemLogs.createdAt))
      .limit(5);

    return {
      visits: Number(visitCount[0].count) || 0,
      downloads: Number(downloadCount[0].count) || 0,
      admins: Number(adminCount[0].count) || 0,
      recentLogs: recentLogs.map(log => ({
        ...log,
        createdAt: log.createdAt?.toISOString() || new Date().toISOString()
      }))
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      visits: 0,
      downloads: 0,
      admins: 0,
      recentLogs: []
    };
  }
}
