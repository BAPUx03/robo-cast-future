import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !publicKey || !secretKey) throw new Error("Supabase environment is incomplete.");

function makeClient(key) {
  return createClient(url, key, {
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
}

const publicClient = makeClient(publicKey);
const adminClient = makeClient(secretKey);
const marker = `PUBLIC-LEAD-TEST-${randomUUID()}`;
let leadId;

try {
  const { error: insertError } = await publicClient.from("enquiries").insert({
    name: "Public Lead Test",
    email: "public-lead-test@example.com",
    message: marker,
  });
  if (insertError) throw insertError;

  const { data: lead, error: readError } = await adminClient
    .from("enquiries")
    .select("id, status, priority, assigned_to")
    .eq("message", marker)
    .single();
  if (readError) throw readError;
  leadId = lead.id;

  const passed = lead.status === "new" && lead.priority === "normal" && lead.assigned_to === null;
  console.log(JSON.stringify({ passed, savedInAdminPipeline: true, defaults: lead }, null, 2));
  if (!passed) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ passed: false, error: error.message }));
  process.exitCode = 1;
} finally {
  if (leadId) await adminClient.from("enquiries").delete().eq("id", leadId);
}
