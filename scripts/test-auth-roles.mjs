import { randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !publicKey || !secretKey) throw new Error("Supabase environment is incomplete.");

function apiFetch(key) {
  return (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

function client(key) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: apiFetch(key) },
  });
}

const adminClient = client(secretKey);
const password = `Mtw!${randomBytes(18).toString("base64url")}9a`;
const marker = randomUUID();
const actors = ["admin", "editor", "sales_manager", "sales"];
const users = [];
let draftId;
const leadIds = [];

try {
  for (const role of actors) {
    const email = `access-${role}-${marker}@example.com`;
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: `Access Test ${role}` },
    });
    if (error || !data.user) throw error ?? new Error(`Could not create ${role} user.`);
    users.push({ id: data.user.id, email, role });
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: `Access Test ${role}`,
      active: true,
    });
    if (profileError) throw profileError;
    const { error: roleError } = await adminClient
      .from("user_roles")
      .insert({ user_id: data.user.id, role });
    if (roleError) throw roleError;
  }

  const salesUser = users.find((item) => item.role === "sales");
  const { data: leads, error: leadError } = await adminClient
    .from("enquiries")
    .insert([
      {
        name: "Assigned access test",
        email: "assigned@example.com",
        message: "Temporary access test",
        assigned_to: salesUser.id,
      },
      {
        name: "Unassigned access test",
        email: "unassigned@example.com",
        message: "Temporary access test",
      },
    ])
    .select("id");
  if (leadError) throw leadError;
  leadIds.push(...leads.map((row) => row.id));

  const { data: draft, error: draftError } = await adminClient
    .from("blog_posts")
    .insert({ slug: `auth-role-test-${marker}`, title: "Temporary access draft", published: false })
    .select("id")
    .single();
  if (draftError) throw draftError;
  draftId = draft.id;

  const results = {};
  for (const actor of users) {
    const actorClient = client(publicKey);
    const { error: signInError } = await actorClient.auth.signInWithPassword({
      email: actor.email,
      password,
    });
    if (signInError) throw signInError;

    const [{ data: visibleLeads, error: leadsError }, { data: drafts, error: draftsError }] =
      await Promise.all([
        actorClient.from("enquiries").select("id").in("id", leadIds),
        actorClient.from("blog_posts").select("id").eq("id", draftId),
      ]);
    if (leadsError || draftsError) throw leadsError ?? draftsError;
    results[actor.role] = {
      leads: visibleLeads.length,
      drafts: drafts.length,
    };
    await actorClient.auth.signOut();
  }

  const passed =
    results.admin.leads === 2 &&
    results.admin.drafts === 1 &&
    results.editor.leads === 0 &&
    results.editor.drafts === 1 &&
    results.sales_manager.leads === 2 &&
    results.sales_manager.drafts === 0 &&
    results.sales.leads === 1 &&
    results.sales.drafts === 0;

  console.log(JSON.stringify({ passed, results }, null, 2));
  if (!passed) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ passed: false, error: error.message }));
  process.exitCode = 1;
} finally {
  if (leadIds.length) await adminClient.from("enquiries").delete().in("id", leadIds);
  if (draftId) await adminClient.from("blog_posts").delete().eq("id", draftId);
  if (users.length) {
    const ids = users.map((item) => item.id);
    await adminClient.from("user_roles").delete().in("user_id", ids);
    await adminClient.from("profiles").delete().in("id", ids);
    for (const user of users) await adminClient.auth.admin.deleteUser(user.id);
  }
}
