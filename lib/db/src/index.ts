import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

import path from "path";
import dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
}

const Pool = pg.Pool || (pg as any).default?.Pool;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[WARNING] DATABASE_URL is not set. Database calls will fail until DATABASE_URL environment variable is provided."
  );
}

const isLocalhost =
  connectionString?.includes("localhost") ||
  connectionString?.includes("127.0.0.1");

export const pool = new Pool({
  connectionString: connectionString || "postgres://localhost:5432/placeholder",
  ssl: connectionString && !isLocalhost ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
