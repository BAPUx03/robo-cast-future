import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase environment is incomplete.");

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

const fingerprint = randomUUID().replaceAll("-", "");

try {
  const reservations = [];
  for (let index = 0; index < 6; index += 1) {
    const { data, error } = await client.rpc("reserve_enquiry_request", {
      _fingerprint_hash: fingerprint,
      _window_seconds: 3600,
      _maximum_requests: 5,
    });
    if (error) throw error;
    reservations.push(data);
  }

  const passed = reservations.slice(0, 5).every(Boolean) && reservations[5] === false;
  console.log(JSON.stringify({ passed, reservations }, null, 2));
  if (!passed) process.exitCode = 1;
} finally {
  await client.from("enquiry_rate_limits").delete().eq("fingerprint_hash", fingerprint);
}
