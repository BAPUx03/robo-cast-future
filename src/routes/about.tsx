import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Bot,
  CalendarDays,
  Check,
  Cpu,
  Download,
  Eye,
  FileCheck2,
  Globe2,
  Handshake,
  Layers,
  LifeBuoy,
  MoveHorizontal,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { YouTubeBackground } from "@/components/youtube-background";
import { DragRail } from "@/components/drag-rail";
import { Button } from "@/components/ui/button";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { stats, partnerCapabilities } from "@/content/site-data";
import { automationImages, automationPartners } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Modtech | Robotics & Casting Engineering" },
      {
        name: "description",
        content:
          "Since 1990, Modtech has engineered robotics, automation and investment casting machinery for manufacturers across 45+ countries.",
      },
      { property: "og:title", content: "About Modtech Machine" },
      {
        property: "og:description",
        content:
          "India's engineering partner for robotics, automation and investment casting machinery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const story = [
  {
    year: "1990",
    title: "Built here. Proven everywhere.",
    body: "Modtech began by developing investment casting machinery in-house. That hands-on engineering culture still shapes every machine, cell and production line we deliver.",
  },
  {
    year: "45+ countries",
    title: "Indian engineering, global installation base.",
    body: "Our special-purpose machines now operate across the UK, France, Germany, Japan, the USA, Russia and major manufacturing markets worldwide.",
  },
  {
    year: "Future ready",
    title: "Advanced technology without unnecessary complexity.",
    body: "We continually upgrade our equipment while keeping operation intuitive, maintenance practical and every system ready for long-term production.",
  },
];

const capabilities = [
  {
    t: "In-house Engineering",
    d: "Mechanical, electrical and controls under one roof.",
    Icon: Cpu,
  },
  {
    t: "Modular Lines",
    d: "A single machine or a complete integrated production cell.",
    Icon: Layers,
  },
  { t: "PLC + Vision", d: "Real-time monitoring and safety-rated robotic control.", Icon: Eye },
  {
    t: "Global Delivery",
    d: "Commissioning and lifecycle support across the world.",
    Icon: Globe2,
  },
  {
    t: "Robotic Cells",
    d: "Six-axis integration with purpose-built end-of-arm tooling.",
    Icon: Bot,
  },
  {
    t: "Lifecycle Support",
    d: "Spares, retrofits and continuous line optimisation.",
    Icon: LifeBuoy,
  },
];

const promises = [
  "Fast service backed by a three-tier support structure",
  "Dedicated RITE service programme and service centre",
  "24 × 7 online technical support from India",
  "Globally standardised parts with dependable spare backup",
];

const certifications = [
  {
    standard: "ISO 9001:2015",
    system: "Quality Management System",
    certificateNumber: "IN260718008",
    issuedOn: "18 July 2026",
    validThrough: "17 July 2029",
    document: "/certifications/modtech-iso-9001-2015.pdf",
    scope:
      "Design, engineering, fabrication, assembly, testing, supply, installation and servicing of investment casting machinery, industrial automation systems, robotics and special purpose machines.",
  },
] as const;

const customerPanels = Array.from({ length: 9 }, (_, index) => ({
  number: String(index + 1).padStart(2, "0"),
  image: `/customers/customer-${String(index + 1).padStart(2, "0")}.jpg`,
}));

const demoTestimonials = [
  {
    quote:
      "The team understood our production bottleneck quickly and proposed a practical automation path without overcomplicating the line.",
    role: "Production Head",
    industry: "Investment casting",
    initials: "PH",
  },
  {
    quote:
      "Commissioning was structured, communication stayed clear and the operators were comfortable with the system from the first production run.",
    role: "Plant Manager",
    industry: "Industrial manufacturing",
    initials: "PM",
  },
  {
    quote:
      "The machine feels purpose-built for our process. Repeatability improved while day-to-day operation remained straightforward for the shop-floor team.",
    role: "Operations Director",
    industry: "Precision components",
    initials: "OD",
  },
  {
    quote:
      "From design reviews to final trials, the engineering team responded with speed and kept every decision focused on production reliability.",
    role: "Engineering Manager",
    industry: "Foundry automation",
    initials: "EM",
  },
  {
    quote:
      "The modular approach gave us room to start with the immediate requirement and scale the cell as our production demand increased.",
    role: "Project Lead",
    industry: "Process automation",
    initials: "PL",
  },
  {
    quote:
      "Support after installation has been responsive and practical, helping our maintenance team protect uptime and resolve issues confidently.",
    role: "Maintenance Head",
    industry: "Global manufacturing",
    initials: "MH",
  },
] as const;

function AboutPage() {
  useRevealOnScroll();
  const content = useSiteContent("about");

  return (
    <PageShell>
      <section className="on-dark relative isolate min-h-[620px] overflow-hidden border-b border-border bg-carbon px-5 pb-10 pt-14 sm:px-8 sm:pb-14 lg:min-h-[720px] lg:pt-20">
        <YouTubeBackground
          videoId="htlzxdmeVg0"
          title="Modtech investment casting image movie"
          className="-z-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-carbon via-carbon/90 to-carbon/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-transparent to-carbon/40" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col justify-between lg:min-h-[610px]">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h1 className="reveal max-w-5xl font-display text-[clamp(2.8rem,7vw,6.7rem)] font-bold leading-[0.94]">
                {content.title} <span className="text-brand">{content.accent}</span>
              </h1>
            </div>
            <p
              className="reveal max-w-md border-l border-brand/50 pl-5 text-base leading-relaxed text-muted-foreground lg:mb-2 lg:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              {content.description}
            </p>
          </div>

          <dl className="mt-14 grid grid-cols-2 border-y border-border/70 bg-carbon/55 backdrop-blur-md lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-border/70 px-4 py-5 sm:px-6 lg:border-r lg:last:border-r-0"
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-5xl">
                Three decades of building what production demands.
              </h2>
            </div>
            <ol className="border-t border-border">
              {story.map((item) => (
                <li
                  key={item.year}
                  className="group grid gap-4 border-b border-border py-8 sm:grid-cols-[150px_1fr] sm:items-start"
                >
                  <span className="font-display text-sm font-semibold text-foreground sm:text-base">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold transition group-hover:text-brand sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="on-dark relative isolate min-h-[520px] overflow-hidden border-y border-border bg-carbon px-5 py-20 sm:px-8 sm:py-28">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source
            src="/modtech-global-map.mp4"
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
        </video>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-carbon via-carbon/90 to-carbon/35" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-carbon/90 via-transparent to-carbon/65" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-15" />

        <div className="mx-auto flex min-h-[330px] max-w-7xl items-center">
          <div className="reveal-on-scroll max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-carbon/55 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-brand backdrop-blur-md">
              <Globe2 className="h-3.5 w-3.5" /> Global presence
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
              Expanding horizons.
              <span className="block text-gradient-brand">Engineering without borders.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-foreground/70 sm:text-lg">
              Modtech machines and automation systems support manufacturers across more than 45
              countries, backed by commissioning, remote diagnostics and lifecycle service.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/70">
              <span className="rounded-full border border-foreground/15 bg-carbon/55 px-4 py-2 backdrop-blur-md">
                45+ countries
              </span>
              <span className="rounded-full border border-foreground/15 bg-carbon/55 px-4 py-2 backdrop-blur-md">
                Worldwide support
              </span>
              <span className="rounded-full border border-foreground/15 bg-carbon/55 px-4 py-2 backdrop-blur-md">
                Remote diagnostics
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="certifications"
        className="on-dark relative isolate overflow-hidden border-y border-border bg-carbon px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-25" />
        <div className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-80 w-80 rounded-full bg-brand/12 blur-[120px]" />
        <div className="pointer-events-none absolute -right-28 bottom-0 -z-10 h-72 w-72 rounded-full bg-cyan/10 blur-[110px]" />

        <div className="mx-auto max-w-7xl">
          <header className="reveal-on-scroll grid gap-7 border-b border-foreground/15 pb-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-brand">
                <ShieldCheck className="h-3.5 w-3.5" /> Certified quality system
              </div>
              <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold tracking-[-0.035em] sm:text-5xl">
                Quality you can verify.
                <span className="block text-gradient-brand">Standards we work by.</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-foreground/60 sm:text-base">
              Our management system is independently certified for the engineering and lifecycle
              support behind Modtech Machine, automation and robotic systems.
            </p>
          </header>

          <div className="mt-8 grid gap-6">
            {certifications.map((certificate) => (
              <article
                key={certificate.certificateNumber}
                className="reveal-on-scroll group grid overflow-hidden rounded-3xl border border-foreground/15 bg-card shadow-deep lg:grid-cols-[0.72fr_1fr]"
              >
                <div className="relative border-b border-border bg-secondary/35 p-4 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="relative mx-auto aspect-[612/792] max-w-[25rem] overflow-hidden rounded-xl border border-foreground/15 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
                    <object
                      data={`${certificate.document}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      type="application/pdf"
                      aria-label={`${certificate.standard} certificate preview`}
                      className="h-full w-full"
                    >
                      <div className="flex h-full flex-col items-center justify-center bg-white p-8 text-center text-slate-900">
                        <Award className="h-14 w-14 text-emerald-600" />
                        <strong className="mt-5 text-2xl">{certificate.standard}</strong>
                        <span className="mt-2 text-sm text-slate-600">{certificate.system}</span>
                        <a
                          href={certificate.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 text-sm font-semibold text-emerald-700 underline"
                        >
                          Open certificate PDF
                        </a>
                      </div>
                    </object>
                  </div>
                  <div className="pointer-events-none absolute bottom-7 left-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-carbon/80 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur sm:bottom-9 sm:left-9">
                    <FileCheck2 className="h-3.5 w-3.5 text-brand" /> Official document
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-brand">
                        Quality management certification
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                        {certificate.standard}
                      </h3>
                      <p className="mt-2 text-base font-medium text-foreground/70">
                        {certificate.system}
                      </p>
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand/25 bg-brand/10 text-brand shadow-glow">
                      <BadgeCheck className="h-6 w-6" />
                    </span>
                  </div>

                  <p className="mt-7 text-sm leading-7 text-muted-foreground">
                    {certificate.scope}
                  </p>

                  <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                    <div className="bg-card p-4">
                      <dt className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                        Certificate no.
                      </dt>
                      <dd className="mt-2 font-display text-sm font-semibold text-foreground">
                        {certificate.certificateNumber}
                      </dd>
                    </div>
                    <div className="bg-card p-4">
                      <dt className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                        <CalendarDays className="h-3 w-3 text-brand" /> Issued
                      </dt>
                      <dd className="mt-2 font-display text-sm font-semibold text-foreground">
                        {certificate.issuedOn}
                      </dd>
                    </div>
                    <div className="bg-card p-4">
                      <dt className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                        <ShieldCheck className="h-3 w-3 text-brand" /> Valid through
                      </dt>
                      <dd className="mt-2 font-display text-sm font-semibold text-foreground">
                        {certificate.validThrough}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button asChild size="lg">
                      <a href={certificate.document} target="_blank" rel="noopener noreferrer">
                        View certificate <ArrowUpRight />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a href={certificate.document} download>
                        Download PDF <Download />
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="reveal-on-scroll mt-6 flex flex-col gap-2 rounded-2xl border border-foreground/15 bg-foreground/[0.035] px-5 py-4 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <span>This section contains every certificate currently published by Modtech.</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand">
              1 verified certificate
            </span>
          </div>
        </div>
      </section>

      <section
        id="valued-customers"
        className="relative overflow-hidden bg-background px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-15" />
        <div className="relative mx-auto max-w-7xl">
          <header className="reveal-on-scroll grid gap-7 border-b border-border pb-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-brand">
                <Handshake className="h-3.5 w-3.5" /> Our valued customers
              </div>
              <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold tracking-[-0.035em] sm:text-5xl">
                Trusted across foundries.
                <span className="block text-gradient-brand">Valued across borders.</span>
              </h2>
            </div>
            <div>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                A legacy built with investment casting specialists, industrial manufacturers,
                research organisations and engineering teams around the world.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" /> 9 original customer panels
                </span>
                <span className="inline-flex items-center gap-2">
                  <Globe2 className="h-3.5 w-3.5 text-brand" /> Global installation base
                </span>
              </div>
            </div>
          </header>

          <div className="reveal-on-scroll mt-8">
            <DragRail
              ariaLabel="Modtech valued customer logo collections"
              className="-mx-2 px-2 sm:-mx-4 sm:px-4"
              step={620}
            >
              {customerPanels.map((panel, index) => (
                <figure
                  key={panel.number}
                  className="group relative w-[86vw] max-w-[42rem] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-card transition duration-500 hover:-translate-y-1 hover:border-brand/50 hover:shadow-deep sm:w-[36rem] sm:p-3"
                >
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img
                      src={panel.image}
                      alt={`Original Modtech valued customer logos, collection ${index + 1} of ${customerPanels.length}`}
                      loading="lazy"
                      className="aspect-[5/3] w-full object-contain transition duration-700 ease-out group-hover:scale-[1.018]"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-4 px-2 pb-1 pt-3 sm:px-3">
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                      Customer portfolio {panel.number}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate-400">
                      Original archive
                    </span>
                  </figcaption>
                </figure>
              ))}
            </DragRail>
          </div>

          <div className="reveal-on-scroll mt-2 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            <MoveHorizontal className="h-3.5 w-3.5 text-brand" /> Drag, swipe or use the arrows to
            explore
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="on-dark relative isolate overflow-hidden border-y border-border bg-carbon px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-80 w-80 rounded-full bg-brand/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-72 w-72 rounded-full bg-cyan/10 blur-[110px]" />

        <div className="mx-auto max-w-7xl">
          <header className="reveal-on-scroll grid gap-7 border-b border-foreground/15 pb-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-brand">
                <Quote className="h-3.5 w-3.5" /> Client testimonials
              </div>
              <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold tracking-[-0.035em] sm:text-5xl">
                Built for production.
                <span className="block text-gradient-brand">Remembered for partnership.</span>
              </h2>
            </div>
            <div>
              <p className="max-w-xl text-sm leading-relaxed text-foreground/60 sm:text-base">
                A preview of how verified customer experiences will appear—clear, credible and
                focused on measurable shop-floor value.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber/30 bg-amber/10 px-3.5 py-2.5 text-xs font-medium text-amber">
                <Sparkles className="h-4 w-4 shrink-0" /> Demo content—replace with approved client
                reviews before launch.
              </div>
            </div>
          </header>
        </div>

        <div className="testimonial-viewport reveal-on-scroll mx-auto mt-9 max-w-[1600px]">
          <div className="testimonial-track">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="testimonial-marquee-group"
                aria-hidden={group === 1 ? true : undefined}
              >
                {demoTestimonials.map((testimonial, index) => (
                  <article key={`${group}-${testimonial.role}`} className="testimonial-card group">
                    <div className="flex items-start justify-between gap-5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand transition duration-500 group-hover:rotate-[-6deg] group-hover:scale-110">
                        <Quote className="h-4 w-4" />
                      </span>
                      <div className="flex gap-1 text-amber" aria-label="Five star demo rating">
                        {Array.from({ length: 5 }, (_, star) => (
                          <Star key={star} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <blockquote className="mt-6 min-h-32 font-display text-[1.02rem] font-medium leading-7 text-foreground/90">
                      “{testimonial.quote}”
                    </blockquote>

                    <footer className="mt-6 flex items-center gap-3 border-t border-foreground/10 pt-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan font-display text-xs font-bold text-carbon shadow-glow">
                        {testimonial.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-sm font-semibold text-foreground">
                          {testimonial.role}
                        </span>
                        <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.16em] text-foreground/45">
                          {testimonial.industry} · Demo review {String(index + 1).padStart(2, "0")}
                        </span>
                      </span>
                    </footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-on-scroll mx-auto mt-5 flex max-w-7xl items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/45">
          <MoveHorizontal className="h-3.5 w-3.5 text-brand" /> Auto-moving preview · Hover to pause
        </div>
      </section>

      <section className="border-y border-border bg-carbon-2">
        <div className="mx-auto max-w-[1600px]">
          <article className="reveal-on-scroll grid lg:grid-cols-2">
            <div className="min-h-[340px] overflow-hidden lg:min-h-[560px]">
              <img
                src={automationImages.casting}
                alt="Investment casting production"
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
              <h2 className="max-w-xl font-display text-3xl font-bold sm:text-5xl">
                From wax pattern to shell room.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                A global leader in wax injectors and shell room automation since 1990. Our
                indigenously developed equipment combines affordability, custom engineering and
                dependable production performance.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-8 w-fit border-brand/40 bg-transparent text-foreground hover:bg-brand hover:text-brand-foreground"
              >
                <a href="/machines">
                  Explore casting machines <ArrowRight />
                </a>
              </Button>
            </div>
          </article>

          <article className="reveal-on-scroll grid border-t border-border lg:grid-cols-2">
            <div className="min-h-[340px] overflow-hidden lg:order-2 lg:min-h-[560px]">
              <img
                src={automationImages.casePacker}
                alt="Modtech robotic case packing system"
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
              <h2 className="max-w-xl font-display text-3xl font-bold sm:text-5xl">
                Turnkey automation for the real factory floor.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                Our 250+ person team builds packaging, handling and process automation for FMCG,
                pharmaceuticals, food and beverages, plastics, foundries and investment casting.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-8 w-fit border-brand/40 bg-transparent text-foreground hover:bg-brand hover:text-brand-foreground"
              >
                <Link to="/solutions">
                  Explore automation solutions <ArrowRight />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-brand px-5 py-16 text-brand-foreground sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="reveal-on-scroll">
            <h2 className="max-w-lg font-display text-3xl font-bold sm:text-5xl">
              Support designed around uptime.
            </h2>
          </div>
          <ul className="reveal-on-scroll grid border-t border-brand-foreground/25 sm:grid-cols-2">
            {promises.map((promise) => (
              <li
                key={promise}
                className="flex gap-4 border-b border-brand-foreground/25 py-6 sm:px-5 sm:odd:border-r"
              >
                <span className="font-display text-base font-semibold leading-snug">{promise}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-10 lg:grid-cols-[0.45fr_1fr] lg:gap-20">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-5xl">
                One accountable engineering team.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                From concept and controls to commissioning and support, every discipline works
                together.
              </p>
            </div>
            <ul className="grid border-l border-t border-border sm:grid-cols-2">
              {capabilities.map((capability) => (
                <li
                  key={capability.t}
                  className="group min-h-44 border-b border-r border-border p-6 transition hover:bg-card sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <capability.Icon className="h-5 w-5 text-brand" />
                  </div>
                  <h3 className="mt-8 font-display text-lg font-semibold group-hover:text-brand">
                    {capability.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {capability.d}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal-on-scroll mt-24 border-y border-border py-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  Chosen by leading manufacturers.
                </h2>
              </div>
              <div className="flex max-w-4xl flex-wrap gap-x-7 gap-y-4 lg:justify-end">
                {partnerCapabilities.map((capability) => (
                  <span
                    key={capability}
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:text-foreground"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal-on-scroll mt-10 border-y border-border py-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {automationPartners.map((partner) => (
                <div
                  key={partner.name}
                  className="grid min-h-20 place-items-center rounded-xl border border-border bg-card p-4"
                >
                  <img
                    src={partner.image}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-8 max-w-[7rem] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-on-scroll mt-20 grid gap-8 border-l-2 border-brand pl-6 sm:pl-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-3xl font-display text-3xl font-bold sm:text-5xl">
                Bring us the production challenge. We&apos;ll engineer the line.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="/contact">
                  Talk to engineering <ArrowUpRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/divisions">
                  View divisions <Check />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
