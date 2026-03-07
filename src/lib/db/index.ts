import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let sql: NeonQueryFunction<boolean, boolean> | null = null;
let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

export const getDb = (): NeonHttpDatabase<typeof schema> => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    if (process.env.NODE_ENV === "production") {
      console.warn("⚠️ DATABASE_URL is missing in production environment.");
    }
    // Return a dummy instance at build time, DO NOT cache it
    return drizzle(neon(""), { schema });
  }

  // Only use cache if we have a real databaseUrl
  if (dbInstance) return dbInstance;

  sql = neon(databaseUrl);
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
};

// Export a proxy as 'db' to avoid changing imports in other files
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
