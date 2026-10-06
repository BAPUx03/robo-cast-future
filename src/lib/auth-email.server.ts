type AuthEmailFlow = "sign_in" | "invite" | "recovery";

import { getBrevoSender, sendBrevoEmail } from "@/lib/brevo.server";

const BRAND = "#4DD091";
const RESEND_SECONDS = 60;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
}

function emailShell(kicker: string, heading: string, content: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f6f6;font-family:Arial,Helvetica,sans-serif;color:#111a1d"><span style="display:none;opacity:0;color:transparent;height:0;overflow:hidden">${escapeHtml(heading)}</span><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f6;padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid #e2e8e6;border-radius:16px;overflow:hidden"><tr><td style="background:#0d1417;padding:26px 30px"><div style="font-size:22px;font-weight:bold;letter-spacing:1px;color:#fff">MOD<span style="color:${BRAND}">TECH</span></div><div style="margin-top:6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${BRAND}">Machine &middot; Secure team access</div></td></tr><tr><td style="padding:32px 30px"><div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#3ab77c">${escapeHtml(kicker)}</div><h1 style="margin:8px 0 12px;font-size:22px;color:#111a1d">${escapeHtml(heading)}</h1>${content}</td></tr><tr><td style="background:#f4f6f6;padding:18px 30px;text-align:center;font-size:11px;color:#7b8b8f">Modtech Machine &middot; Secure team access</td></tr></table></td></tr></table></body></html>`;
}

function authEmail(flow: AuthEmailFlow, token: string, fullName = "") {
  const safeName = escapeHtml(fullName || "there");
  const code = `<div style="margin:24px 0;padding:18px;border:1px solid #bcebd6;background:#f3fbf7;border-radius:12px;text-align:center;font-size:30px;font-weight:bold;letter-spacing:8px;color:#0d1417">${escapeHtml(token)}</div>`;
  const safety = `<p style="margin:0;font-size:12px;line-height:1.7;color:#7b8b8f">This code expires in 60 minutes and can be used only once. Never share it. If you did not request this email, you can safely ignore it.</p>`;

  if (flow === "recovery") {
    return {
      subject: "Reset your Modtech password",
      htmlContent: emailShell(
        "Account recovery",
        "Reset your password",
        `<p style="margin:0;font-size:14px;line-height:1.7;color:#43555a">Enter this one-time code in the Modtech control centre, then choose a new password.</p>${code}${safety}`,
      ),
    };
  }

  if (flow === "invite") {
    return {
      subject: "Welcome to the Modtech team",
      htmlContent: emailShell(
        "Team invitation",
        `Welcome, ${safeName}`,
        `<p style="margin:0;font-size:14px;line-height:1.7;color:#43555a">Your Modtech control centre account is ready. Enter this one-time code on the sign-in page to access your assigned workspace.</p>${code}${safety}`,
      ),
    };
  }

  return {
    subject: "Your Modtech secure sign-in code",
    htmlContent: emailShell(
      "Secure sign-in",
      "Your verification code",
      `<p style="margin:0;font-size:14px;line-height:1.7;color:#43555a">Enter this one-time code in the Modtech control centre to sign in.</p>${code}${safety}`,
    ),
  };
}

async function emailHash(email: string) {
  const bytes = new TextEncoder().encode(email.toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function sendAuthEmailForExistingUser(
  email: string,
  flow: AuthEmailFlow,
  fullName = "",
) {
  const apiKey = process.env["BREVO_API_KEY"];
  if (!apiKey) throw new Error("Authentication email service is not configured.");

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalizedEmail = email.trim().toLowerCase();
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, active, full_name")
    .ilike("email", normalizedEmail)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile?.active) return { sent: false as const, reason: "unavailable" as const };

  const { data: reserved, error: reserveError } = await supabaseAdmin.rpc(
    "reserve_auth_email_request",
    {
      _email_hash: await emailHash(normalizedEmail),
      _flow: flow,
      _minimum_interval_seconds: RESEND_SECONDS,
    },
  );
  if (reserveError) throw reserveError;
  if (!reserved) return { sent: false as const, reason: "rate_limit" as const };

  const linkType = flow === "recovery" ? "recovery" : "magiclink";
  const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: linkType,
    email: normalizedEmail,
  });
  if (linkError || !link.properties.email_otp) {
    throw linkError ?? new Error("Could not generate the authentication code.");
  }

  const content = authEmail(flow, link.properties.email_otp, fullName || profile.full_name || "");
  const sender = await getBrevoSender(apiKey);
  const responseBody = await sendBrevoEmail(apiKey, {
    sender,
    replyTo: { email: "info@modtechworld.com", name: "Modtech Machine" },
    to: [{ email: normalizedEmail, name: fullName || profile.full_name || normalizedEmail }],
    tags: [`modtech-auth-${flow}`],
    ...content,
  });

  return { sent: true as const, messageId: responseBody.messageId as string | undefined };
}
