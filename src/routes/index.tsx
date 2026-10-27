import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Factory, Globe2, Wrench } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { YouTubeBackground } from "@/components/youtube-background";
import { Button } from "@/components/ui/button";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { divisions, stats, type Mode } from "@/content/site-data";
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
      { rel: "preconnect", href: "https://www.youtube.com" },
      { rel: "preconnect", href: "https://www.youtube-nocookie.com" },
      { rel: "preconnect", href: "https://i.ytimg.com" },
      {
        rel: "preload",
        as: "image",
        href: automationImages.palletizer,
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
      <section className="home-hero on-dark relative isolate -mt-28 min-h-[calc(100svh-1rem)] overflow-hidden bg-carbon pt-28 sm:-mt-32 sm:pt-32">
        <YouTubeBackground
          videoId="bd5fXFXLylE"
          title="Future of Smart Factory in India — Modtech Automation"
          className="home-hero-media -z-10"
          fallbackImageSrc={automationImages.palletizer}
          fallbackVideoSrc="/modtech-automation-hero.mp4"
          startAt={15}
          priority
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-carbon via-carbon/80 to-carbon/20" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-transparent to-carbon/40" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20" />

        <div className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl content-center gap-8 px-5 pb-10 pt-10 sm:gap-10 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end lg:pb-16 xl:grid-cols-[minmax(0,1fr)_18rem]">
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
            className="reveal grid grid-cols-3 border border-foreground/15 bg-carbon/65 backdrop-blur-md lg:grid-cols-1"
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

      <section className="bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">
                Our divisions
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Two specialist portfolios.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              Precision casting machinery and integrated factory automation, engineered by one team.
            </p>
          </header>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {divisions.map((division) => {
              const mode: Mode = division.category === "casting" ? "casting" : "robotics";
              return (
                <article
                  key={division.code}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative h-40 overflow-hidden sm:h-48">
                    <img
                      src={division.image}
                      alt={division.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon/85 via-carbon/10 to-transparent" />
                    <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                      {division.code}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
                      {division.tag}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                      {division.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {division.description}
                    </p>
                    <ul className="mt-4 grid grid-cols-2 gap-2">
                      {division.points.slice(0, 4).map((point) => (
                        <li
                          key={point}
                          className="rounded-lg border border-border/70 bg-background/50 px-2.5 py-2 text-xs leading-snug text-foreground/80 sm:px-3"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/machines"
                      search={{ division: mode }}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand"
                    >
                      Explore portfolio <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-background px-5 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            <div>
              <h2 className="max-w-lg font-display text-3xl font-bold sm:text-5xl">
                Engineering, end to end.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                One team from design through commissioning and ongoing support.
              </p>
            </div>
            <ol className="border-t border-border">
              {advantages.map(({ Icon, title, text }) => (
                <li
                  key={title}
                  className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_1fr] sm:gap-4 sm:py-7"
                >
                  <div className="flex items-center sm:block">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold sm:text-2xl">{title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
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

