import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Loader2, ShieldCheck } from "lucide-react";
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
        content: "Secure sign in for the Modtech Machinery administration and sales team.",
      },
      { property: "og:title", content: "Modtech Machinery Team Sign In" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type AuthMethod = "otp" | "password" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState<AuthMethod>(import.meta.env.DEV ? "password" : "otp");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      if (hasDemoSession())
        navigate({ to: "/admin", search: { section: undefined }, replace: true });
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", search: { section: undefined }, replace: true });
    });
  }, [navigate]);

  function changeMethod(next: AuthMethod) {
    setMethod(next);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setPassword("");
    setConfirmPassword("");
  }

  async function completeTeamSignIn() {
    const { data: userData } = await supabase.auth.getUser();
    let { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user?.id ?? "");

    if (!roleError && roles?.length === 0) {
      const { data: claimed } = await supabase.rpc("claim_admin");
      if (claimed) {
        const refreshed = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user?.id ?? "");
        roles = refreshed.data;
        roleError = refreshed.error;
      }
    }

    if (
      roleError ||
      !roles?.some((item) => ["admin", "editor", "sales_manager", "sales"].includes(item.role))
    ) {
      await supabase.auth.signOut();
      throw new Error("This account does not have authorised team access.");
    }

    navigate({ to: "/admin", search: { section: undefined }, replace: true });
  }

  async function sendOtp() {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    if (error) throw error;
    setOtpSent(true);
    toast.success("A secure 6-digit code has been sent to your work email.");
  }

  async function verifyEmailOtp() {
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });
    if (error) throw error;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (import.meta.env.DEV) {
        if (email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD) {
          startDemoSession();
          navigate({ to: "/admin", search: { section: undefined }, replace: true });
        } else {
          throw new Error("Invalid local demo email or password.");
        }
        return;
      }

      if (method === "reset") {
        if (!otpSent) {
          await sendOtp();
          return;
        }
        if (!otpVerified) {
          await verifyEmailOtp();
          setOtpVerified(true);
          toast.success("Code verified. Create your new password.");
          return;
        }
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        await supabase.auth.signOut();
        changeMethod("password");
        toast.success("Password updated. You can now sign in securely.");
        return;
      }

      if (method === "otp") {
        if (!otpSent) {
          await sendOtp();
          return;
        }
        await verifyEmailOtp();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }

      await completeTeamSignIn();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const needsOtp = (method === "otp" || method === "reset") && otpSent && !otpVerified;
  const needsPassword = method === "password" || (method === "reset" && otpVerified);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-16 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-brand/15 blur-[140px]" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-deep">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo className="h-8" />
        </Link>
        <div className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-brand">
          {method === "reset" ? (
            <ShieldCheck className="h-3.5 w-3.5" />
          ) : (
            <Lock className="h-3.5 w-3.5" />
          )}
          {method === "reset" ? "account recovery" : "team access"}
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
          {method === "reset" ? "Reset your password" : "Sign in to control centre"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {method === "reset"
            ? "Verify your work email with a one-time code, then choose a new password."
            : "Secure access for Modtech administrators, content editors and sales teams."}
        </p>

        {!import.meta.env.DEV && method !== "reset" && (
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-1">
            {(["otp", "password"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeMethod(item)}
                className={`rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition ${method === item ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item === "otp" ? "Email OTP" : "Password"}
              </button>
            ))}
          </div>
        )}

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
          {!otpVerified && (
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                readOnly={otpSent}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2 read-only:opacity-70"
              />
            </div>
          )}

          {needsOtp && (
            <div>
              <label
                htmlFor="otp"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                6-digit security code
              </label>
              <input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center font-mono text-xl tracking-[0.5em] outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
              />
            </div>
          )}

          {needsPassword && (
            <div>
              <label
                htmlFor="password"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                {method === "reset" ? "New password" : "Password"}
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={method === "reset" ? "new-password" : "current-password"}
                  required
                  minLength={method === "reset" ? 8 : 6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-4 pr-12 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {method === "reset" && otpVerified && (
            <div>
              <label
                htmlFor="confirm-password"
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : method === "reset" ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            {method === "reset"
              ? !otpSent
                ? "Send recovery code"
                : !otpVerified
                  ? "Verify code"
                  : "Update password"
              : method === "otp"
                ? otpSent
                  ? "Verify & sign in"
                  : "Send sign-in code"
                : "Sign in securely"}
          </button>
        </form>

        {!import.meta.env.DEV && needsOtp && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setOtpSent(false);
              setOtp("");
            }}
            className="mt-3 w-full text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-brand"
          >
            Change email or request another code
          </button>
        )}

        {!import.meta.env.DEV && method === "password" && (
          <button
            type="button"
            onClick={() => changeMethod("reset")}
            className="mt-4 w-full text-center text-xs text-muted-foreground transition hover:text-brand"
          >
            Forgot password? Reset with email OTP
          </button>
        )}

        {!import.meta.env.DEV && method === "reset" && (
          <button
            type="button"
            onClick={() => changeMethod("otp")}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 text-xs text-muted-foreground transition hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </button>
        )}
      </div>
    </main>
  );
}
