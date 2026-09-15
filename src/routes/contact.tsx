import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { EnquiryForm } from "@/components/enquiry-form";
import { automationImages, companyContact } from "@/content/automation-data";

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
  return (
    <PageShell>
      <PageHero
        kicker="/ contact"
        image={automationImages.caseErector}
        title={<>Let's engineer your <span className="text-gradient-brand">next production line</span>.</>}
        subtitle="Tell us about the part, the volume, and the cycle time. We'll come back with a system blueprint."
      />

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact details */}
          <div className="reveal-on-scroll space-y-4">
            <a href={`mailto:${companyContact.email}`} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</div>
                <div className="mt-1 font-display text-base font-semibold text-foreground transition group-hover:text-brand">{companyContact.email}</div>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Workshop</div>
                <div className="mt-1 font-display text-base font-semibold text-foreground">India · Global delivery</div>
                <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{companyContact.address}</div>
              </div>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </section>
    </PageShell>
  );
}
