import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import {
  functionalities,
  categoryMeta,
  machineDivision,
  machineSection,
  productSectionMeta,
  type Machine,
  type Mode,
  type ProductSection,
} from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";
import { fetchPublishedMachines } from "@/lib/catalogue";

export const Route = createFileRoute("/machines")({
  validateSearch: (search: Record<string, unknown>): { division?: Mode } => ({
    division:
      search.division === "casting" || search.division === "robotics" ? search.division : undefined,
  }),
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

type CatalogueSection = {
  id: ProductSection;
  division: Mode;
  title: string;
  description: string;
  matches: (machine: Machine) => boolean;
};

const catalogueSectionOrder: ProductSection[] = [
  "wax-injection-machines",
  "wax-processing-conditioning",
  "wax-room-automation",
  "shelling-solutions",
  "ceramic-injectors",
  "fettling-equipment",
  "end-of-line-packaging",
  "flexible-industrial-automation",
];

const catalogueSections: CatalogueSection[] = catalogueSectionOrder.map((id) => ({
  id,
  division: productSectionMeta[id].division,
  title: productSectionMeta[id].label,
  description: productSectionMeta[id].description,
  matches: (machine) => machineSection(machine) === id,
}));

const divisionOrder: Mode[] = ["casting", "robotics"];

function MachinesPage() {
  useRevealOnScroll();
  const content = useSiteContent("machines");
  const { division: activeDivision } = Route.useSearch();
  const { data: catalogue } = useQuery({
    queryKey: ["public-machines"],
    queryFn: fetchPublishedMachines,
  });
  const machines = catalogue ?? functionalities;
  const visible = activeDivision
    ? machines.filter((machine) => machineDivision(machine) === activeDivision)
    : machines;
  const visibleDivisions = activeDivision ? [activeDivision] : divisionOrder;
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
            <Link
              to="/machines"
              search={{ division: undefined }}
              aria-pressed={!activeDivision}
              className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                !activeDivision
                  ? "border-brand bg-brand text-brand-foreground shadow-glow"
                  : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
              }`}
            >
              All machines
            </Link>
            {(["casting", "robotics"] as Mode[]).map((division) => (
              <Link
                key={division}
                to="/machines"
                search={{ division }}
                aria-pressed={activeDivision === division}
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  activeDivision === division
                    ? "border-brand bg-brand text-brand-foreground shadow-glow"
                    : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
                }`}
              >
                {division === "casting" ? "Investment Casting" : "Robotics & Automation"}
              </Link>
            ))}
            <span className="ml-auto hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:flex">
              {visible.length} machines
            </span>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl space-y-16 px-5 sm:px-8 sm:space-y-20">
          {visibleDivisions.map((division) => {
            const divisionMachines = visible.filter(
              (machine) => machineDivision(machine) === division,
            );
            const sections = catalogueSections
              .filter((section) => section.division === division)
              .map((section) => ({
                ...section,
                machines: divisionMachines.filter(section.matches),
              }))
              .filter((section) => section.machines.length > 0);

            return (
              <section key={division} aria-labelledby={`${division}-division-heading`}>
                <header className="mb-8 border-b border-border pb-6 sm:flex sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">
                      Product division
                    </p>
                    <h2
                      id={`${division}-division-heading`}
                      className="mt-3 font-display text-3xl font-bold sm:text-5xl"
                    >
                      {categoryMeta[division].label}
                    </h2>
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:mt-0">
                    {divisionMachines.length} products
                  </p>
                </header>

                <div className="space-y-12 sm:space-y-16">
                  {sections.map((section) => (
                    <section key={section.id} data-machine-section={section.id}>
                      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                            {section.title}
                          </h3>
                          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {section.machines.length} products
                        </span>
                      </div>
                      <div className="cat-group grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {section.machines.map((machine, index) => (
                          <MachineCard
                            key={machine.slug}
                            machine={machine}
                            index={index}
                            activeDivision={activeDivision}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

function MachineCard({
  machine,
  index,
  activeDivision,
}: {
  machine: Machine;
  index: number;
  activeDivision?: Mode;
}) {
  return (
    <Link
      to="/machines/$slug"
      params={{ slug: machine.slug }}
      className="cat-card reveal group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-deep"
      style={{ animationDelay: `${(index % 6) * 60}ms` }}
      data-active={activeDivision === machineDivision(machine) ? "true" : "false"}
      data-machine-division={machineDivision(machine)}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden border-b border-border/70 ${
          isCatalogueCutout(machine) ? "bg-[#f6f7e5]" : "bg-secondary"
        }`}
      >
        <img
          src={machine.image}
          alt={machine.title}
          loading="lazy"
          className={`h-full w-full transition duration-700 group-hover:scale-[1.035] ${
            isCatalogueCutout(machine)
              ? `object-contain drop-shadow-[0_18px_18px_rgba(10,30,24,0.16)] ${machine.slug === "c-frame-wax-injector" ? "p-0 mix-blend-darken" : `p-5 sm:p-7 ${usesLightBackdropBlend(machine.image) ? "mix-blend-darken" : ""}`}`
              : "object-cover"
          }`}
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full border border-white/70 bg-carbon/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand shadow-sm backdrop-blur">
            {machine.code}
          </span>
          <span className="cat-tag rounded-full border border-white/70 bg-carbon/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/75 shadow-sm backdrop-blur transition">
            {categoryMeta[machineDivision(machine)].label}
          </span>
        </div>
        {(machine.images?.length ?? 0) > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-carbon shadow-sm backdrop-blur">
            {machine.images?.length} views
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h4 className="line-clamp-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-[1.35rem]">
          {machine.title}
        </h4>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {machine.desc}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand transition group-hover:gap-3">
          Know more <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function MachinesRoute() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  return normalizedPath === "/machines" ? <MachinesPage /> : <Outlet />;
}
