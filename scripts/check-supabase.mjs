import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.");
}

const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
        headers.delete("Authorization");
      }
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    },
  },
});

const tables = [
  "announcement_bar",
  "profiles",
  "user_roles",
  "blog_posts",
  "products",
  "news_items",
  "exhibitions",
  "gallery_items",
  "site_content",
  "site_settings",
  "enquiries",
  "lead_activities",
  "auth_email_requests",
  "enquiry_rate_limits",
];

const checks = await Promise.all(
  tables.map(async (table) => {
    const { count, error } = await client.from(table).select("*", { count: "exact", head: true });
    return { table, accessible: !error, rows: count ?? 0, error: error?.message };
  }),
);

console.log(
  JSON.stringify({ connected: checks.every((item) => item.accessible), checks }, null, 2),
);
if (checks.some((item) => !item.accessible)) process.exitCode = 1;
