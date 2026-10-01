import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing.");

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1,
  connect_timeout: 15,
});

try {
  const [counts] = await sql`
    select
      (select count(*)::int from public.profiles p
       where not exists (select 1 from auth.users u where u.id = p.id)) as orphan_profiles,
      (select count(*)::int from public.user_roles r
       where not exists (select 1 from public.profiles p where p.id = r.user_id)) as orphan_roles,
      (select count(*)::int from public.profiles p
       where not exists (select 1 from public.user_roles r where r.user_id = p.id)) as profiles_without_roles,
      (select count(*)::int from public.profiles p
       join public.user_roles r on r.user_id = p.id
       where p.active and r.role::text = 'admin') as active_admins
  `;
  const constraints = await sql`
    select conname
    from pg_constraint
    where conname in ('profiles_auth_user_fkey', 'user_roles_profile_fkey')
    order by conname
  `;
  const result = {
    ...counts,
    constraints: constraints.map((item) => item.conname),
    hasActiveAdmin: counts.active_admins >= 1,
    passed:
      counts.orphan_profiles === 0 &&
      counts.orphan_roles === 0 &&
      counts.profiles_without_roles === 0 &&
      constraints.length === 2,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
} finally {
  await sql.end();
}
