import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_EMAIL, hasDemoSession } from "@/lib/demo-admin";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (import.meta.env.DEV) {
      if (hasDemoSession()) {
        return {
          user: { id: "demo-admin", email: DEMO_EMAIL },
          role: "admin" as const,
          demo: true,
        };
      }
      throw redirect({ to: "/auth" });
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("active")
      .eq("id", data.user.id)
      .maybeSingle();
    const allowedRoles = ["admin", "editor", "sales_manager", "sales"] as const;
    const role = roles?.find((item) => allowedRoles.includes(item.role))?.role;
    if (roleError || profileError || profile?.active === false || !role) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    return { user: data.user, role, demo: false };
  },
  component: () => <Outlet />,
});
