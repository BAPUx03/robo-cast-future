import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing.");
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1,
  connect_timeout: 15,
});

const expectedTables = [
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

try {
  const tables = await sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name = any(${expectedTables})
    order by table_name
  `;
  const roles = await sql`
    select enumlabel
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'app_role'
    order by e.enumsortorder
  `;
  const rls = await sql`
    select tablename, rowsecurity
    from pg_tables
    where schemaname = 'public'
      and tablename = any(${expectedTables})
    order by tablename
  `;
  const [{ policy_count: policyCount }] = await sql`
    select count(*)::int as policy_count
    from pg_policies
    where schemaname = 'public'
  `;

  const tableNames = tables.map((row) => row.table_name);
  const missingTables = expectedTables.filter((table) => !tableNames.includes(table));
  const rlsEnabled = rls.filter((row) => row.rowsecurity).length;
  const passed = missingTables.length === 0 && rlsEnabled === expectedTables.length;

  console.log(
    JSON.stringify(
      {
        connected: true,
        passed,
        tables: tableNames,
        missingTables,
        roles: roles.map((row) => row.enumlabel),
        rlsEnabled,
        expectedTables: expectedTables.length,
        policyCount,
      },
      null,
      2,
    ),
  );
  if (!passed) process.exitCode = 1;
} catch (error) {
  console.error(
    JSON.stringify({
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }),
  );
  process.exitCode = 1;
} finally {
  await sql.end();
}
