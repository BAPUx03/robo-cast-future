import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Layers3 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import {
  functionalities,
  categoryMeta,
  modeData,
  machineDivision,
  machineSection,
  productSectionMeta,
  type Machine,
  type Mode,
  type ProductSection,
} from "@/content/site-data";
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

function MachinesPage() {
  useRevealOnScroll();
  const { division: activeDivision } = Route.useSearch();
  const { data: catalogue } = useQuery({
    queryKey: ["public-machines"],
    queryFn: fetchPublishedMachines,
  });
  const machines = catalogue ?? functionalities;

  const division = activeDivision ?? "casting";
  const divisionContent = modeData[division];
  const divisionMachines = machines.filter((machine) => machineDivision(machine) === division);
  const sections = catalogueSections
    .filter((section) => section.division === division)
    .map((section) => ({
      ...section,
      machines: divisionMachines.filter(section.matches),
    }))
    .filter((section) => section.machines.length > 0);

  return (
    <PageShell>
      <section className="catalogue-hero on-dark relative isolate overflow-hidden bg-carbon px-5 py-14 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-20">
          <img
            src={divisionContent.image}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/90 to-carbon/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/35" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl">
          <div className="reveal flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            <Link
              to="/divisions"
              className="inline-flex items-center gap-2 text-foreground/60 transition hover:text-brand"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Divisions
            </Link>
            <span className="text-foreground/25">/</span>
            <span className="text-brand">Step 02 / 02 · Complete catalogue</span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p
                className="reveal font-mono text-[10px] uppercase tracking-[0.28em] text-brand"
                data-reveal-delay="60"
              >
                {divisionContent.kicker}
              </p>
              <h1
                className="reveal mt-3 max-w-4xl font-display text-[clamp(2.5rem,5.5vw,5.7rem)] font-bold leading-[0.96] tracking-[-0.04em]"
                data-reveal-delay="110"
              >
                {categoryMeta[division].label}
                <span className="block text-gradient-brand">machines & systems.</span>
              </h1>
              <p
                className="reveal mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-lg"
                data-reveal-delay="170"
              >
                {divisionContent.description}
              </p>
            </div>
            <div
              className="reveal flex items-center gap-4 border-l border-brand/35 pl-5 lg:mb-1"
              data-reveal-delay="220"
            >
              <span className="font-display text-5xl font-bold text-brand sm:text-6xl">
                {divisionMachines.length.toString().padStart(2, "0")}
              </span>
              <span className="max-w-24 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-foreground/55">
                Products in this division
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-background py-12 sm:py-16">
        <div className="mx-auto mb-12 max-w-7xl px-5 sm:px-8">
          <div className="reveal-on-scroll rounded-2xl border border-border bg-card/65 p-4 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Layers3 className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold">Browse by product family</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Every {categoryMeta[division].label.toLowerCase()} product is shown below.
                </p>
              </div>
            </div>
            <Link
              to="/divisions"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-brand/60 hover:text-brand sm:mt-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change division
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <section aria-labelledby={`${division}-division-heading`}>
            <h2 id={`${division}-division-heading`} className="sr-only">
              {categoryMeta[division].label} product catalogue
            </h2>
            <div className="space-y-14 sm:space-y-20">
              {sections.map((section, sectionIndex) => (
                <section key={section.id} id={section.id} data-machine-section={section.id}>
                  <div className="reveal-on-scroll mb-6 grid gap-3 border-b border-border pb-5 sm:grid-cols-[auto_1fr_auto] sm:items-end sm:gap-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                      {(sectionIndex + 1).toString().padStart(2, "0")}
                    </span>
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
      className="cat-card reveal-on-scroll group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-deep"
      data-reveal-delay={(index % 6) * 70}
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
