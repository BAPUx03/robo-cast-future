import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Building2,
  Globe2,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { EnquiryForm } from "@/components/enquiry-form";
import { automationImages, companyContact } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";

const REPRESENTATIVES = [
  {
    name: "Eugenia Mazaeva",
    role: "Chief of Technical Department",
    company: "Modern Building Company",
    country: "Russia",
    countryCode: "RU",
    flag: "/representatives/flags/russia.svg",
    email: "khutorskaya@smkom.ru",
    image: "/representatives/eugenia-mazaeva.jpg",
    imagePosition: "object-[center_20%]",
  },
  {
    name: "Michael Heuser",
    role: "Director",
    company: "Interluxus UG",
    country: "Germany",
    countryCode: "DE",
    flag: "/representatives/flags/germany.svg",
    email: "info@modtechworld.com",
    image: "/representatives/michael-heuser.jpg",
    imagePosition: "object-center",
  },
  {
    name: "Ahn HyoungWoo",
    role: "Director",
    company: "WIKO Co. Ltd.",
    country: "South Korea",
    countryCode: "KR",
    flag: "/representatives/flags/south-korea.svg",
    email: "ahn.hw@modtechworld.com",
    image: "/representatives/ahn-hyoungwoo.jpg",
    imagePosition: "object-top",
  },
] as const;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Modtech Machine" },
      {
        name: "description",
        content:
          "Talk to Modtech Machine engineering. We'll come back with a system blueprint for your line.",
      },
      { property: "og:title", content: "Contact Modtech Machine" },
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
          <div className="reveal-on-scroll min-w-0 space-y-4">
            <div className="group flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-brand/60 sm:p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Mail className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  New machine requirements
                </div>
                <a
                  href={`mailto:${global.primary_email}`}
                  className="mt-1 block break-all font-display text-base font-semibold text-foreground transition group-hover:text-brand"
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
            <div className="group flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-brand/60 sm:p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Wrench className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Automation enquiries
                </div>
                <a
                  href={`mailto:${global.automation_email}`}
                  className="mt-1 block break-all font-display text-base font-semibold text-foreground transition group-hover:text-brand"
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
            <div className="group flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-brand/60 sm:p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <Headphones className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Customer support
                </div>
                <a
                  href={`mailto:${companyContact.supportEmail}`}
                  className="mt-1 block break-all font-display text-base font-semibold text-foreground transition group-hover:text-brand"
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
            <div className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
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

      <section className="relative isolate overflow-hidden border-y border-border bg-carbon px-5 py-16 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-brand/12 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-cyan/10 blur-[110px]" />

        <div className="mx-auto max-w-6xl">
          <header className="reveal-on-scroll grid gap-6 border-b border-border/70 pb-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-brand">
                <Globe2 className="h-3.5 w-3.5" /> Global representative network
              </div>
              <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.04em]">
                Local expertise.
                <span className="block text-gradient-brand">Direct global support.</span>
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Connect with an experienced Modtech representative who understands your market,
                application and local project requirements.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/60">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" /> 3 international markets
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> Direct email access
                </span>
              </div>
            </div>
          </header>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
            {REPRESENTATIVES.map((representative, index) => (
              <article
                key={representative.email}
                className="representative-card reveal-on-scroll group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/95 shadow-card transition duration-500 hover:-translate-y-1.5 hover:border-brand/45 hover:shadow-deep"
                data-reveal-delay={index * 100}
              >
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand/80 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative h-24 w-24 shrink-0 rounded-2xl border border-white/10 bg-secondary p-1 shadow-lg">
                      <div className="h-full w-full overflow-hidden rounded-[0.7rem] bg-white">
                        <img
                          src={representative.image}
                          alt={`${representative.name}, Modtech representative for ${representative.country}`}
                          loading="lazy"
                          className={`h-full w-full object-cover ${representative.imagePosition} transition duration-700 ease-out group-hover:scale-[1.035]`}
                        />
                      </div>
                      <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-card bg-brand font-mono text-[8px] font-bold text-brand-foreground shadow-md">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col items-end gap-2.5">
                      <div
                        className="representative-flag-wrap"
                        aria-label={`Flag of ${representative.country}`}
                      >
                        <span className="representative-flag-pole" aria-hidden="true" />
                        <img
                          src={representative.flag}
                          alt=""
                          className="representative-flag"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="rounded-full border border-border bg-secondary/70 px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {representative.countryCode}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-brand">
                    {representative.role}
                  </div>
                  <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-foreground">
                    {representative.name}
                  </h3>

                  <dl className="mt-4 divide-y divide-border/70 border-y border-border/70">
                    <div className="grid grid-cols-[1rem_1fr] gap-2.5 py-3">
                      <Building2 className="mt-0.5 h-3.5 w-3.5 text-brand" />
                      <div>
                        <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                          Company
                        </dt>
                        <dd className="mt-0.5 text-[13px] font-semibold leading-snug text-foreground/90">
                          {representative.company}
                        </dd>
                      </div>
                    </div>
                    <div className="grid grid-cols-[1rem_1fr] gap-2.5 py-3">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 text-brand" />
                      <div>
                        <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                          Market
                        </dt>
                        <dd className="mt-0.5 text-[13px] font-semibold text-foreground/90">
                          {representative.country}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <a
                    href={`mailto:${representative.email}`}
                    className="mt-4 inline-flex min-w-0 items-center justify-between gap-3 rounded-xl border border-brand/25 bg-brand/8 px-3.5 py-3 transition hover:border-brand/60 hover:bg-brand/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    aria-label={`Email ${representative.name} at ${representative.email}`}
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                        Email representative
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-semibold text-foreground">
                        {representative.email}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="reveal-on-scroll mx-auto mt-6 flex max-w-5xl flex-col gap-3 rounded-2xl border border-border bg-card/65 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Outside these regions? Our Ahmedabad engineering team will connect you with the right
              contact.
            </p>
            <a
              href={`mailto:${global.primary_email}`}
              className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand transition hover:gap-3"
            >
              Contact headquarters <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
