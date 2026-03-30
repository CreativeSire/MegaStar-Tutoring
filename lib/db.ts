import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema";

let database: ReturnType<typeof createDatabase> | null = null;

function createDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL is required in production.");
    }
    return null;
  }

  return drizzle(neon(connectionString), { schema });
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase() {
  if (!database) {
    database = createDatabase();
  }
  return database;
}
