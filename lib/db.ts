import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://haoken:haoken@localhost:5432/haoken",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}
