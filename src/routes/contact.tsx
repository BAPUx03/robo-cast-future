import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Mail, MapPin, Phone, Wrench } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { EnquiryForm } from "@/components/enquiry-form";
import { automationImages, companyContact } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Modtech Machinery" },
      {
        name: "description",
        content:
          "Talk to Modtech Machinery engineering. We'll come back with a system blueprint for your line.",
      },
      { property: "og:title", content: "Contact Modtech Machinery" },
      {
        property: "og:description",
        content: "Tell us about the part, the volume and the cycle time.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useRevealOnScroll();
  const content = useSiteContent("contact");
  const global = useSiteContent("global");
  return (
    <PageShell>
      <PageHero
        kicker={content.eyebrow}
        image={automationImages.caseErector}
        title={
          <>
            {content.title} <span className="text-gradient-brand">{content.accent}</span>
          </>
        }
        subtitle={content.description}
      />

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact details */}
          <div className="reveal-on-scroll space-y-4">
            <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  New machine requirements
                </div>
                <a
                  href={`mailto:${global.primary_email}`}
                  className="mt-1 block font-display text-base font-semibold text-foreground transition group-hover:text-brand"
                >
                  {global.primary_email}
                </a>
                <a
                  href="tel:+919723456251"
                  className="mt-1 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-brand"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {companyContact.phone}
                </a>
              </div>
            </div>
            <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Wrench className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Automation enquiries
                </div>
                <a
                  href={`mailto:${global.automation_email}`}
                  className="mt-1 block font-display text-base font-semibold text-foreground transition group-hover:text-brand"
                >
                  {global.automation_email}
                </a>
                <a
                  href="tel:+919898873558"
                  className="mt-1 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-brand"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {companyContact.automationPhone}
                </a>
              </div>
            </div>
            <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Customer support
                </div>
                <a
                  href={`mailto:${companyContact.supportEmail}`}
                  className="mt-1 block font-display text-base font-semibold text-foreground transition group-hover:text-brand"
                >
                  {companyContact.supportEmail}
                </a>
                <a
                  href="tel:+918735915913"
                  className="mt-1 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-brand"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {companyContact.supportPhone}
                </a>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${companyContact.sparesEmail}`}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-brand/60"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Spares
                </div>
                <div className="mt-2 break-all text-sm font-semibold text-foreground">
                  {companyContact.sparesEmail}
                </div>
              </a>
              <a
                href={`mailto:${companyContact.vendorEmail}`}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-brand/60"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Vendor enquiries
                </div>
                <div className="mt-2 break-all text-sm font-semibold text-foreground">
                  {companyContact.vendorEmail}
                </div>
              </a>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Workshop
                </div>
                <div className="mt-1 font-display text-base font-semibold text-foreground">
                  India · Global delivery
                </div>
                <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {global.address}
                </div>
              </div>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </section>
    </PageShell>
  );
}
