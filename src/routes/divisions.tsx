import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Factory } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { YouTubeBackground } from "@/components/youtube-background";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { divisions, functionalities, machineDivision, type Mode } from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";
import { fetchPublishedMachines } from "@/lib/catalogue";

export const Route = createFileRoute("/divisions")({
  head: () => ({
    meta: [
      { title: "Divisions — Robotics & Investment Casting | Modtech Machine" },
      {
        name: "description",
        content:
          "Choose between Modtech's Robotics & Automation and Investment Casting divisions, then explore every machine in that portfolio.",
      },
      { property: "og:title", content: "Modtech Divisions — Robotics & Casting" },
      {
        property: "og:description",
        content: "Choose a division to explore its complete machine portfolio.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://www.youtube.com" },
      { rel: "preconnect", href: "https://www.youtube-nocookie.com" },
    ],
  }),
  component: DivisionsPage,
});

const divisionIcons = {
  casting: Factory,
  robotics: Bot,
} satisfies Record<Mode, typeof Factory>;

const divisionVideos = {
  casting: {
    videoId: "Ah5mS5PDqwQ",
    title: "Modtech AutoMode — Fully Automatic Wax Injection Machine",
    startAt: 0,
  },
  robotics: {
    videoId: "bd5fXFXLylE",
    title: "Future of Smart Factory in India — Modtech Automation",
    startAt: 15,
  },
} satisfies Record<Mode, { videoId: string; title: string; startAt: number }>;

function DivisionsPage() {
  useRevealOnScroll();
  const content = useSiteContent("divisions");
  const description = content.description.startsWith("Each division ships a complete portfolio")
    ? "Choose a division to see its machines and systems."
    : content.description;
  const { data: catalogue } = useQuery({
    queryKey: ["public-machines"],
    queryFn: fetchPublishedMachines,
  });
  const machines = catalogue ?? functionalities;

  return (
    <PageShell>
      <section className="division-hero on-dark relative isolate overflow-hidden bg-carbon px-5 py-10 sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute inset-0 -z-20">
          <img
            src={automationImages.robot6Axis}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/95 to-carbon/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/30" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-25" />
        <div className="pointer-events-none absolute -right-32 top-0 -z-10 h-96 w-96 rounded-full bg-brand/15 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="reveal font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            Modtech divisions
          </p>
          <h1 className="reveal mt-3 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-5xl">
            Choose your division.
          </h1>
          <p className="reveal mt-3 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base">
            Explore investment casting machines or robotics and automation systems.
          </p>
        </div>
      </section>

      <section
        id="division-selector"
        className="relative scroll-mt-20 bg-background px-5 py-10 sm:scroll-mt-24 sm:px-8 sm:py-14"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-20" />
        <div className="relative mx-auto max-w-7xl">
          <header className="reveal-on-scroll mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="max-w-2xl font-display text-2xl font-bold leading-tight sm:text-4xl">
                {content.title} <span className="text-brand">{content.accent}</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-right">
              {description}
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            {divisions.map((division, index) => {
              const mode = division.category as Mode;
              const Icon = divisionIcons[mode];
              const backgroundVideo = divisionVideos[mode];
              const machineCount = machines.filter(
                (machine) => machineDivision(machine) === mode,
              ).length;

              return (
                <Link
                  key={division.code}
                  to="/machines"
                  search={{ division: mode }}
                  aria-label={`Open all ${division.title} machines`}
                  className="division-choice-card reveal-on-scroll group relative isolate flex min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  data-reveal-delay={index * 140}
                >
                  <YouTubeBackground
                    videoId={backgroundVideo.videoId}
                    title={backgroundVideo.title}
                    className="division-choice-media -z-20"
                    fallbackImageSrc={division.image}
                    startAt={backgroundVideo.startAt}
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-carbon/15 via-carbon/50 to-carbon" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-carbon/65 via-transparent to-transparent" />
                  <div className="division-choice-grid pointer-events-none absolute inset-0 -z-10 bg-grid opacity-0" />

                  <div className="flex w-full flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-carbon/55 text-brand shadow-lg backdrop-blur-md">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full border border-white/20 bg-carbon/55 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                        {division.code}
                      </span>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-brand">
                        <span>{division.tag}</span>
                        <span className="h-px flex-1 bg-brand/35" />
                      </div>
                      <h3 className="max-w-lg font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                        {division.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                        {division.description}
                      </p>

                      <ul
                        className="mt-6 flex flex-wrap gap-2"
                        aria-label={`${division.title} capabilities`}
                      >
                        {division.points.slice(0, 4).map((point) => (
                          <li
                            key={point}
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 backdrop-blur"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/15 pt-6">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                          {machineCount} machines & systems
                        </span>
                        <span className="division-choice-cta inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-foreground shadow-glow">
                          Explore all <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
