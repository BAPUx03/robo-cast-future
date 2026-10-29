import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Anchor,
  BadgeCheck,
  Bot,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Eye,
  Globe2,
  Hammer,
  Handshake,
  HeartPulse,
  Layers,
  LifeBuoy,
  MoveHorizontal,
  Pill,
  Plane,
  Pause,
  Play,
  Quote,
  Settings2,
  Shield,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Sprout,
  Star,
  TrainFront,
  Droplets,
  Zap,
  Wrench,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { DragRail } from "@/components/drag-rail";
import { Button } from "@/components/ui/button";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { stats, partnerCapabilities, processSteps } from "@/content/site-data";
import { automationImages, automationPartners } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";
import { isAboutPhotoUrl, parseAboutFieldGallery } from "@/lib/about-field-gallery";

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
    links: [
      {
        rel: "preload",
        as: "image",
        href: "/modtech-about-video-poster.webp",
      },
    ],
  }),
  component: AboutPage,
});

const story = [
  {
    year: "1990",
    title: "Engineering starts in-house.",
    body: "We began with investment casting machinery and still design around real production needs.",
  },
  {
    year: "45+ countries",
    title: "Built in India. Working worldwide.",
    body: "Our machines support manufacturers across more than 45 countries, backed by commissioning and service.",
  },
  {
    year: "Future ready",
    title: "Designed to keep improving.",
    body: "Practical controls, maintainable systems and ongoing upgrades help production stay ready for what comes next.",
  },
];

const servedIndustries = [
  {
    name: "Pharma",
    Icon: Pill,
    desc: "Robotic handling, packing and inspection for pharmaceutical production lines.",
  },
  {
    name: "FMCG",
    Icon: ShoppingBasket,
    desc: "High-speed case packing, palletizing and end-of-line automation.",
  },
  { name: "Automotive", Icon: Car, desc: "Engine, drivetrain and chassis components at scale." },
  {
    name: "Aerospace",
    Icon: Plane,
    desc: "Turbine cores, blades and high-precision airframe parts.",
  },
  { name: "Defence", Icon: Shield, desc: "Mission-critical castings and armour-grade hardware." },
  { name: "Energy & Power", Icon: Zap, desc: "Turbine, generator and switchgear components." },
  {
    name: "Oil & Gas",
    Icon: Droplets,
    desc: "Valves, fittings and corrosion-resistant assemblies.",
  },
  {
    name: "Heavy Engineering",
    Icon: Hammer,
    desc: "Large-format castings and structural hardware.",
  },
  { name: "Pumps & Valves", Icon: Settings2, desc: "Precision-cast bodies, impellers and seats." },
  {
    name: "Medical",
    Icon: HeartPulse,
    desc: "Orthopaedic and surgical-grade investment castings.",
  },
  { name: "Railways", Icon: TrainFront, desc: "Bogie, brake and traction-grade components." },
  { name: "Industrial Tooling", Icon: Wrench, desc: "Tool steels, jigs and fixturing." },
  { name: "Marine", Icon: Anchor, desc: "Propulsion, valves and seawater-grade hardware." },
  {
    name: "Agricultural Equipment",
    Icon: Sprout,
    desc: "Wear-resistant cast components for the field.",
  },
];

const INDUSTRIES_PER_PAGE = 4;

function IndustryCard({ industry }: { industry: (typeof servedIndustries)[number] }) {
  return (
    <li className="rounded-xl border border-border bg-card p-3 shadow-card sm:rounded-2xl sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand sm:h-10 sm:w-10 sm:rounded-xl">
          <industry.Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </span>
        <h3 className="font-display text-sm font-bold leading-tight sm:text-lg">{industry.name}</h3>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-snug text-muted-foreground sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-relaxed">
        {industry.desc}
      </p>
    </li>
  );
}

function IndustriesGallery() {
  const [page, setPage] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [paused, setPaused] = useState(false);
  const pageCount = Math.ceil(servedIndustries.length / INDUSTRIES_PER_PAGE);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoAdvance(mobile.matches && !reducedMotion.matches);
    update();
    mobile.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!autoAdvance || paused) return;
    const timer = window.setInterval(() => setPage((current) => (current + 1) % pageCount), 5500);
    return () => window.clearInterval(timer);
  }, [autoAdvance, paused, pageCount]);

  const goToPage = (next: number) => {
    setPaused(true);
    setPage((next + pageCount) % pageCount);
  };

  return (
    <>
      <div className="mt-5 sm:hidden">
        <ul
          key={page}
          className="grid grid-cols-2 auto-rows-fr gap-2.5 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
        >
          {servedIndustries
            .slice(page * INDUSTRIES_PER_PAGE, (page + 1) * INDUSTRIES_PER_PAGE)
            .map((industry) => (
              <IndustryCard key={industry.name} industry={industry} />
            ))}
        </ul>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {String(page + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            {autoAdvance && (
              <button
                type="button"
                onClick={() => setPaused((current) => !current)}
                aria-label={paused ? "Play industry slides" : "Pause industry slides"}
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {paused ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              aria-label="Previous industries"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              aria-label="Next industries"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <ul className="mt-6 hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {servedIndustries.map((industry) => (
          <IndustryCard key={industry.name} industry={industry} />
        ))}
      </ul>
    </>
  );
}

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

const certification = {
  standard: "ISO 9001:2015",
  system: "Quality Management System",
  certificateNumber: "IN260718008",
  validThrough: "17 July 2029",
  document: "/certifications/modtech-iso-9001-2015.pdf",
} as const;

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
  const fieldPhotos = parseAboutFieldGallery(content).filter((photo) =>
    isAboutPhotoUrl(photo.image_url),
  );
  const processContent = useSiteContent("process");
  const industriesContent = useSiteContent("industries");

  return (
    <PageShell>
      <section className="on-dark relative isolate overflow-hidden border-b border-border bg-carbon lg:min-h-[640px]">
        <div className="relative isolate aspect-video w-full overflow-hidden lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
          <HeroVideoBackground
            videoSrc="/modtech-about-automation.mp4"
            posterSrc="/modtech-about-video-poster.webp"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-carbon via-carbon/90 to-carbon/20 lg:block" />
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-t from-carbon via-transparent to-carbon/40 lg:block" />
        <div className="mx-auto flex max-w-7xl flex-col justify-between px-5 pb-8 pt-8 sm:px-8 sm:pb-10 lg:min-h-[640px] lg:pt-16">
          <h1 className="reveal max-w-5xl font-display text-[clamp(2.25rem,7vw,6.2rem)] font-bold leading-[1.02] sm:leading-[0.96]">
            {content.title} <span className="text-brand">{content.accent}</span>
          </h1>

          <dl className="mt-8 grid grid-cols-2 border-y border-border/70 bg-carbon/30 lg:grid-cols-4 lg:bg-carbon/55 lg:backdrop-blur-md">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-border/70 px-4 py-4 sm:px-6 lg:border-r lg:last:border-r-0"
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

      <section className="bg-background px-5 py-9 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-5 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] lg:gap-10">
            <div>
              <h2 className="max-w-sm font-display text-3xl font-bold leading-tight sm:text-4xl">
                Built for production since 1990.
              </h2>
            </div>
            <ol className="border-t border-border">
              {story.map((item) => (
                <li
                  key={item.year}
                  className="group grid gap-1.5 border-b border-border py-3.5 sm:grid-cols-[125px_1fr] sm:items-start sm:gap-4 sm:py-4"
                >
                  <span className="font-display text-sm font-semibold text-foreground sm:text-base">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold transition group-hover:text-brand sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {fieldPhotos.length > 0 && (
        <section className="border-y border-border bg-carbon-2 px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <header className="mb-6 grid gap-3 sm:mb-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                  Modtech in the field
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">
                  Engineering in action.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
                A closer look at the people, machines and partnerships behind our work.
              </p>
            </header>
            <DragRail
              ariaLabel="Modtech people and project photos"
              step="item"
              controlsPlacement="below"
              className="-mx-1 px-1 sm:-mx-2 sm:px-2"
            >
              {fieldPhotos.map((photo, index) => (
                <figure
                  key={photo.id}
                  style={{ animationDelay: `${Math.min(index, 5) * 75}ms` }}
                  className="field-story-card group flex w-[78vw] max-w-[21rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-colors duration-300 hover:border-brand/50 hover:shadow-deep sm:w-[22rem] lg:w-[25rem]"
                >
                  <div className="overflow-hidden">
                    <img
                      src={photo.image_url}
                      alt={photo.alt_text}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-[1.045] motion-reduce:transition-none"
                    />
                  </div>
                  <figcaption className="flex flex-1 flex-col p-4 sm:p-5">
                    <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-brand">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(fieldPhotos.length).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold">{photo.title}</h3>
                    {photo.description && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {photo.description}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </DragRail>
            <p className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              <MoveHorizontal className="h-3.5 w-3.5 text-brand" aria-hidden="true" /> Swipe, drag
              or use the arrows
            </p>
          </div>
        </section>
      )}

      <section
        id="process"
        className="border-y border-border bg-carbon-2 px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <header className="reveal-on-scroll grid gap-4 border-b border-border pb-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end lg:gap-12">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                {processContent.eyebrow.replace(/^\/\s*/, "")}
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.5rem)] font-bold leading-[1.08] tracking-tight">
                {processContent.title} <span className="text-brand">{processContent.accent}</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
              {processContent.description}
            </p>
          </header>

          <ol
            className="mt-6 grid gap-3 min-[520px]:grid-cols-2 xl:grid-cols-3"
            aria-label="Engineering delivery process"
          >
            {processSteps.map((step) => (
              <li
                key={step.code}
                className="reveal-on-scroll rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm font-semibold text-brand">{step.code}</span>
                  <step.Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{step.name}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="industries" className="bg-background px-5 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <header className="reveal-on-scroll grid gap-4 border-b border-border pb-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end lg:gap-12">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                {industriesContent.eyebrow.replace(/^\/\s*/, "")}
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.5rem)] font-bold leading-[1.08] tracking-tight">
                {industriesContent.title}{" "}
                <span className="text-brand">{industriesContent.accent}</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
              {industriesContent.description}
            </p>
          </header>

          <IndustriesGallery />
        </div>
      </section>

      <section className="on-dark relative isolate min-h-[420px] overflow-hidden border-y border-border bg-carbon px-5 py-12 sm:px-8 sm:py-16">
        <img
          src={automationImages.facility}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover md:hidden"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 hidden h-full w-full object-cover md:block"
        >
          <source
            src="/modtech-global-map.mp4"
            type="video/mp4"
            media="(min-width: 48rem) and (prefers-reduced-motion: no-preference)"
          />
        </video>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-carbon via-carbon/90 to-carbon/35" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-carbon/90 via-transparent to-carbon/65" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-15" />

        <div className="mx-auto flex min-h-[300px] max-w-7xl items-center">
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
        className="on-dark border-y border-border bg-carbon px-5 py-9 sm:px-8 sm:py-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll mb-5 sm:mb-7">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
              Certified quality
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
              Quality you can verify.
            </h2>
          </div>

          <article className="reveal-on-scroll grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 rounded-2xl border border-foreground/15 bg-card p-4 shadow-card sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:p-6">
            <div className="grid h-14 w-14 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand sm:h-16 sm:w-16">
              <BadgeCheck className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold sm:text-2xl">
                {certification.standard}
              </h3>
              <p className="mt-0.5 text-sm text-foreground/70">{certification.system}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Certificate {certification.certificateNumber} · Valid through{" "}
                {certification.validThrough}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="col-span-2 w-full border-brand/40 sm:col-auto sm:w-auto"
            >
              <a href={certification.document} target="_blank" rel="noopener noreferrer">
                View certificate <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </article>
        </div>
      </section>

      <section
        id="valued-customers"
        className="relative overflow-hidden bg-background px-5 py-12 sm:px-8 sm:py-16"
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
        className="on-dark relative isolate overflow-hidden border-y border-border bg-carbon px-5 py-12 sm:px-8 sm:py-16"
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
            <div className="min-h-[260px] overflow-hidden lg:min-h-[420px]">
              <img
                src={automationImages.casting}
                alt="Investment casting production"
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12">
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
            <div className="min-h-[260px] overflow-hidden lg:order-2 lg:min-h-[420px]">
              <img
                src={automationImages.casePacker}
                alt="Modtech robotic case packing system"
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12">
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
                <Link to="/machines" search={{ division: "robotics" }}>
                  Explore automation machines <ArrowRight />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-background px-5 py-9 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-5 lg:grid-cols-[0.4fr_1fr] lg:gap-10">
            <div>
              <h2 className="max-w-md font-display text-2xl font-bold leading-tight sm:text-4xl">
                One accountable engineering team.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Design, controls, commissioning and support under one roof.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {capabilities.map((capability) => (
                <li
                  key={capability.t}
                  className="group rounded-xl border border-border bg-card p-3 transition-colors hover:border-brand/50 sm:p-4"
                >
                  <capability.Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-2 font-display text-sm font-semibold leading-tight group-hover:text-brand sm:text-base">
                    {capability.t}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm sm:leading-relaxed">
                    {capability.d}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal-on-scroll mt-9 border-y border-border py-5">
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

          <div className="reveal-on-scroll mt-12 grid gap-6 border-l-2 border-brand pl-6 sm:pl-10 lg:grid-cols-[1fr_auto] lg:items-end">
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
