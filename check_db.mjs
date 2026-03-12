import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function checkAllTables() {
  console.log("🔌 Connecting to Neon database...\n");

  try {
    // 1. List all tables in the database
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log("📋 Tables found in DB:");
    tables.forEach((t) => console.log("  -", t.table_name));
    console.log();

    // 2. Check wallpapers table
    console.log("🖼️ === wallpapers table ===");
    const wallpaperCount = await sql`SELECT COUNT(*) FROM wallpapers;`;
    console.log("  Total rows:", wallpaperCount[0].count);

    const wallpapers = await sql`SELECT * FROM wallpapers LIMIT 5;`;
    if (wallpapers.length > 0) {
      console.log("  Sample rows:");
      wallpapers.forEach((w) =>
        console.log(
          `    [${w.id}] ${w.category} | ${w.title} | image: ${w.image?.slice(0, 60)}... | download: ${w.download?.slice(0, 60)}...`
        )
      );
    } else {
      console.log("  ⚠️ No rows found in wallpapers table.");
    }
    console.log();

    // 3. Check test_wallpapers table
    console.log("🧪 === test_wallpapers table ===");
    const testCount = await sql`SELECT COUNT(*) FROM test_wallpapers;`;
    console.log("  Total rows:", testCount[0].count);

    const testWallpapers = await sql`SELECT * FROM test_wallpapers LIMIT 5;`;
    if (testWallpapers.length > 0) {
      console.log("  Sample rows:");
      testWallpapers.forEach((w) =>
        console.log(
          `    [${w.id}] ${w.category} | ${w.title} | image: ${w.image?.slice(0, 60)}... | download: ${w.download?.slice(0, 60)}...`
        )
      );
    } else {
      console.log("  ⚠️ No rows found in test_wallpapers table.");
    }
    console.log();

    // 4. Check categories table
    console.log("📁 === categories table ===");
    const catCount = await sql`SELECT COUNT(*) FROM categories;`;
    console.log("  Total rows:", catCount[0].count);

    const categories = await sql`SELECT * FROM categories LIMIT 5;`;
    if (categories.length > 0) {
      console.log("  Sample rows:");
      categories.forEach((c) =>
        console.log(`    [${c.id}] ${c.title} | thumbnail: ${c.thumbnail?.slice(0, 60)}...`)
      );
    } else {
      console.log("  ⚠️ No rows found in categories table.");
    }
    console.log();

    // 5. Check APK versions
    console.log("📦 === apk_versions table ===");
    const apkCount = await sql`SELECT COUNT(*) FROM apk_versions;`;
    console.log("  Total rows:", apkCount[0].count);

    const apks = await sql`SELECT * FROM apk_versions LIMIT 5;`;
    if (apks.length > 0) {
      console.log("  Sample rows:");
      apks.forEach((a) =>
        console.log(
          `    [${a.id}] v${a.version_name} (${a.version_code}) | latest: ${a.is_latest} | url: ${a.download_url?.slice(0, 60)}...`
        )
      );
    } else {
      console.log("  ⚠️ No rows found in apk_versions table.");
    }
    console.log();

    console.log("✅ Done checking all tables!");
  } catch (err) {
    console.error("❌ Error connecting to database:", err.message);
    console.error(err);
  }
}

checkAllTables();
