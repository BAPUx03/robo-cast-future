import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/brand-logo";
import { requestAuthEmail } from "@/lib/auth-email.functions";
import {
  DEMO_EMAIL,
  DEMO_MODE,
  DEMO_PASSWORD,
  hasDemoSession,
  startDemoSession,
} from "@/lib/demo-admin";

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

const configuredOtpExpiry = Number(import.meta.env.VITE_AUTH_OTP_EXPIRY_SECONDS ?? "3600");
const configuredResendDelay = Number(import.meta.env.VITE_AUTH_OTP_RESEND_SECONDS ?? "60");
const OTP_EXPIRY_SECONDS =
  Number.isFinite(configuredOtpExpiry) && configuredOtpExpiry >= 60 ? configuredOtpExpiry : 3600;
const OTP_RESEND_SECONDS =
  Number.isFinite(configuredResendDelay) && configuredResendDelay >= 1 ? configuredResendDelay : 60;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`;
}

function authErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();
  if (normalized.includes("rate limit") || normalized.includes("security purposes")) {
    return "Please wait before requesting another code.";
  }
  if (normalized.includes("expired") || normalized.includes("invalid token")) {
    return "This code is invalid or has expired. Request a new code.";
  }
  if (normalized.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }
  return message || "Something went wrong";
}

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@modtech.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState<AuthMethod>("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (DEMO_MODE) {
      if (hasDemoSession())
        navigate({ to: "/admin", search: { section: undefined }, replace: true });
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", search: { section: undefined }, replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    if (!otpSentAt) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [otpSentAt]);

  function changeMethod(next: AuthMethod) {
    setMethod(next);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setOtpSentAt(null);
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
    const address = email.trim();
    await requestAuthEmail({
      data: { email: address, flow: method === "reset" ? "recovery" : "sign_in" },
    });
    setOtpSent(true);
    setOtp("");
    setOtpSentAt(Date.now());
    toast.success(
      method === "reset"
        ? "A password recovery code has been sent to your work email."
        : "A secure 6-digit sign-in code has been sent to your work email.",
    );
  }

  async function verifyEmailOtp() {
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: method === "reset" ? "recovery" : "email",
    });
    if (error) throw error;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (DEMO_MODE) {
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
        if (otpExpired) {
          await sendOtp();
          return;
        }
        if (!otpVerified) {
          await verifyEmailOtp();
          setOtpVerified(true);
          toast.success("Code verified. Create your new password.");
          return;
        }
        if (password.length < 12) throw new Error("Password must be at least 12 characters.");
        if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
          throw new Error("Password must contain at least one letter and one number.");
        }
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        await supabase.auth.signOut({ scope: "local" });
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
      toast.error(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const needsOtp = (method === "otp" || method === "reset") && otpSent && !otpVerified;
  const needsPassword = method === "password" || (method === "reset" && otpVerified);
  const elapsedSeconds = otpSentAt ? Math.floor((now - otpSentAt) / 1000) : 0;
  const resendIn = Math.max(0, OTP_RESEND_SECONDS - elapsedSeconds);
  const expiresIn = Math.max(0, OTP_EXPIRY_SECONDS - elapsedSeconds);
  const otpExpired = Boolean(otpSentAt && expiresIn === 0);

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

        {DEMO_MODE && (
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
              <p
                className={`mt-2 text-xs ${otpExpired ? "text-destructive" : "text-muted-foreground"}`}
              >
                {otpExpired
                  ? "This code has expired. Request a new code."
                  : `Code expires in ${formatCountdown(expiresIn)}.`}
              </p>
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
                  minLength={method === "reset" ? 12 : 6}
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
              {method === "reset" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Use at least 12 characters with a letter and a number.
                </p>
              )}
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
                minLength={12}
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
                  ? otpExpired
                    ? "Request new code"
                    : "Verify code"
                  : "Update password"
              : method === "otp"
                ? otpSent
                  ? "Verify & sign in"
                  : "Send sign-in code"
                : "Sign in securely"}
          </button>
        </form>

        {!DEMO_MODE && needsOtp && (
          <div className="mt-3 flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setOtpSentAt(null);
              }}
              className="text-muted-foreground underline underline-offset-4 hover:text-brand"
            >
              Change email
            </button>
            <button
              type="button"
              disabled={busy || resendIn > 0}
              onClick={async () => {
                setBusy(true);
                try {
                  await sendOtp();
                } catch (error) {
                  toast.error(authErrorMessage(error));
                } finally {
                  setBusy(false);
                }
              }}
              className="text-muted-foreground underline underline-offset-4 hover:text-brand disabled:no-underline disabled:opacity-60"
            >
              {resendIn > 0 ? `Resend in ${formatCountdown(resendIn)}` : "Resend code"}
            </button>
          </div>
        )}

        {!DEMO_MODE && method === "reset" && (
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
