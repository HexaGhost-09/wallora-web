import { db } from "./index";
import { webAnalytics, downloads, systemLogs } from "./schema";

export async function trackVisit(path: string, ip?: string, ua?: string, ref?: string) {
  try {
    await db.insert(webAnalytics).values({
      pagePath: path,
      ipAddress: ip,
      userAgent: ua,
      referrer: ref,
    });
  } catch (error) {
    console.error("Failed to track visit:", error);
  }
}

export async function trackDownload(apkId: number, ip?: string, ua?: string) {
  try {
    await db.insert(downloads).values({
      apkId,
      ipAddress: ip,
      userAgent: ua,
    });
  } catch (error) {
    console.error("Failed to track download:", error);
  }
}

export async function logAdminAction(action: string, details: string, adminId?: number) {
  try {
    await db.insert(systemLogs).values({
      action,
      details,
      adminId,
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
