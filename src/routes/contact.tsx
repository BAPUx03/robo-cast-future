import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Globe2, Headphones, Mail, MapPin, Phone, Wrench } from "lucide-react";
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
  validateSearch: (search: Record<string, unknown>) => ({
    machine: typeof search.machine === "string" ? search.machine.trim().slice(0, 160) : undefined,
  }),
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
  const { machine } = Route.useSearch();
  const initialMessage = machine
    ? `I am interested in ${machine}. Please share the approved datasheet, available configuration and quotation.`
    : "";
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

      <section className="relative bg-background px-5 py-9 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
          {/* Contact details */}
          <div className="reveal-on-scroll order-2 min-w-0 space-y-3 lg:order-1">
            <h2 className="font-display text-xl font-bold sm:text-2xl">Contact us directly</h2>
            <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/60 sm:gap-4 sm:rounded-2xl sm:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary/40 text-brand sm:h-11 sm:w-11 sm:rounded-xl">
                <Mail className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-muted-foreground">
                  New machine requirements
                </div>
                <a
                  href={`mailto:${global.primary_email}`}
                  className="mt-1 block break-all font-display text-sm font-semibold text-foreground transition group-hover:text-brand sm:text-base"
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
            <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/60 sm:gap-4 sm:rounded-2xl sm:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary/40 text-brand sm:h-11 sm:w-11 sm:rounded-xl">
                <Wrench className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-muted-foreground">
                  Automation enquiries
                </div>
                <a
                  href={`mailto:${global.automation_email}`}
                  className="mt-1 block break-all font-display text-sm font-semibold text-foreground transition group-hover:text-brand sm:text-base"
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
            <div className="group flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/60 sm:gap-4 sm:rounded-2xl sm:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary/40 text-brand sm:h-11 sm:w-11 sm:rounded-xl">
                <Headphones className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-muted-foreground">Customer support</div>
                <a
                  href={`mailto:${companyContact.supportEmail}`}
                  className="mt-1 block break-all font-display text-sm font-semibold text-foreground transition group-hover:text-brand sm:text-base"
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
            <details className="group rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-5">
              <summary className="cursor-pointer font-display text-sm font-semibold text-foreground marker:text-brand">
                Spares & vendor enquiries
              </summary>
              <div className="mt-3 grid gap-3 border-t border-border pt-3 text-sm">
                <a
                  href={`mailto:${companyContact.sparesEmail}`}
                  className="break-all text-brand hover:underline"
                >
                  Spares: {companyContact.sparesEmail}
                </a>
                <a
                  href={`mailto:${companyContact.vendorEmail}`}
                  className="break-all text-brand hover:underline"
                >
                  Vendors: {companyContact.vendorEmail}
                </a>
              </div>
            </details>
            <div className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 sm:gap-4 sm:rounded-2xl sm:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary/40 text-brand sm:h-11 sm:w-11 sm:rounded-xl">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-muted-foreground">
                  Workshop · Ahmedabad
                </div>
                <div className="mt-1 text-sm leading-relaxed text-foreground/80">
                  {global.address}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <EnquiryForm
              heading={machine ? "Enquire about this machine" : undefined}
              initialMessage={initialMessage}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-carbon-2 px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <header className="reveal-on-scroll">
            <p className="flex items-center gap-2 text-xs font-semibold text-brand">
              <Globe2 className="h-4 w-4" aria-hidden="true" /> Global contacts
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
              Talk to a local representative.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Direct contacts for Russia, Germany and South Korea.
            </p>
          </header>

          <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
            {REPRESENTATIVES.map((representative) => (
              <li
                key={representative.email}
                className="w-[78vw] max-w-[19rem] shrink-0 snap-start rounded-2xl border border-border bg-card p-4 shadow-card md:w-auto md:max-w-none"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={representative.image}
                    alt=""
                    loading="lazy"
                    className={`h-14 w-14 shrink-0 rounded-xl object-cover ${representative.imagePosition}`}
                  />
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold leading-tight">
                      {representative.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{representative.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <img
                    src={representative.flag}
                    alt=""
                    className="h-4 w-6 rounded-sm object-cover"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {representative.country}
                  </span>
                  <span className="min-w-0 truncate text-xs text-muted-foreground">
                    · {representative.company}
                  </span>
                </div>
                <a
                  href={`mailto:${representative.email}`}
                  aria-label={`Email ${representative.name} at ${representative.email}`}
                  className="mt-4 flex min-h-11 items-center justify-between gap-2 rounded-xl border border-brand/30 bg-brand/10 px-3 text-sm font-medium text-brand transition hover:border-brand hover:bg-brand/15"
                >
                  <span className="min-w-0 truncate">{representative.email}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-muted-foreground md:hidden">
            Swipe to see more contacts.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
