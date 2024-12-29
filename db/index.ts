import { drizzle } from "drizzle-orm/node-postgres";
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw "DATABASE_URL env var not configured";
}

const db = drizzle(dbUrl);

export default db;
