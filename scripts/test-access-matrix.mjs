import { randomUUID } from "node:crypto";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing.");

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

const users = {
  admin: randomUUID(),
  editor: randomUUID(),
  manager: randomUUID(),
  salesOne: randomUUID(),
  salesTwo: randomUUID(),
};

let results;
try {
  await sql.begin(async (tx) => {
    for (const [name, id] of Object.entries(users)) {
      await tx`insert into public.profiles (id, email, full_name)
        values (${id}, ${`${name}@access-test.invalid`}, ${name})`;
    }

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
  await sql.end();
}
