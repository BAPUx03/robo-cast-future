import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  company: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

const BRAND = "#4DD091";
const CARBON = "#0d1417";
const SITE = "Modtech Machine";

function esc(v: string) {
  return v.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

async function enquiryFingerprint() {
  const request = getRequest();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address =
    request.headers.get("cf-connecting-ip")?.trim() ||
    forwardedFor ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 200) || "unknown";
  const input = new TextEncoder().encode(`${address}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function shell(inner: string, preview: string, logoUrl = "", siteUrl = "") {
  const logo = logoUrl
    ? `<img src="${esc(logoUrl)}" width="150" alt="Modtech Machine" style="display:block;max-width:150px;height:auto;margin:0 0 10px"/>`
    : "";
  const footerBrand = siteUrl
    ? `<a href="${esc(siteUrl)}" style="color:#43555a;text-decoration:none;font-weight:bold">${SITE}</a>`
    : `<strong>${SITE}</strong>`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f6f6;font-family:Arial,Helvetica,sans-serif;color:#111a1d">
<span style="display:none;opacity:0;color:transparent;height:0;overflow:hidden">${esc(preview)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f6;padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8e6">
  <tr><td style="background:${CARBON};padding:26px 30px">
    ${logo}
    <div style="font-size:22px;font-weight:bold;letter-spacing:1px;color:#ffffff">MOD<span style="color:${BRAND}">TECH</span></div>
    <div style="margin-top:6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${BRAND}">Machinery &middot; Robotics &middot; Casting</div>
  </td></tr>
  <tr><td style="padding:30px">${inner}</td></tr>
  <tr><td style="background:#f4f6f6;padding:18px 30px;font-size:11px;color:#7b8b8f;text-align:center">
    ${footerBrand} &middot; Engineered in India, deployed worldwide
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

function thankYouEmail(d: EnquiryInput, logoUrl: string, siteUrl: string) {
  return shell(
    `<h1 style="margin:0 0 14px;font-size:22px;color:#111a1d">Thank you, ${esc(d.name)}!</h1>
     <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#43555a">
       Thank you for reaching out to Modtech. We have received your enquiry and our engineering team will reply shortly.</p>
     <div style="border-left:3px solid ${BRAND};background:#f7fbf9;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.6;color:#43555a;white-space:pre-wrap">${esc(d.message)}</div>
     <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#43555a">
       Meanwhile, feel free to reply to this email with drawings, volumes or cycle-time targets.</p>
     <p style="margin:22px 0 0;font-size:14px;color:#111a1d"><strong>${SITE}</strong><br/>Engineering Team</p>`,
    `We received your enquiry — ${SITE} will be in touch.`,
    logoUrl,
    siteUrl,
  );
}

function leadEmail(d: EnquiryInput, logoUrl: string, siteUrl: string) {
  const row = (l: string, v: string) =>
    v
      ? `<tr><td style="padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#7b8b8f;width:110px">${l}</td><td style="padding:8px 0;font-size:14px;color:#111a1d">${esc(v)}</td></tr>`
      : "";
  return shell(
    `<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${BRAND}">New website lead</div>
     <h1 style="margin:8px 0 18px;font-size:22px;color:#111a1d">${esc(d.name)}${d.company ? ` &middot; ${esc(d.company)}` : ""}</h1>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8e6">
       ${row("Name", d.name)}${row("Company", d.company)}${row("Email", d.email)}${row("Phone", d.phone)}
     </table>
     <div style="margin-top:16px;border-left:3px solid ${BRAND};background:#f7fbf9;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.6;color:#43555a;white-space:pre-wrap">${esc(d.message)}</div>
     <p style="margin:20px 0 0"><a href="mailto:${esc(d.email)}" style="display:inline-block;background:${BRAND};color:#0d1417;text-decoration:none;font-weight:bold;font-size:13px;padding:12px 22px;border-radius:999px">Reply to ${esc(d.name)}</a></p>`,
    `New enquiry from ${d.name}`,
    logoUrl,
    siteUrl,
  );
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const fingerprintHash = await enquiryFingerprint();
    const { data: reserved, error: rateLimitError } = await supabaseAdmin.rpc(
      "reserve_enquiry_request",
      {
        _fingerprint_hash: fingerprintHash,
        _window_seconds: 3600,
        _maximum_requests: 5,
      },
    );
    if (rateLimitError) {
      console.error("enquiry rate limit failed", rateLimitError.message);
      throw new Error("Could not submit your enquiry. Please try again.");
    }
    if (!reserved) {
      throw new Error("Too many enquiries. Please wait before trying again.");
    }

    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabasePublic = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabasePublic.from("enquiries").insert({
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    });
    if (error) {
      console.error("enquiry insert failed", error.message);
      throw new Error("Could not save your enquiry. Please try again.");
    }

    const apiKey = process.env["BREVO_API_KEY"];
    if (!apiKey) return { ok: true, emailed: false as const };

    let adminEmail = "";
    let senderEmail = "";
    let senderName = SITE;
    let logoUrl = "";
    let siteUrl = "";
    try {
      const { data: rows } = await supabaseAdmin.from("site_settings").select("key, value");
      const map = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]));
      adminEmail = (map["admin_notify_email"] ?? "").trim();
      senderEmail = (map["sender_email"] ?? "").trim();
      senderName = (map["sender_name"] ?? "").trim() || SITE;
      logoUrl = (map["email_logo_url"] ?? "").trim();
      siteUrl = (map["site_url"] ?? "").trim().replace(/\/$/, "");
    } catch (e) {
      console.error("settings read failed", e);
    }

    const { getBrevoSender, sendBrevoEmail } = await import("@/lib/brevo.server");
    let sender: Awaited<ReturnType<typeof getBrevoSender>>;
    try {
      sender = await getBrevoSender(apiKey, senderName);
    } catch (senderError) {
      console.error("Brevo sender lookup failed", senderError);
      return { ok: true, emailed: false as const };
    }

    let customerSent = false;
    try {
      await sendBrevoEmail(apiKey, {
        sender,
        to: [{ email: data.email, name: data.name }],
        replyTo: senderEmail ? { email: senderEmail, name: senderName } : undefined,
        subject: `Thank you for contacting ${SITE}`,
        htmlContent: thankYouEmail(data, logoUrl, siteUrl),
      });
      customerSent = true;
    } catch (sendError) {
      console.error("Customer acknowledgement failed", sendError);
    }

    let adminSent = !adminEmail;
    if (adminEmail) {
      try {
        await sendBrevoEmail(apiKey, {
          sender,
          to: [{ email: adminEmail }],
          replyTo: { email: data.email, name: data.name },
          subject: `New enquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`,
          htmlContent: leadEmail(data, logoUrl, siteUrl),
        });
        adminSent = true;
      } catch (sendError) {
        console.error("Lead notification failed", sendError);
        adminSent = false;
      }
    }

    return { ok: true, emailed: customerSent && adminSent };
  });
