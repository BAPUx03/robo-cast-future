import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Anchor,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Car,
  Droplets,
  Factory,
  Globe2,
  Hammer,
  Headphones,
  HeartPulse,
  MoveHorizontal,
  Pill,
  Plane,
  Settings2,
  Shield,
  ShoppingBasket,
  Sprout,
  TrainFront,
  Wrench,
  Zap,
} from "lucide-react";
import { DragRail } from "@/components/drag-rail";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { stats } from "@/content/site-data";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { isAboutPhotoUrl, parseAboutFieldGallery } from "@/lib/about-field-gallery";
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
    links: [{ rel: "preload", as: "image", href: "/modtech-about-video-poster.webp" }],
  }),
  component: AboutPage,
});

const story = [
  {
    code: "01",
    year: "1990",
    title: "Investment casting roots",
    body: "Modtech began by building investment casting machinery around real foundry requirements.",
  },
  {
    code: "02",
    year: "Today",
    title: "Two engineering divisions",
    body: "Casting machinery and robotic automation now work together under one accountable team.",
  },
  {
    code: "03",
    year: "Next",
    title: "Production that keeps improving",
    body: "Maintainable systems, practical controls and lifecycle upgrades protect long-term output.",
  },
];

const commitments = [
  {
    title: "Engineered in-house",
    description: "Mechanical, electrical and controls teams work together in Ahmedabad.",
    Icon: Factory,
  },
  {
    title: "Delivered worldwide",
    description: "Commissioning and remote support for installations across 45+ countries.",
    Icon: Globe2,
  },
  {
    title: "Supported for life",
    description: "Spares, service and upgrades remain connected after production begins.",
    Icon: Headphones,
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
  { name: "Defence", Icon: Shield, desc: "Mission-critical castings and specialised hardware." },
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
  { name: "Industrial Tooling", Icon: Wrench, desc: "Tool steels, jigs and production fixturing." },
  { name: "Marine", Icon: Anchor, desc: "Propulsion, valves and seawater-grade hardware." },
  {
    name: "Agricultural Equipment",
    Icon: Sprout,
    desc: "Wear-resistant cast components for demanding field use.",
  },
];

const certification = {
  standard: "ISO 9001:2015",
  system: "Quality Management System",
  certificateNumber: "IN260718008",
  validThrough: "17 July 2029",
  document: "/certifications/modtech-iso-9001-2015.pdf",
} as const;

function IndustryCard({
  industry,
  index,
}: {
  industry: (typeof servedIndustries)[number];
  index: number;
}) {
  return (
    <article
      className="reveal-on-scroll group flex min-h-44 w-[78vw] max-w-[18rem] shrink-0 snap-start flex-col justify-between rounded-2xl border border-foreground/10 bg-card p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/50 sm:w-[18rem]"
      data-reveal-delay={(index % 4) * 110 + 80}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
          <industry.Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-6">
        <h3 className="font-display text-xl font-bold leading-tight transition-colors group-hover:text-brand">
          {industry.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {industry.desc}
        </p>
      </div>
    </article>
  );
}

function IndustriesRail() {
  return (
    <div className="mt-7">
      <DragRail
        ariaLabel="Industries served by Modtech"
        controlsPlacement="below"
        className="-mx-1 px-1 sm:-mx-2 sm:px-2"
      >
        {servedIndustries.map((industry, index) => (
          <IndustryCard key={industry.name} industry={industry} index={index} />
        ))}
      </DragRail>
      <p className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        <MoveHorizontal className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        Browse in groups · drag, swipe or use the arrows
      </p>
    </div>
  );
}

function AboutPage() {
  useRevealOnScroll();
  const content = useSiteContent("about");
  const industriesContent = useSiteContent("industries");
  const fieldPhotos = parseAboutFieldGallery(content).filter((photo) =>
    isAboutPhotoUrl(photo.image_url),
  );

  return (
    <PageShell>
      <section className="home-hero on-dark relative isolate overflow-hidden border-b border-border bg-carbon lg:min-h-[680px]">
        <div className="relative isolate aspect-video w-full overflow-hidden lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
          <HeroVideoBackground
            videoSrc="/modtech-about-automation.mp4"
            posterSrc="/modtech-about-video-poster.webp"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent lg:hidden" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-carbon via-carbon/90 to-carbon/20 lg:block" />
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-t from-carbon via-transparent to-carbon/55 lg:block" />
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-grid opacity-15 lg:block" />

        <div className="mx-auto flex max-w-7xl flex-col justify-between px-5 pb-8 pt-8 sm:px-8 sm:pb-10 lg:min-h-[680px] lg:pt-16">
          <div className="max-w-4xl">
            <p
              className="reveal font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-brand"
              style={{ animationDelay: "40ms" }}
            >
              {content.eyebrow.replace(/^\/\s*/, "")}
            </p>
            <h1
              className="reveal mt-4 max-w-5xl font-display text-[clamp(2.4rem,7vw,6.2rem)] font-bold leading-[1.01] tracking-[-0.035em] sm:leading-[0.96]"
              style={{ animationDelay: "100ms" }}
            >
              {content.title} <span className="text-gradient-brand">{content.accent}</span>
            </h1>
            <p
              className="reveal mt-5 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:mt-7 sm:text-lg"
              style={{ animationDelay: "170ms" }}
            >
              {content.description}
            </p>
            <div
              className="reveal mt-7 flex flex-wrap gap-3 max-[420px]:flex-col"
              style={{ animationDelay: "230ms" }}
            >
              <Button asChild size="lg" className="max-[420px]:w-full">
                <Link to="/divisions">
                  Explore our divisions <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground/25 bg-carbon/45 backdrop-blur hover:border-brand hover:bg-carbon/70 hover:text-brand max-[420px]:w-full"
              >
                <Link to="/contact" search={{ machine: undefined }}>
                  Talk to engineering <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>

          <dl className="reveal mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border border-foreground/15 bg-carbon/55 backdrop-blur-md lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-r border-foreground/10 p-4 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 sm:p-5 lg:border-b-0 lg:border-r lg:even:border-r lg:last:border-r-0"
              >
                <dd className="font-display text-3xl font-bold text-brand sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/55">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                Our story
              </p>
              <h2 className="mt-3 max-w-lg font-display text-3xl font-bold leading-tight sm:text-5xl">
                Built around real production since 1990.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                We started with investment casting machinery and grew into an integrated engineering
                company for robotic automation. The principle stayed the same: make production
                dependable, maintainable and easier to improve.
              </p>
            </div>

            <ol className="border-t border-border" aria-label="Modtech company story">
              {story.map((item) => (
                <li
                  key={item.code}
                  className="group grid gap-3 border-b border-border py-5 sm:grid-cols-[4rem_7rem_minmax(0,1fr)] sm:items-start sm:gap-5"
                >
                  <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-brand">
                    {item.code}
                  </span>
                  <span className="font-display text-sm font-semibold text-foreground">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-brand sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <ul className="reveal-on-scroll mt-10 grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-3">
            {commitments.map(({ title, description, Icon }, index) => (
              <li
                key={title}
                className="border-b border-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {fieldPhotos.length > 0 && (
        <section className="overflow-hidden border-y border-border bg-carbon-2 px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <header className="reveal-on-scroll grid gap-4 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-12">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                  Inside Modtech
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
                  Engineering in action.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
                The people, project reviews and factory-floor work behind every commissioned system.
              </p>
            </header>

            <div className="mt-8">
              <DragRail
                ariaLabel="Modtech people and project photos"
                step="item"
                controlsPlacement="below"
                className="-mx-1 px-1 sm:-mx-2 sm:px-2"
              >
                {fieldPhotos.map((photo, index) => (
                  <figure
                    key={photo.id}
                    className="field-story-card group flex w-[82vw] max-w-[22rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-deep sm:w-[23rem] lg:w-[26rem]"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={photo.image_url}
                        alt={photo.alt_text}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-carbon/70 px-3 py-1.5 font-mono text-[9px] text-white backdrop-blur-md">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(fieldPhotos.length).padStart(2, "0")}
                      </span>
                    </div>
                    <figcaption className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-semibold">{photo.title}</h3>
                      {photo.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {photo.description}
                        </p>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </DragRail>
              <p className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                <MoveHorizontal className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                Drag, swipe or use the arrows
              </p>
            </div>
          </div>
        </section>
      )}

      <section
        id="industries"
        className="overflow-hidden border-b border-border bg-background px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <header className="reveal-on-scroll grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.65fr)] lg:items-end lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                  {industriesContent.eyebrow.replace(/^\/\s*/, "")}
                </p>
                <span className="h-px w-8 bg-brand/50" aria-hidden="true" />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  14 sectors
                </span>
              </div>
              <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.025em]">
                {industriesContent.title}{" "}
                <span className="text-gradient-brand">{industriesContent.accent}</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
              {industriesContent.description}
            </p>
          </header>

          <IndustriesRail />
        </div>
      </section>

      <section
        id="global-presence"
        className="on-dark relative isolate overflow-hidden border-b border-border bg-carbon px-5 py-14 sm:px-8 sm:py-16"
      >
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

        <div className="mx-auto flex min-h-[320px] max-w-7xl items-center">
          <div className="reveal-on-scroll max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-carbon/55 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-brand backdrop-blur-md">
              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" /> Global presence
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5.5vw,5.75rem)] font-bold leading-[0.98] tracking-[-0.04em]">
              Expanding horizons.
              <span className="block text-gradient-brand">Engineering without borders.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/70 sm:text-lg">
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
        className="border-b border-border bg-carbon-2 px-5 py-10 sm:px-8 sm:py-14"
      >
        <div className="mx-auto max-w-7xl">
          <article className="reveal-on-scroll grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-10">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                <BadgeCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                Certified quality
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                Quality you can verify.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Our quality management system supports consistent engineering, documentation and
                delivery across both Modtech divisions.
              </p>
            </div>

            <div className="border-t border-border pt-6 lg:min-w-[22rem]">
              <h3 className="font-display text-2xl font-bold">{certification.standard}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{certification.system}</p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Certificate {certification.certificateNumber} · Valid through{" "}
                {certification.validThrough}
              </p>
              <div className="mt-5">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={certification.document} target="_blank" rel="noopener noreferrer">
                    View certificate <ArrowUpRight />
                  </a>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="reveal-on-scroll mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-12">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
              Start a conversation
            </p>
            <h2 className="mt-3 max-w-4xl font-display text-3xl font-bold leading-tight sm:text-5xl">
              Bring us the production challenge. We&apos;ll engineer the line.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              From the first layout to commissioning and long-term support, one team stays
              accountable for the complete system.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 max-[460px]:flex-col">
            <Button asChild size="lg">
              <Link to="/contact" search={{ machine: undefined }}>
                Talk to engineering <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/divisions">
                View divisions <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
