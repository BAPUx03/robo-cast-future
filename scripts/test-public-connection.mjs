const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Supabase URL and publishable key are required for this read-only test.");
}

const tables = [
  "announcement_bar",
  "blog_posts",
  "career_vacancies",
  "exhibitions",
  "news_items",
  "products",
  "site_content",
  "site_settings",
];

const checks = await Promise.all(
  tables.map(async (table) => {
    try {
      const response = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
        headers: { apikey: key },
        signal: AbortSignal.timeout(10_000),
      });
      return { table, status: response.status, accessible: response.ok };
    } catch (error) {
      return {
        table,
        accessible: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }),
);

const connected = checks.every((check) => check.accessible);
console.log(JSON.stringify({ connected, checks }, null, 2));
if (!connected) process.exitCode = 1;
