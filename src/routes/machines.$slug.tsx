import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  CircleGauge,
  ClipboardCheck,
  Cpu,
  Factory,
  ImageOff,
  Layers3,
  MoveHorizontal,
  Ruler,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import type { MachineSpecificationTable } from "@/content/official-machine-specifications";
import {
  categoryMeta,
  machineDivision,
  machineSection,
  productSectionMeta,
  type Machine,
} from "@/content/site-data";
import { fetchPublishedMachines } from "@/lib/catalogue";

const isCatalogueCutout = (machine: Machine) =>
  machine.image.includes("/productsimg/casting/") && machine.slug !== "automated-shelling-solution";

const usesLightBackdropBlend = (image: string) =>
  image.includes("c-frame-wax-injector") ||
  image.includes("manual-wax-injector") ||
  image.includes("wax-extruder-");

const preferredPrimarySpecs = [
  "model",
  "variant",
  "clamp force",
  "capacity",
  "mould envelope",
  "wax flow",
  "robot platform",
  "robot",
];

const preferredControlSpecs = ["control", "operation", "mode", "software", "configuration"];

const heroSpecIcons = [CircleGauge, Ruler, Cpu, Activity];

const detailNavigation = [
  { target: "overview", label: "Overview", icon: Activity },
  { target: "models", label: "Models & range", icon: Layers3 },
  { target: "features", label: "Key features", icon: Sparkles },
  { target: "applications", label: "Applications", icon: Factory },
  { target: "specifications", label: "Specifications", icon: ClipboardCheck },
];

function useActiveDetailSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "overview");
  const sectionKey = sectionIds.join("|");

  useEffect(() => {
    const elements = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry) setActiveSection(visibleEntry.target.id);
      },
      { rootMargin: "-24% 0px -62% 0px", threshold: [0, 0.15, 0.4] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
    // sectionKey captures the stable list without retriggering on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  return activeSection;
}

function preferredSpec(machine: Machine, labels: string[]) {
  for (const label of labels) {
    const match = machine.specs.find((spec) => spec.label.toLowerCase() === label);
    if (match) return match;
  }
  return machine.specs[0];
}

function rangeCopy(sectionId: ReturnType<typeof machineSection>, exactVariants: boolean) {
  if (exactVariants) {
    return {
      eyebrow: "Available variants",
      title: "Choose the right version for your installation.",
      description:
        "Compare the available versions of this machine, then open a model for its complete gallery and specification.",
    };
  }

  if (sectionId === "wax-injection-machines" || sectionId === "ceramic-injectors") {
    return {
      eyebrow: "Model range",
      title: "Compare machines in this product family.",
      description:
        "Each model is engineered around a different tooling envelope, production volume and automation requirement.",
    };
  }

  if (sectionId === "end-of-line-packaging" || sectionId === "flexible-industrial-automation") {
    return {
      eyebrow: "System configurations",
      title: "Explore systems for the complete production line.",
      description:
        "Select a system to compare its process role, control platform and typical applications.",
    };
  }

  return {
    eyebrow: "Product range",
    title: "Explore equipment for this process stage.",
    description:
      "Compare the available equipment and open any product for its detailed configuration.",
  };
}

export const Route = createFileRoute("/machines/$slug")({
  loader: async ({ params }) => {
    const catalogue = await fetchPublishedMachines();
    const machine = catalogue.find((item) => item.slug === params.slug);
    if (!machine) throw notFound();
    return { machine, catalogue };
  },
  head: ({ loaderData }) => {
    const m = loaderData?.machine;
    const title = m ? `${m.title} — Modtech Machine` : "Machine — Modtech Machine";
    const desc = m?.tagline ?? "Engineered machinery for casting and automation lines.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(m?.image ? [{ property: "og:image", content: m.image } as const] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl font-bold">Machine not found</h1>
        <p className="mt-3 text-muted-foreground">The machine you’re looking for doesn’t exist.</p>
        <Link
          to="/divisions"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow"
        >
          <ArrowLeft className="h-4 w-4" /> Back to machines
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          {error instanceof Error ? error.message : "Unable to load this machine right now."}
        </p>
      </div>
    </PageShell>
  ),
  component: MachineDetail,
});

function MachineDetail() {
  useRevealOnScroll();
  const { machine: m, catalogue } = Route.useLoaderData() as {
    machine: Machine;
    catalogue: Machine[];
  };
  const division = machineDivision(m);
  const sectionId = machineSection(m);
  const section = productSectionMeta[sectionId];
  const isExactVariantFamily = m.slug.startsWith("wax-extruder-");
  const modelRange = catalogue.filter((item) =>
    isExactVariantFamily
      ? item.slug.startsWith("wax-extruder-")
      : machineSection(item) === sectionId,
  );
  const modelRangeCopy = rangeCopy(sectionId, isExactVariantFamily);
  const relatedPool = catalogue.filter(
    (item) => item.slug !== m.slug && machineDivision(item) === division,
  );
  const related = [
    ...relatedPool.filter((item) => machineSection(item) === machineSection(m)),
    ...relatedPool.filter((item) => machineSection(item) !== machineSection(m)),
  ].slice(0, 3);
  const navigationItems = detailNavigation
    .filter((item) => item.target !== "models" || modelRange.length > 1)
    .map((item) =>
      item.target === "models" && isExactVariantFamily ? { ...item, label: "Variants" } : item,
    );
  const activeSection = useActiveDetailSection(navigationItems.map((item) => item.target));
  const quickSpecs = m.specs.slice(0, 4);
  const specificationModelCount = m.specificationTables?.[0]?.columns.length ?? 0;
  const specificationParameterCount =
    m.specificationTables?.reduce((total, specificationTable) => {
      return total + specificationTable.rows.length;
    }, 0) ?? m.specs.length;

  return (
    <PageShell>
      <section className="relative isolate overflow-hidden bg-carbon">
        <div className="pointer-events-none absolute inset-0 -z-10">
          {m.image && (
            <img
              src={m.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-25 blur-2xl"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/85 via-carbon/85 to-carbon" />
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          <div className="reveal-on-scroll">
            <Link
              to="/machines"
              search={{ division }}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-brand transition hover:gap-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All machines
            </Link>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-md bg-brand px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-foreground shadow-glow">
                {m.code}
              </span>
              <span className="rounded-md border border-border bg-card/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {categoryMeta[division].label}
              </span>
              {modelRange.length > 1 && (
                <a
                  href="#models"
                  className="rounded-md border border-brand/30 bg-brand/[0.08] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand transition hover:border-brand/60 hover:bg-brand/[0.14]"
                >
                  {modelRange.length} {isExactVariantFamily ? "variants" : "models"}
                </a>
              )}
            </div>
            <p className="mt-7 inline-flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-soft">
              <Sparkles className="h-3.5 w-3.5" /> Engineered around your process
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[4.25rem]">
              {m.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {m.tagline}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]"
              >
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground transition hover:border-brand/50 hover:text-brand"
              >
                Talk to engineering <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {quickSpecs.length > 0 && (
              <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
                {quickSpecs.map((spec, index) => {
                  const SpecIcon = heroSpecIcons[index % heroSpecIcons.length];
                  return (
                    <div
                      key={spec.label}
                      className="group rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/[0.06]"
                    >
                      <div className="flex items-center gap-2 text-brand">
                        <SpecIcon className="h-3.5 w-3.5" />
                        <dt className="truncate font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                          {spec.label}
                        </dt>
                      </div>
                      <dd className="mt-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
                        {spec.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </div>

          <MachineGallery key={m.slug} machine={m} />
        </div>
      </section>

      <nav className="sticky top-[4.5rem] z-20 border-y border-border bg-background/92 px-5 shadow-[0_12px_30px_-22px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:gap-2">
          {navigationItems.map(({ target, label, icon: NavigationIcon }, index) => (
            <a
              key={target}
              href={`#${target}`}
              aria-current={activeSection === target ? "location" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 transition duration-300 sm:px-4 ${
                activeSection === target
                  ? "border-brand/40 bg-brand/10 text-brand shadow-[0_0_24px_-12px_var(--brand)]"
                  : "border-transparent hover:border-border hover:bg-card/60 hover:text-foreground"
              }`}
            >
              <NavigationIcon className="h-3.5 w-3.5" />
              <span className="text-brand">0{index + 1}</span>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section className="relative overflow-hidden bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-brand/[0.05] blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <section id="overview" className="scroll-mt-36 reveal-on-scroll">
            <div className="grid gap-8 pb-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                  01 / Overview
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Engineered for repeatable production.
                </h2>
              </div>
              <div>
                <p className="text-base leading-8 text-muted-foreground sm:text-lg">{m.desc}</p>
                <a
                  href={`/machines?division=${division}#${sectionId}`}
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand transition hover:gap-3"
                >
                  <Layers3 className="h-3.5 w-3.5" /> {section.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </section>

          {modelRange.length > 1 && (
            <section id="models" className="scroll-mt-36 border-y border-border py-14">
              <div className="reveal-on-scroll grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                    02 / {modelRangeCopy.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                    {modelRangeCopy.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {modelRangeCopy.description}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/55 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    <Layers3 className="h-3.5 w-3.5 text-brand" /> {section.label}
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  <div className="overflow-x-auto">
                    <table className="min-w-[46rem] w-full border-collapse text-left">
                      <thead className="border-b border-border bg-secondary/35">
                        <tr className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                          <th className="px-4 py-3 font-medium" scope="col">
                            Model / equipment
                          </th>
                          <th className="px-4 py-3 font-medium" scope="col">
                            Primary specification
                          </th>
                          <th className="px-4 py-3 font-medium" scope="col">
                            Control / configuration
                          </th>
                          <th className="px-4 py-3 text-right font-medium" scope="col">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {modelRange.map((model) => {
                          const primary = preferredSpec(model, preferredPrimarySpecs);
                          const control = preferredSpec(model, preferredControlSpecs);
                          const current = model.slug === m.slug;
                          return (
                            <tr
                              key={model.slug}
                              className={`transition ${
                                current ? "bg-brand/[0.08]" : "hover:bg-brand/[0.04]"
                              }`}
                            >
                              <th className="px-4 py-3.5" scope="row">
                                <span className="flex items-center gap-3">
                                  <span className="h-10 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-[#f6f7e5]">
                                    {model.image ? (
                                      <img
                                        src={model.image}
                                        alt=""
                                        loading="lazy"
                                        className={`h-full w-full object-contain p-1 ${
                                          usesLightBackdropBlend(model.image)
                                            ? "mix-blend-darken"
                                            : ""
                                        }`}
                                      />
                                    ) : (
                                      <span className="grid h-full w-full place-items-center bg-secondary text-brand/70">
                                        <ImageOff className="h-4 w-4" aria-hidden />
                                      </span>
                                    )}
                                  </span>
                                  <span>
                                    <span className="block font-display text-sm font-semibold text-foreground">
                                      {model.title}
                                    </span>
                                    <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.14em] text-brand">
                                      {model.code}
                                      {current ? " · Current model" : ""}
                                    </span>
                                  </span>
                                </span>
                              </th>
                              <td className="px-4 py-3.5 text-xs text-foreground/85">
                                {primary ? (
                                  <>
                                    <span className="block text-[10px] text-muted-foreground">
                                      {primary.label}
                                    </span>
                                    <span className="font-medium">{primary.value}</span>
                                  </>
                                ) : (
                                  "Project specific"
                                )}
                              </td>
                              <td className="px-4 py-3.5 text-xs text-foreground/85">
                                {control ? (
                                  <>
                                    <span className="block text-[10px] text-muted-foreground">
                                      {control.label}
                                    </span>
                                    <span className="font-medium">{control.value}</span>
                                  </>
                                ) : (
                                  "Application specific"
                                )}
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                {current ? (
                                  <span className="inline-flex rounded-full bg-brand px-3 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-brand-foreground">
                                    Selected
                                  </span>
                                ) : (
                                  <Link
                                    to="/machines/$slug"
                                    params={{ slug: model.slug }}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-brand/35 px-3 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-brand transition hover:bg-brand hover:text-brand-foreground"
                                  >
                                    View model <ArrowRight className="h-3 w-3" />
                                  </Link>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-border bg-secondary/20 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                    Final model, utilities, tooling and safety package are confirmed against the
                    approved project requirement.
                  </div>
                </div>
              </div>
            </section>
          )}

          <section id="features" className="scroll-mt-36 py-14">
            <div className="reveal-on-scroll flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Settings2 className="h-4 w-4" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                  03 / Key features
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                  Built around the process.
                </h2>
              </div>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {m.highlights.map((highlight, index) => (
                <div
                  key={highlight}
                  className="reveal-on-scroll group relative overflow-hidden rounded-2xl border border-border bg-card/65 p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/45"
                  data-reveal-delay={(index % 4) * 65}
                >
                  <span className="absolute right-4 top-3 font-display text-4xl font-bold text-brand/[0.07] transition group-hover:text-brand/[0.13]">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                  <p className="relative mt-7 text-sm font-medium leading-relaxed text-foreground/90">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="applications" className="scroll-mt-36 border-y border-border py-14">
            <div className="reveal-on-scroll grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                  04 / Applications
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Where this machine fits.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Typical use cases for this platform. Tooling, handling and controls are engineered
                  around the approved production requirement.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {m.applications.map((application, index) => (
                  <li
                    key={application}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground/90 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/[0.05]"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-brand/20 bg-brand/10 text-brand transition group-hover:scale-105 group-hover:border-brand/40">
                      {index % 2 === 0 ? (
                        <Factory className="h-3.5 w-3.5" />
                      ) : (
                        <Boxes className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.14em] text-brand/75">
                        Application {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="mt-0.5 block font-medium">{application}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="specifications" className="scroll-mt-36 pt-14">
            <div
              className={`reveal-on-scroll gap-8 ${
                m.specificationTables?.length
                  ? "block"
                  : "grid lg:grid-cols-[0.72fr_1.28fr] lg:gap-16"
              }`}
            >
              <div
                className={
                  m.specificationTables?.length
                    ? "grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
                    : undefined
                }
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand shadow-[0_0_28px_-14px_var(--brand)]">
                      <ClipboardCheck className="h-5 w-5" />
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                      05 / Technical specifications
                    </p>
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    {specificationModelCount > 1
                      ? "Every model. Every critical detail."
                      : "Complete published machine details."}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Compare machine capacity, controls, utilities and available options in one
                    verified view. Final configuration is confirmed against the approved project
                    datasheet.
                  </p>
                </div>

                {m.specificationTables?.length ? (
                  <dl className="grid grid-cols-3 gap-2 lg:min-w-[27rem]">
                    {[
                      { value: specificationModelCount, label: "Models", icon: Layers3 },
                      {
                        value: specificationParameterCount,
                        label: "Parameters",
                        icon: SlidersHorizontal,
                      },
                      {
                        value: m.specificationTables.length,
                        label: "Data groups",
                        icon: ShieldCheck,
                      },
                    ].map(({ value, label, icon: MetricIcon }) => {
                      return (
                        <div
                          key={label}
                          className="rounded-xl border border-border bg-card/70 px-3 py-3 text-center shadow-card"
                        >
                          <MetricIcon className="mx-auto h-4 w-4 text-brand" />
                          <dd className="mt-2 font-display text-xl font-bold text-foreground">
                            {String(value).padStart(2, "0")}
                          </dd>
                          <dt className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                            {label}
                          </dt>
                        </div>
                      );
                    })}
                  </dl>
                ) : null}
              </div>

              {m.specificationTables?.length ? (
                <div className="mt-8 space-y-6">
                  {m.specificationTables.map((specificationTable, index) => (
                    <SpecificationTableCard
                      key={specificationTable.title}
                      specificationTable={specificationTable}
                      index={index}
                    />
                  ))}

                  <div className="rounded-2xl border border-brand/25 bg-brand/[0.06] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Need the approved specification for your tooling and utilities?
                    </p>
                    <Link
                      to="/contact"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5 sm:mt-0"
                    >
                      Request datasheet <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  <div className="hidden overflow-x-auto sm:block">
                    <table className="min-w-full border-collapse text-left">
                      <thead className="border-b border-border bg-secondary/35">
                        <tr className="font-mono text-[9px] uppercase tracking-[0.17em] text-muted-foreground">
                          <th className="w-14 px-5 py-3 font-medium" scope="col">
                            No.
                          </th>
                          <th className="px-5 py-3 font-medium" scope="col">
                            Technical parameter
                          </th>
                          <th className="px-5 py-3 text-right font-medium" scope="col">
                            Standard / published value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {m.specs.map((spec, index) => (
                          <tr key={spec.label} className="transition hover:bg-brand/[0.04]">
                            <td className="px-5 py-4 font-mono text-[9px] text-brand/70">
                              {(index + 1).toString().padStart(2, "0")}
                            </td>
                            <th
                              scope="row"
                              className="px-5 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.17em] text-muted-foreground"
                            >
                              {spec.label}
                            </th>
                            <td className="px-5 py-4 text-right font-display text-sm font-semibold text-foreground">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <dl className="divide-y divide-border sm:hidden">
                    {m.specs.map((spec, index) => (
                      <div
                        key={spec.label}
                        className={`px-4 py-4 ${index % 2 === 1 ? "bg-secondary/[0.12]" : "bg-card"}`}
                      >
                        <dt className="flex items-center gap-2 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          <span className="grid h-6 w-6 place-items-center rounded-md border border-brand/20 bg-brand/10 text-brand">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {spec.label}
                        </dt>
                        <dd className="mt-2 pl-8 font-display text-base font-semibold leading-relaxed text-foreground">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="border-t border-border bg-secondary/25 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Need the approved project specification?
                      </p>
                      {m.officialSourceUrl && (
                        <a
                          href={m.officialSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-brand transition hover:gap-2"
                        >
                          Official product reference <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <Link
                      to="/contact"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5 sm:mt-0"
                    >
                      Request datasheet <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative bg-carbon px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  More from {categoryMeta[division].label.toLowerCase()}.
                </h2>
              </div>
              <Link
                to="/machines"
                search={{ division }}
                className="hidden font-mono text-[11px] uppercase tracking-wider text-brand hover:gap-3 sm:inline-flex sm:items-center sm:gap-2"
              >
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/machines/$slug"
                  params={{ slug: r.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-brand/60"
                >
                  <div
                    className={`relative aspect-[16/10] overflow-hidden border-b border-border/70 ${isCatalogueCutout(r) ? "bg-[#f6f7e5]" : "bg-secondary"}`}
                  >
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.title}
                        loading="lazy"
                        className={`h-full w-full transition duration-700 group-hover:scale-105 ${isCatalogueCutout(r) ? `object-contain drop-shadow-[0_14px_14px_rgba(10,30,24,0.14)] ${r.slug === "c-frame-wax-injector" ? "p-0 mix-blend-darken" : `p-5 ${usesLightBackdropBlend(r.image) ? "mix-blend-darken" : ""}`}` : "object-cover"}`}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-secondary via-background to-secondary p-5 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageOff className="h-7 w-7 text-brand/70" aria-hidden />
                          <span className="font-mono text-[8px] uppercase tracking-[0.16em]">
                            Official image unavailable
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-brand">
                      {r.code}
                    </div>
                    <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {r.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}

function SpecificationTableCard({
  specificationTable,
  index,
}: {
  specificationTable: MachineSpecificationTable;
  index: number;
}) {
  const normalizedTitle = specificationTable.title.toLowerCase();
  const TableIcon = normalizedTitle.includes("optional")
    ? Wrench
    : normalizedTitle.includes("control")
      ? SlidersHorizontal
      : CircleGauge;

  return (
    <article
      className="reveal-on-scroll overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-500 hover:border-brand/30 hover:shadow-deep"
      data-reveal-delay={Math.min(index * 90, 180)}
    >
      <header className="relative overflow-hidden border-b border-border bg-gradient-to-r from-secondary/60 via-secondary/25 to-brand/[0.08] px-4 py-4 sm:px-6 sm:py-5">
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full border border-brand/15" />
        <div className="pointer-events-none absolute -right-8 -top-12 h-28 w-28 rounded-full border border-brand/10" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand shadow-[0_0_24px_-12px_var(--brand)]">
              <TableIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {specificationTable.title}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[8px] uppercase tracking-[0.15em] text-muted-foreground sm:text-[9px]">
                <span className="inline-flex items-center gap-1.5 text-brand">
                  <ShieldCheck className="h-3 w-3" /> Verified model data
                </span>
                <span>{specificationTable.rows.length} parameters</span>
              </p>
            </div>
          </div>
          {specificationTable.sourceUrl ? (
            <a
              href={specificationTable.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/35 bg-background/20 px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-brand transition duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-brand-foreground"
            >
              Official product page <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-brand/[0.08] px-3.5 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-brand">
              Master document verified <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        <div className="relative mt-4 flex gap-2 overflow-x-auto pb-1">
          {specificationTable.columns.map((column, columnIndex) => (
            <span
              key={column}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background/35 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-foreground/85"
            >
              <span className="text-brand">{String(columnIndex + 1).padStart(2, "0")}</span>
              {column}
            </span>
          ))}
        </div>
      </header>

      <div className="border-b border-border bg-carbon/55 px-4 py-2.5 md:hidden">
        <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-carbon-foreground/70">
          <MoveHorizontal className="h-3.5 w-3.5 text-brand" /> All model values shown below
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table
          className={`w-full border-collapse text-left ${
            specificationTable.columns.length > 2 ? "min-w-[68rem]" : "min-w-[44rem]"
          }`}
        >
          <thead>
            <tr className="border-b border-border bg-carbon text-carbon-foreground">
              <th
                scope="col"
                className="sticky left-0 z-20 min-w-64 border-r border-white/10 bg-carbon px-5 py-4 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-brand" /> Technical parameter
                </span>
              </th>
              {specificationTable.columns.map((column, columnIndex) => (
                <th
                  key={column}
                  scope="col"
                  className="min-w-44 border-r border-white/10 px-4 py-4 text-center last:border-r-0"
                >
                  <span className="block font-mono text-[8px] font-medium uppercase tracking-[0.14em] text-brand">
                    Model {String(columnIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block font-display text-sm font-bold">{column}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {specificationTable.rows.map((row, rowIndex) => {
              const rowBackground = rowIndex % 2 === 1 ? "bg-secondary/[0.13]" : "bg-card";
              return (
                <tr
                  key={row.label}
                  className={`${rowBackground} group transition duration-200 hover:bg-brand/[0.055]`}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 min-w-64 border-r border-border bg-inherit px-5 py-3.5 font-mono text-[9px] font-medium uppercase leading-relaxed tracking-[0.1em] text-muted-foreground transition duration-200"
                  >
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 text-[8px] text-brand/70">
                        {String(rowIndex + 1).padStart(2, "0")}
                      </span>
                      {row.label}
                    </span>
                  </th>
                  {row.values.map((value, valueIndex) => (
                    <td
                      key={`${row.label}-${specificationTable.columns[valueIndex]}`}
                      className="border-r border-border/70 px-4 py-3.5 text-center text-xs font-medium leading-relaxed text-foreground/90 last:border-r-0"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-border md:hidden">
        {specificationTable.rows.map((row, rowIndex) => (
          <section
            key={row.label}
            className={`px-4 py-4 ${rowIndex % 2 === 1 ? "bg-secondary/[0.12]" : "bg-card"}`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-brand/20 bg-brand/10 font-mono text-[8px] font-semibold text-brand">
                {String(rowIndex + 1).padStart(2, "0")}
              </span>
              <h4 className="font-mono text-[9px] font-semibold uppercase leading-relaxed tracking-[0.11em] text-foreground/80">
                {row.label}
              </h4>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2">
              {row.values.map((value, valueIndex) => (
                <div
                  key={`${row.label}-${specificationTable.columns[valueIndex]}`}
                  className="min-w-0 rounded-lg border border-border bg-background/35 px-3 py-2.5"
                >
                  <dt className="truncate font-mono text-[7px] uppercase tracking-[0.1em] text-brand">
                    {specificationTable.columns[valueIndex]}
                  </dt>
                  <dd className="mt-1.5 break-words text-[11px] font-semibold leading-relaxed text-foreground/90">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {specificationTable.note && (
        <div className="flex gap-3 border-t border-border bg-amber/[0.055] px-4 py-4 sm:px-6">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Configuration note: </span>
            {specificationTable.note}
          </p>
        </div>
      )}
    </article>
  );
}

function MachineGallery({ machine }: { machine: Machine }) {
  const images = (machine.images?.length ? machine.images : [machine.image]).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="machine-gallery-orbit reveal-on-scroll grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-card via-background to-secondary p-8 text-center shadow-deep"
        data-reveal-delay="120"
      >
        <div className="flex max-w-xs flex-col items-center gap-4 text-muted-foreground">
          <ImageOff className="h-12 w-12 text-brand/70" aria-hidden />
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
              Official image unavailable
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              No genuine machine photograph was supplied in the source documents or published on the
              legacy website.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];
  const isCastingImage = activeImage.includes("/productsimg/casting/");

  return (
    <div
      className="machine-gallery-orbit reveal-on-scroll relative overflow-hidden rounded-3xl border border-brand/20 bg-card shadow-deep"
      data-reveal-delay="120"
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden ${isCastingImage ? "bg-[#f6f7e5]" : "bg-secondary"}`}
      >
        <img
          key={activeImage}
          src={activeImage}
          alt={`${machine.title} — view ${activeIndex + 1}`}
          className={`machine-image-enter h-full w-full ${isCastingImage ? `object-contain drop-shadow-[0_20px_20px_rgba(10,30,24,0.16)] ${machine.slug === "c-frame-wax-injector" ? "p-0 mix-blend-darken" : `p-6 sm:p-10 ${usesLightBackdropBlend(activeImage) ? "mix-blend-darken" : ""}`}` : "object-cover"}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/35 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-carbon/75 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-carbon-foreground backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-brand" /> Product visual
        </span>
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
              aria-label="Show previous product view"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-carbon/80 text-carbon-foreground backdrop-blur transition hover:border-brand hover:bg-brand hover:text-brand-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <span className="rounded-full border border-white/20 bg-carbon/80 px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-carbon-foreground backdrop-blur">
              {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
              aria-label="Show next product view"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-carbon/80 text-carbon-foreground backdrop-blur transition hover:border-brand hover:bg-brand hover:text-brand-foreground"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="border-t border-border bg-card/95 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Product views
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-brand">
              Select an angle
            </span>
          </div>
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            aria-label={`${machine.title} image gallery`}
          >
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${machine.title} view ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border bg-[#f6f7e5] transition duration-300 sm:h-20 sm:w-24 ${
                  activeIndex === index
                    ? "border-brand opacity-100 ring-2 ring-brand/30 shadow-[0_0_22px_-10px_var(--brand)]"
                    : "border-border opacity-60 hover:-translate-y-0.5 hover:border-brand/60 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full object-contain p-1 ${usesLightBackdropBlend(image) ? "mix-blend-darken" : ""}`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {images.length === 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-border bg-card/95 px-4 py-3">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted-foreground">
            Representative machine configuration
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.13em] text-brand">
            <ShieldCheck className="h-3 w-3" /> Verified product
          </span>
        </div>
      )}
    </div>
  );
}
