import { randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !publicKey || !serviceKey) throw new Error("Supabase environment is incomplete.");

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
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: apiFetch(key) },
  });
}

const admin = client(serviceKey);
const marker = randomUUID().slice(0, 8);
const email = `modtech-auth-${marker}@example.com`;
const initialPassword = `Start!${randomBytes(18).toString("base64url")}7a`;
const updatedPassword = `Reset!${randomBytes(18).toString("base64url")}8b`;
const createdUserIds = [];
const result = {
  created: false,
  roleAssigned: false,
  passwordSignIn: false,
  emailOtpVerified: false,
  recoveryOtpVerified: false,
  passwordUpdated: false,
  updatedPasswordSignIn: false,
  inactiveFlagReadable: false,
};

async function createTestUser(address, password = undefined) {
  const { data, error } = await admin.auth.admin.createUser({
    email: address,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Modtech Auth Test" },
  });
  if (error || !data.user) throw error ?? new Error("Could not create test user.");
  createdUserIds.push(data.user.id);
  return data.user;
}

try {
  const user = await createTestUser(email, initialPassword);
  result.created = true;

  const { error: roleError } = await admin
    .from("user_roles")
    .insert({ user_id: user.id, role: "sales" });
  if (roleError) throw roleError;
  result.roleAssigned = true;

  const passwordClient = client(publicKey);
  const { error: initialSignInError } = await passwordClient.auth.signInWithPassword({
    email,
    password: initialPassword,
  });
  if (initialSignInError) throw initialSignInError;
  result.passwordSignIn = true;
  await passwordClient.auth.signOut();

  const { data: magicLink, error: magicLinkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (magicLinkError || !magicLink.properties.email_otp) {
    throw magicLinkError ?? new Error("Email OTP was not generated.");
  }
  const otpClient = client(publicKey);
  const { error: otpError } = await otpClient.auth.verifyOtp({
    email,
    token: magicLink.properties.email_otp,
    type: "email",
  });
  if (otpError) throw otpError;
  result.emailOtpVerified = true;
  await otpClient.auth.signOut();

  const { data: recoveryLink, error: recoveryLinkError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  if (recoveryLinkError || !recoveryLink.properties.email_otp) {
    throw recoveryLinkError ?? new Error("Recovery OTP was not generated.");
  }
  const recoveryClient = client(publicKey);
  const { error: recoveryError } = await recoveryClient.auth.verifyOtp({
    email,
    token: recoveryLink.properties.email_otp,
    type: "recovery",
  });
  if (recoveryError) throw recoveryError;
  result.recoveryOtpVerified = true;

  const { error: updateError } = await recoveryClient.auth.updateUser({
    password: updatedPassword,
  });
  if (updateError) throw updateError;
  result.passwordUpdated = true;
  await recoveryClient.auth.signOut({ scope: "local" });

  const updatedPasswordClient = client(publicKey);
  const { error: updatedSignInError } = await updatedPasswordClient.auth.signInWithPassword({
    email,
    password: updatedPassword,
  });
  if (updatedSignInError) throw updatedSignInError;
  result.updatedPasswordSignIn = true;
  const { data: profile, error: profileError } = await updatedPasswordClient
    .from("profiles")
    .select("active")
    .eq("id", user.id)
    .single();
  if (profileError) throw profileError;
  result.inactiveFlagReadable = profile.active === true;
  await updatedPasswordClient.auth.signOut();

  result.passed = Object.entries(result)
    .filter(([key]) => key !== "passed")
    .every(([, value]) => value === true);
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ ...result, passed: false, error: error.message }, null, 2));
  process.exitCode = 1;
} finally {
  if (createdUserIds.length) {
    await admin.from("user_roles").delete().in("user_id", createdUserIds);
    await admin.from("profiles").delete().in("id", createdUserIds);
    for (const userId of createdUserIds) await admin.auth.admin.deleteUser(userId);
  }
}
