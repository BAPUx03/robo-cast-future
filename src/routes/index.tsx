import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, Factory, Globe2, Wrench } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { HomeHeroBackground } from "@/components/home-hero-background";
import { Button } from "@/components/ui/button";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { stats, type Mode } from "@/content/site-data";
import { useSiteContent } from "@/lib/site-content";
import { automationPartners, automationImages } from "@/content/automation-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Modtech | Casting Machinery & Robotic Automation" },
      {
        name: "description",
        content:
          "Modtech engineers investment casting machinery and customised robotic automation systems for manufacturers worldwide.",
      },
      { property: "og:title", content: "Modtech | Casting Machinery & Robotic Automation" },
      {
        property: "og:description",
        content:
          "Investment casting machinery and customised robotic automation systems, engineered and built in India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: "/modtech-home-poster.webp",
      },
    ],
  }),
  component: HomePage,
});

const advantages = [
  {
    Icon: Factory,
    title: "Indigenous development",
    text: "Machines, robot cells, controls and custom tooling developed by Modtech's engineering team in India.",
  },
  {
    Icon: Wrench,
    title: "Customised turnkey systems",
    text: "Complete solutions configured around the product, plant layout, throughput and safety requirements.",
  },
  {
    Icon: Globe2,
    title: "Worldwide support",
    text: "Ethernet-enabled remote support and service capability for installations across more than 45 countries.",
  },
];

function HomePage() {
  useRevealOnScroll();
  const content = useSiteContent("home");

  return (
    <PageShell>
      <section className="home-hero on-dark relative isolate overflow-hidden bg-carbon lg:-mt-[4.5rem] lg:min-h-svh lg:pt-[4.5rem]">
        <div className="relative isolate aspect-video w-full overflow-hidden lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
          <HomeHeroBackground />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-carbon via-carbon/80 to-carbon/20 lg:block" />
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-t from-carbon via-transparent to-carbon/40 lg:block" />
        <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-grid opacity-20 lg:block" />

        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-8 sm:gap-10 sm:px-8 lg:min-h-[calc(100svh-4.5rem)] lg:content-center lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end lg:pb-16 lg:pt-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 max-w-4xl">
            <h1
              className="reveal max-w-4xl font-display text-[clamp(2.2rem,7vw,6rem)] font-bold leading-[1.02] sm:leading-[0.98]"
              style={{ animationDelay: "80ms" }}
            >
              {content.title}
              <span className="mt-2 block text-brand">{content.accent}</span>
            </h1>
            <p
              className="reveal mt-5 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:mt-7 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              {content.description}
            </p>
            <div
              className="reveal mt-7 flex flex-wrap gap-3 max-[420px]:flex-col sm:mt-8"
              style={{ animationDelay: "240ms" }}
            >
              <Button
                asChild
                size="lg"
                className="h-12 px-6 font-mono text-xs uppercase tracking-wider max-[420px]:w-full"
              >
                <Link to="/divisions">
                  {content.primary_cta} <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-foreground/30 bg-carbon/50 px-6 font-mono text-xs uppercase tracking-wider backdrop-blur hover:border-brand hover:bg-carbon/80 hover:text-brand max-[420px]:w-full"
              >
                <Link to="/about" hash="solutions">
                  {content.secondary_cta} <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>

          <dl
            className="reveal grid grid-cols-3 border border-foreground/15 bg-carbon/40 lg:grid-cols-1 lg:bg-carbon/65 lg:backdrop-blur-md"
            style={{ animationDelay: "320ms" }}
          >
            {stats.slice(0, 3).map((item) => (
              <div
                key={item.label}
                className="min-w-0 border-r border-foreground/15 p-3 last:border-r-0 sm:p-5 lg:border-b lg:border-r-0 lg:last:border-b-0"
              >
                <dd className="font-display text-xl font-bold text-brand sm:text-3xl">
                  {item.value}
                </dd>
                <dt className="mt-1 break-words font-mono text-[9px] uppercase leading-snug tracking-[0.06em] text-foreground/70 sm:tracking-[0.18em]">
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-background px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <header className="reveal-on-scroll border-b border-border pb-7 sm:pb-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">
              Our divisions
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Precision foundry machinery. Factory automation.
            </h2>
          </header>

          <div className="mt-9 space-y-16 sm:mt-12 sm:space-y-24">
            <DivisionChapter
              title="Investment Casting Machinery"
              description="Equipment for wax preparation and injection, ceramic shell building and foundry processing, engineered for repeatable production and dependable uptime."
              image={automationImages.casting}
              alt="Investment casting machinery on the factory floor"
              division="casting"
              linkLabel="View casting machines"
              points={[
                "Wax injectors",
                "Wax conditioning systems",
                "Slurry equipment",
                "Rain sanders & shelling cells",
              ]}
            />
            <DivisionChapter
              title="Robotics & Automation"
              description="Custom robot cells for packaging, palletizing, pick-and-place and vision inspection, built around each product, process and factory layout."
              image={automationImages.casePacker}
              alt="Robotic automation cell in production"
              division="robotics"
              linkLabel="Explore automation"
              points={[
                "Robotic case erecting & packing",
                "Robotic palletizing",
                "Pick & place",
                "Vision systems",
              ]}
              reverse
            />
          </div>
        </div>
      </section>
      <section className="bg-background px-5 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h2 className="max-w-lg font-display text-4xl font-bold sm:text-6xl">
                Engineering that stays accountable.
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
                From the first layout to commissioning and after-sales support, one engineering
                partner owns the complete system.
              </p>
            </div>
            <ol className="border-t border-border">
              {advantages.map(({ Icon, title, text }) => (
                <li
                  key={title}
                  className="grid gap-4 border-b border-border py-7 sm:grid-cols-[4rem_1fr] sm:py-9"
                >
                  <div className="flex items-center sm:block">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold">{title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-carbon-2 px-5 py-14 sm:px-8 sm:py-20">
        <div className="reveal-on-scroll mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-5xl">
                Global production experience.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                More than 1,000 projects delivered across 45+ countries, including work with 10+
                Fortune 500 customers.
              </p>
            </div>
            <div className="space-y-8">
              <ProofRow
                label="Official integration partners"
                items={automationPartners.map((partner) => partner.name)}
              />
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Every solution is engineered around your product, line layout, throughput and
                operating environment—from first concept through commissioning and lifecycle
                support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function DivisionChapter({
  title,
  description,
  image,
  alt,
  division,
  linkLabel,
  points,
  reverse = false,
}: {
  title: string;
  description: string;
  image: string;
  alt: string;
  division: Mode;
  linkLabel: string;
  points: string[];
  reverse?: boolean;
}) {
  return (
    <article className="reveal-on-scroll grid gap-8 lg:grid-cols-12 lg:items-center">
      <div
        className={`home-image-reveal relative min-h-[22rem] overflow-hidden sm:min-h-[32rem] lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}
      >
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="home-machine-image absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className={`lg:col-span-5 ${reverse ? "lg:order-1 lg:pr-10" : "lg:pl-10"}`}>
        <h3 className="font-display text-3xl font-bold sm:text-5xl">{title}</h3>
        <p className="mt-5 leading-relaxed text-muted-foreground">{description}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 shrink-0 text-brand" />
              {point}
            </li>
          ))}
        </ul>
        <Button
          asChild
          variant="link"
          className="mt-7 h-auto p-0 font-mono text-xs uppercase tracking-wider"
        >
          <Link to="/machines" search={{ division }}>
            {linkLabel} <ArrowRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function ProofRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
        {items.map((item) => (
          <span
            key={item}
            className="font-display text-sm font-semibold text-foreground/80 sm:text-base"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
