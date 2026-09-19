import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_EMAIL, hasDemoSession } from "@/lib/demo-admin";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (import.meta.env.DEV) {
      if (hasDemoSession()) {
        return { user: { email: DEMO_EMAIL }, role: "admin" as const, demo: true };
      }
      throw redirect({ to: "/auth" });
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const role = roles?.find((item) => item.role === "admin" || item.role === "editor")?.role;
    if (roleError || !role) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    return { user: data.user, role, demo: false };
  },
  component: () => <Outlet />,
});
