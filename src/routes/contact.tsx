import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/machine-hero.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Modtech Machinery" },
      { name: "description", content: "Talk to Modtech Machinery engineering. We'll come back with a system blueprint for your line." },
      { property: "og:title", content: "Contact Modtech Machinery" },
      { property: "og:description", content: "Tell us about the part, the volume and the cycle time." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useRevealOnScroll();
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    const { error } = await supabase.from("enquiries").insert({
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? "") || null,
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? "") || null,
      message: String(data.get("message") ?? ""),
    });
    setBusy(false);
    if (error) {
      toast.error("We could not send that. Please try email instead.");
      return;
    }
    toast.success("Thank you — our engineering team will be in touch.");
    form.reset();
  }

  return (
    <PageShell>
      <PageHero
        kicker="/ contact"
        image={heroImg}
        title={<>Let's engineer your <span className="text-gradient-brand">next production line</span>.</>}
        subtitle="Tell us about the part, the volume, and the cycle time. We'll come back with a system blueprint."
      />

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact details */}
          <div className="reveal-on-scroll space-y-4">
            <a href="mailto:info@modtechworld.com" className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</div>
                <div className="mt-1 font-display text-base font-semibold text-foreground transition group-hover:text-brand">info@modtechworld.com</div>
              </div>
            </a>
            <a href="tel:+910000000000" className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Phone</div>
                <div className="mt-1 font-display text-base font-semibold text-foreground transition group-hover:text-brand">+91 00000 00000</div>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Workshop</div>
                <div className="mt-1 font-display text-base font-semibold text-foreground">India · Global delivery</div>
                <div className="mt-1 text-sm text-muted-foreground">Engineering, fabrication and integration under one roof.</div>
              </div>
            </div>
          </div>

          <form
            className="reveal-on-scroll relative overflow-hidden rounded-2xl border border-border bg-card p-7 sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ enquiry</div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Send us a message</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Name" required />
              <Field name="company" label="Company" />
              <Field name="email" type="email" label="Email" required />
              <Field name="phone" label="Phone" />
              <div className="sm:col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-brand/40 transition placeholder:text-muted-foreground focus:border-brand focus:ring-2"
                  placeholder="Tell us about the part, the volume, and the cycle time…" />
              </div>
            </div>

            <button type="submit" disabled={busy} className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px] disabled:opacity-60">
              {busy ? <>Sending <Loader2 className="h-4 w-4 animate-spin" /></> : <>Send enquiry <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground" htmlFor={name}>
        {label}{required && <span className="text-brand"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-brand/40 transition placeholder:text-muted-foreground focus:border-brand focus:ring-2" />
    </div>
  );
}
