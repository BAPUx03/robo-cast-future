import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitEnquiry } from "@/lib/enquiry.functions";

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground" htmlFor={`f-${name}`}>
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      <input
        id={`f-${name}`}
        name={name}
        type={type}
        required={required}
        maxLength={type === "email" ? 255 : 120}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-brand/40 transition placeholder:text-muted-foreground focus:border-brand focus:ring-2"
      />
    </div>
  );
}

export function EnquiryForm({ heading = "Send us a message" }: { heading?: string }) {
  const send = useServerFn(submitEnquiry);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    try {
      await send({
        data: {
          name: String(fd.get("name") ?? ""),
          company: String(fd.get("company") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          message: String(fd.get("message") ?? ""),
        },
      });
      toast.success("Thank you — our engineering team will be in touch.");
      form.reset();
    } catch {
      toast.error("We could not send that. Please try email instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="reveal-on-scroll relative overflow-hidden rounded-2xl border border-border bg-card p-7 sm:p-8" onSubmit={handleSubmit}>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ enquiry</div>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{heading}</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="company" label="Company" />
        <Field name="email" type="email" label="Email" required />
        <Field name="phone" label="Phone" />
        <div className="sm:col-span-2">
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground" htmlFor="f-message">
            Message<span className="text-brand"> *</span>
          </label>
          <textarea
            id="f-message"
            name="message"
            rows={5}
            required
            maxLength={2000}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-brand/40 transition placeholder:text-muted-foreground focus:border-brand focus:ring-2"
            placeholder="Tell us about the part, the volume, and the cycle time…"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px] disabled:opacity-60"
      >
        {busy ? (
          <>
            Sending <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Send enquiry <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
