import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import {
  functionalities,
  categoryMeta,
  machineDivision,
  type Machine,
  type Mode,
} from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { useState } from "react";
import { useSiteContent } from "@/lib/site-content";
import { fetchPublishedMachines } from "@/lib/catalogue";

export const Route = createFileRoute("/machines")({
  head: () => ({
    meta: [
      { title: "Machines & Cells — Modtech Machinery" },
      {
        name: "description",
        content:
          "Browse Modtech's investment-casting equipment, robotic packaging systems, machine tending cells and vision solutions.",
      },
      { property: "og:title", content: "Modtech Machines & Cells" },
      {
        property: "og:description",
        content:
          "Wax injectors, shell-room systems, case handling, palletizing, machine tending and vision solutions.",
      },
    ],
  }),
  component: MachinesRoute,
});

const isCatalogueCutout = (machine: Machine) =>
  machine.image.includes("/productsimg/casting/") && machine.slug !== "automated-shelling-solution";

const usesLightBackdropBlend = (image: string) =>
  image.includes("c-frame-wax-injector") ||
  image.includes("manual-wax-injector") ||
  image.includes("wax-extruder-");

function MachinesPage() {
  useRevealOnScroll();
  const content = useSiteContent("machines");
  const [activeDivision, setActiveDivision] = useState<Mode | null>(null);
  const { data: catalogue } = useQuery({
    queryKey: ["public-machines"],
    queryFn: fetchPublishedMachines,
  });
  const machines = catalogue ?? functionalities;
  const visible = activeDivision
    ? machines.filter((machine) => machineDivision(machine) === activeDivision)
    : machines;
  return (
    <PageShell>
      <PageHero
        kicker={content.eyebrow}
        image={automationImages.palletizer}
        title={
          <>
            {content.title} <span className="text-gradient-brand">{content.accent}</span>
          </>
        }
        subtitle={content.description}
      />

      <section className="relative bg-background py-12 sm:py-16">
        <div className="mx-auto mb-10 max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveDivision(null)}
              aria-pressed={activeDivision === null}
              className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                activeDivision === null
                  ? "border-brand bg-brand text-brand-foreground shadow-glow"
                  : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
              }`}
            >
              All machines
            </button>
            {(["casting", "robotics"] as Mode[]).map((division) => (
              <button
                key={division}
                type="button"
                onClick={() => setActiveDivision(activeDivision === division ? null : division)}
                aria-pressed={activeDivision === division}
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  activeDivision === division
                    ? "border-brand bg-brand text-brand-foreground shadow-glow"
                    : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
                }`}
              >
                {division === "casting" ? "Investment Casting" : "Robotics & Automation"}
              </button>
            ))}
            <span className="ml-auto hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:flex">
              {visible.length} machines
            </span>
          </div>
        </div>

        <div
          className="cat-group relative mx-auto max-w-7xl px-5 sm:px-8"
          data-hover={activeDivision ? "true" : "false"}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((f, idx) => (
              <Link
                key={`${activeDivision ?? "all"}-${f.code}`}
                to="/machines/$slug"
                params={{ slug: f.slug }}
                className="cat-card reveal group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-deep"
                style={{ animationDelay: `${(idx % 6) * 60}ms` }}
                data-active={activeDivision === machineDivision(f) ? "true" : "false"}
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden border-b border-border/70 ${
                    isCatalogueCutout(f) ? "bg-[#f6f7e5]" : "bg-secondary"
                  }`}
                >
                  <img
                    src={f.image}
                    alt={f.title}
                    loading="lazy"
                    className={`h-full w-full transition duration-700 group-hover:scale-[1.035] ${
                      isCatalogueCutout(f)
                        ? `object-contain drop-shadow-[0_18px_18px_rgba(10,30,24,0.16)] ${f.slug === "c-frame-wax-injector" ? "p-0 mix-blend-darken" : `p-5 sm:p-7 ${usesLightBackdropBlend(f.image) ? "mix-blend-darken" : ""}`}`
                        : "object-cover"
                    }`}
                  />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full border border-white/70 bg-carbon/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand shadow-sm backdrop-blur">
                      {f.code}
                    </span>
                    <span className="cat-tag rounded-full border border-white/70 bg-carbon/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/75 shadow-sm backdrop-blur transition">
                      {categoryMeta[f.category].label}
                    </span>
                  </div>
                  {(f.images?.length ?? 0) > 1 && (
                    <span className="absolute bottom-4 right-4 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-carbon shadow-sm backdrop-blur">
                      {f.images?.length} views
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="line-clamp-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-[1.35rem]">
                    {f.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand transition group-hover:gap-3">
                    Know more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function MachinesRoute() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  return normalizedPath === "/machines" ? <MachinesPage /> : <Outlet />;
}
