import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

if (
  !process.env.DATABASE_URL ||
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
)
  throw new Error("Database or Supabase environment is incomplete.");

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1,
  connect_timeout: 15,
});

class RollbackWithResults extends Error {
  constructor(results) {
    super("ROLLBACK_TEST");
    this.results = results;
  }
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(process.env.SUPABASE_URL, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (serviceKey.startsWith("sb_") && headers.get("Authorization") === `Bearer ${serviceKey}`) {
        headers.delete("Authorization");
      }
      headers.set("apikey", serviceKey);
      return fetch(input, { ...init, headers });
    },
  },
});

const users = {};
const createdUserIds = [];

async function createTestUser(name) {
  const marker = randomUUID().slice(0, 8);
  const { data, error } = await admin.auth.admin.createUser({
    email: `${name}-${marker}@access-test.invalid`,
    email_confirm: true,
    user_metadata: { full_name: name },
  });
  if (error || !data.user) throw error ?? new Error(`Could not create ${name} test user.`);
  createdUserIds.push(data.user.id);
  users[name] = data.user.id;
}

let results;
try {
  for (const name of ["admin", "editor", "manager", "salesOne", "salesTwo"]) {
    await createTestUser(name);
  }
  await sql.begin(async (tx) => {
    await tx`insert into public.user_roles (user_id, role) values
      (${users.admin}, 'admin'),
      (${users.editor}, 'editor'),
      (${users.manager}, 'sales_manager'),
      (${users.salesOne}, 'sales'),
      (${users.salesTwo}, 'sales')`;

    await tx`insert into public.enquiries (name, email, message, assigned_to) values
      ('Lead One', 'lead-one@example.invalid', 'RLS test', ${users.salesOne}),
      ('Lead Two', 'lead-two@example.invalid', 'RLS test', ${users.salesTwo})`;

    await tx`insert into public.blog_posts (slug, title, published)
      values (${`rls-draft-${randomUUID()}`}, 'RLS Draft', false)`;

    async function countAs(userId, table, condition = "true") {
      await tx`select set_config('request.jwt.claim.sub', ${userId}, true)`;
      await tx.unsafe("set local role authenticated");
      const [row] = await tx.unsafe(
        `select count(*)::int as count from public.${table} where ${condition}`,
      );
      await tx.unsafe("reset role");
      return row.count;
    }

    results = {
      adminLeadCount: await countAs(users.admin, "enquiries"),
      managerLeadCount: await countAs(users.manager, "enquiries"),
      salesOneLeadCount: await countAs(users.salesOne, "enquiries"),
      salesTwoLeadCount: await countAs(users.salesTwo, "enquiries"),
      editorLeadCount: await countAs(users.editor, "enquiries"),
      adminDraftCount: await countAs(users.admin, "blog_posts", "published = false"),
      editorDraftCount: await countAs(users.editor, "blog_posts", "published = false"),
      salesDraftCount: await countAs(users.salesOne, "blog_posts", "published = false"),
    };

    const passed =
      results.adminLeadCount === 2 &&
      results.managerLeadCount === 2 &&
      results.salesOneLeadCount === 1 &&
      results.salesTwoLeadCount === 1 &&
      results.editorLeadCount === 0 &&
      results.adminDraftCount === 1 &&
      results.editorDraftCount === 1 &&
      results.salesDraftCount === 0;

    results.passed = passed;
    throw new RollbackWithResults(results);
  });
} catch (error) {
  if (error instanceof RollbackWithResults) {
    console.log(JSON.stringify(error.results, null, 2));
    if (!error.results.passed) process.exitCode = 1;
  } else {
    console.error(JSON.stringify({ passed: false, error: error.message }));
    process.exitCode = 1;
  }
} finally {
  for (const userId of createdUserIds) await admin.auth.admin.deleteUser(userId);
  await sql.end();
}
