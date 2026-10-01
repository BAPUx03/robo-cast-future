import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const teamRoleSchema = z.enum(["admin", "editor", "sales_manager", "sales"]);

const inviteSchema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().min(2).max(100),
  role: teamRoleSchema,
});

const assignmentSchema = z.object({
  enquiryId: z.string().uuid(),
  assignedTo: z.string().uuid().nullable(),
});

const updateMemberSchema = z.object({
  userId: z.string().uuid(),
  role: teamRoleSchema,
  active: z.boolean(),
});

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
}

async function requesterRole(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw error;
  return data?.map((item) => item.role) ?? [];
}

export const inviteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inviteSchema.parse(input))
  .handler(async ({ data, context }) => {
    const roles = await requesterRole(context.userId);
    const isAdmin = roles.includes("admin");
    const isSalesManager = roles.includes("sales_manager");
    if (!isAdmin && !(isSalesManager && data.role === "sales")) {
      throw new Error("You do not have permission to add this role.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (createError || !created.user) {
      throw new Error(createError?.message ?? "Could not create team member.");
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: created.user.id,
      email: data.email,
      full_name: data.fullName,
      active: true,
    });
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw profileError;
    }

    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: created.user.id,
      role: data.role,
    });
    if (roleError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw roleError;
    }

    let otpError: unknown;
    try {
      const { sendAuthEmailForExistingUser } = await import("@/lib/auth-email.server");
      const delivery = await sendAuthEmailForExistingUser(data.email, "invite", data.fullName);
      if (!delivery.sent) otpError = new Error("Invitation email was rate limited.");
    } catch (error) {
      otpError = error;
    }

    return {
      ok: true,
      userId: created.user.id,
      otpSent: !otpError,
      warning: otpError ? "Account created, but the invitation email could not be sent." : null,
    };
  });

export const assignLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assignmentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const roles = await requesterRole(context.userId);
    if (!roles.includes("admin") && !roles.includes("sales_manager")) {
      throw new Error("Only an admin or sales manager can assign leads.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.assignedTo) {
      const [{ data: assignee }, { data: assigneeRoles }] = await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("id, email, full_name, active")
          .eq("id", data.assignedTo)
          .single(),
        supabaseAdmin.from("user_roles").select("role").eq("user_id", data.assignedTo),
      ]);
      if (!assignee?.active || !assigneeRoles?.some((item) => item.role === "sales")) {
        throw new Error("Select an active sales executive.");
      }
    }

    const { data: lead, error } = await supabaseAdmin
      .from("enquiries")
      .update({ assigned_to: data.assignedTo })
      .eq("id", data.enquiryId)
      .select("id, name, company, email")
      .single();
    if (error) throw error;

    await supabaseAdmin.from("lead_activities").insert({
      enquiry_id: data.enquiryId,
      actor_id: context.userId,
      action: data.assignedTo ? "assigned" : "unassigned",
      details: { assigned_to: data.assignedTo },
    });

    let notified = false;
    if (data.assignedTo && process.env["BREVO_API_KEY"]) {
      const [{ data: assignee }, { data: settings }] = await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("email, full_name")
          .eq("id", data.assignedTo)
          .single(),
        supabaseAdmin.from("site_settings").select("key, value"),
      ]);
      const config = Object.fromEntries((settings ?? []).map((item) => [item.key, item.value]));
      if (assignee?.email) {
        const siteUrl = (config["site_url"] || "").replace(/\/$/, "");
        const controlCentreUrl = siteUrl ? `${siteUrl}/admin?section=enquiries` : "";
        const logo = config["email_logo_url"]
          ? `<img src="${escapeHtml(config["email_logo_url"])}" width="145" alt="Modtech Machinery" style="display:block;max-width:145px;height:auto;margin-bottom:10px"/>`
          : "";
        const leadName = escapeHtml(lead.name);
        const leadCompany = escapeHtml(lead.company ?? "");
        const leadEmail = escapeHtml(lead.email);
        const { getBrevoSender, sendBrevoEmail } = await import("@/lib/brevo.server");
        try {
          const senderName = config["sender_name"] || "Modtech Machinery";
          const sender = await getBrevoSender(process.env["BREVO_API_KEY"]!, senderName);
          await sendBrevoEmail(process.env["BREVO_API_KEY"]!, {
            sender,
            replyTo: config["sender_email"]
              ? { email: config["sender_email"], name: senderName }
              : undefined,
            to: [{ email: assignee.email, name: assignee.full_name || assignee.email }],
            subject: `Lead assigned: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
            htmlContent: `<!doctype html><html><body style="margin:0;background:#f4f6f6;font-family:Arial,sans-serif;color:#111a1d"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" style="max-width:600px;background:#fff;border:1px solid #e2e8e6;border-radius:16px;overflow:hidden"><tr><td style="background:#0d1417;padding:26px 30px">${logo}<div style="font-size:22px;font-weight:bold;color:#fff">MOD<span style="color:#4DD091">TECH</span></div></td></tr><tr><td style="padding:30px"><div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#3ab77c">New lead assigned</div><h1 style="font-size:22px;margin:8px 0 18px">${leadName}</h1><p style="line-height:1.7;color:#43555a">${leadCompany ? `${leadCompany}<br/>` : ""}${leadEmail}</p><p style="line-height:1.7;color:#43555a">Review the enquiry, contact the client and record the next follow-up in the Modtech control centre.</p>${controlCentreUrl ? `<a href="${escapeHtml(controlCentreUrl)}" style="display:inline-block;margin-top:8px;background:#4DD091;color:#0d1417;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">Open assigned lead</a>` : ""}</td></tr></table></td></tr></table></body></html>`,
          });
          notified = true;
        } catch (notificationError) {
          console.error("Lead assignment notification failed", notificationError);
        }
      }
    }

    return { ok: true, notified };
  });

export const updateTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateMemberSchema.parse(input))
  .handler(async ({ data, context }) => {
    const roles = await requesterRole(context.userId);
    const isAdmin = roles.includes("admin");
    const isSalesManager = roles.includes("sales_manager");
    if (!isAdmin && !(isSalesManager && data.role === "sales")) {
      throw new Error("You do not have permission to manage this member.");
    }
    if (data.userId === context.userId && !data.active) {
      throw new Error("You cannot deactivate your own account.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: currentRoles, error: currentRoleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.userId);
    if (currentRoleError) throw currentRoleError;

    const targetIsAdmin = currentRoles?.some((item) => item.role === "admin") ?? false;
    if (data.userId === context.userId && targetIsAdmin && data.role !== "admin") {
      throw new Error("You cannot remove your own administrator role.");
    }
    if (targetIsAdmin && (data.role !== "admin" || !data.active)) {
      const { data: adminRoles, error: adminRolesError } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (adminRolesError) throw adminRolesError;
      const adminIds = (adminRoles ?? []).map((item) => item.user_id);
      const { data: activeAdmins, error: activeAdminError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .in("id", adminIds)
        .eq("active", true);
      if (activeAdminError) throw activeAdminError;
      const targetIsActiveAdmin = activeAdmins?.some((profile) => profile.id === data.userId);
      if (targetIsActiveAdmin && activeAdmins.length <= 1) {
        throw new Error("At least one active administrator is required.");
      }
    }

    if (!isAdmin && !currentRoles?.some((item) => item.role === "sales")) {
      throw new Error("Sales managers can only manage sales executives.");
    }

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
    if (insertError) throw insertError;

    const { error: deleteError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .neq("role", data.role);
    if (deleteError) throw deleteError;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ active: data.active })
      .eq("id", data.userId);
    if (profileError) throw profileError;

    return { ok: true };
  });
