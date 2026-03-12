import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  hashedPassword: text("hashed_password").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  details: text("details"),
  adminId: integer("admin_id").references(() => admins.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apkVersions = pgTable("apk_versions", {
  id: serial("id").primaryKey(),
  versionName: text("version_name").notNull(),
  versionCode: text("version_code").notNull(),
  downloadUrl: text("download_url").notNull(),
  releaseNotes: text("release_notes"),
  isLatest: boolean("is_latest").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  apkId: integer("apk_id").references(() => apkVersions.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

export const webAnalytics = pgTable("web_analytics", {
  id: serial("id").primaryKey(),
  pagePath: text("page_path").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  visitedAt: timestamp("visited_at").defaultNow(),
});

export const testWallpapers = pgTable("test_wallpapers", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  download: text("download").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Main wallpapers table — migrated from Deno API
export const wallpapers = pgTable("wallpapers", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  image: text("image").notNull(),      // compressed/preview URL
  download: text("download").notNull(), // full-res URL
  timestamp: timestamp("timestamp").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  details: text("details"),
});
