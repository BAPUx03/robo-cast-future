import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing.");

const migration = process.argv[2];
if (!migration || !/^\d{4}_[a-z0-9_]+\.sql$/.test(migration)) {
  throw new Error("Usage: npm run db:migrate:file -- 0005_enquiry_rate_limit.sql");
}

const migrationsDirectory = resolve("drizzle", "migrations");
const migrationPath = resolve(migrationsDirectory, migration);
if (dirname(migrationPath) !== migrationsDirectory) {
  throw new Error("Migration path must stay inside drizzle/migrations.");
}

const source = await readFile(migrationPath, "utf8");
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });

try {
  await sql.begin(async (transaction) => {
    await transaction.unsafe(source);
  });
  console.log(`Applied ${migration}.`);
} finally {
  await sql.end();
}
