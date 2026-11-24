import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let sql: NeonQueryFunction<boolean, boolean> | null = null;
let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

export const getDb = (): NeonHttpDatabase<typeof schema> => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // Next.js may evaluate modules during the production build before runtime
    // environment variables are injected. Never allow a missing URL at runtime.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return drizzle(neon(""), { schema });
    }

    throw new Error(
      "DATABASE_URL is missing. Add your Neon production connection string to the deployment environment."
    );
  }

  if (dbInstance) return dbInstance;

  sql = neon(databaseUrl);
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
};

// Keep existing imports working while initializing the connection lazily.
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
