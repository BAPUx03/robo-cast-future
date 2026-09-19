import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/brand-logo";
import { DEMO_EMAIL, DEMO_PASSWORD, hasDemoSession, startDemoSession } from "@/lib/demo-admin";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team Sign In — Modtech Machinery" },
      {
        name: "description",
        content: "Sign in to the Modtech Machinery content administration area.",
      },
      { property: "og:title", content: "Modtech Machinery Team Sign In" },
      {
        property: "og:description",
        content: "Private sign in for the Modtech Machinery content team.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      if (hasDemoSession()) navigate({ to: "/admin", replace: true });
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (import.meta.env.DEV) {
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          startDemoSession();
          navigate({ to: "/admin", replace: true });
        } else {
          throw new Error("Invalid local demo email or password.");
        }
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: userData } = await supabase.auth.getUser();
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user?.id ?? "");
      if (roleError || !roles?.some((item) => item.role === "admin" || item.role === "editor")) {
        await supabase.auth.signOut();
        throw new Error("This account does not have admin access.");
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-16 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-brand/15 blur-[140px]" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-deep">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo className="h-8" />
        </Link>
        <div className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-brand">
          <Lock className="h-3.5 w-3.5" /> team access
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">Sign in to admin</h1>

        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={() => {
              setEmail(DEMO_EMAIL);
              setPassword(DEMO_PASSWORD);
            }}
            className="mt-5 w-full rounded-xl border border-brand/30 bg-brand/5 p-3 text-left text-xs text-muted-foreground transition hover:border-brand/60"
          >
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-brand">
              Local demo login
            </span>
            <span className="mt-1 block">{DEMO_EMAIL} · Click to fill credentials</span>
          </button>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in securely
          </button>
        </form>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Access is restricted to authorised Modtech administrators and editors.
        </p>
      </div>
    </main>
  );
}
