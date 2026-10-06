import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Layers3,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
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
        ...(m ? [{ property: "og:image", content: m.image } as const] : []),
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
        <p className="mt-3 text-muted-foreground">{error.message}</p>
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
  const relatedPool = catalogue.filter(
    (item) => item.slug !== m.slug && machineDivision(item) === division,
  );
  const related = [
    ...relatedPool.filter((item) => machineSection(item) === machineSection(m)),
    ...relatedPool.filter((item) => machineSection(item) !== machineSection(m)),
  ].slice(0, 3);

  return (
    <PageShell>
      <section className="relative isolate overflow-hidden bg-carbon">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img
            src={m.image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-25 blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/85 via-carbon/85 to-carbon" />
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_1fr]">
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
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
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
          </div>

          <MachineGallery key={m.slug} machine={m} />
        </div>
      </section>

      <nav className="sticky top-[4.5rem] z-20 border-y border-border bg-background/90 px-5 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto py-3 font-mono text-[9px] uppercase tracking-[0.17em] text-muted-foreground sm:gap-8">
          {[
            ["overview", "Overview"],
            ["features", "Key features"],
            ["applications", "Applications"],
            ["specifications", "Specifications"],
          ].map(([target, label], index) => (
            <a
              key={target}
              href={`#${target}`}
              className="inline-flex shrink-0 items-center gap-2 transition hover:text-brand"
            >
              <span className="text-brand">0{index + 1}</span> {label}
            </a>
          ))}
        </div>
      </nav>

      <section className="relative overflow-hidden bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-brand/[0.05] blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <section id="overview" className="scroll-mt-36 reveal-on-scroll">
            <div className="grid gap-8 border-b border-border pb-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
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

          <section id="features" className="scroll-mt-36 py-14">
            <div className="reveal-on-scroll flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Settings2 className="h-4 w-4" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                  02 / Key features
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
                  03 / Applications
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
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground/90"
                  >
                    <span className="font-mono text-[9px] font-semibold text-brand">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    {application}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="specifications" className="scroll-mt-36 pt-14">
            <div className="reveal-on-scroll grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <ClipboardCheck className="h-4 w-4" />
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                    04 / Technical specifications
                  </p>
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">
                  Configuration at a glance.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Values shown describe the standard or published platform. Final capacity,
                  utilities and safety configuration are confirmed against the approved client
                  requirement and project datasheet.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <dl className="divide-y divide-border">
                  {m.specs.map((spec, index) => (
                    <div
                      key={spec.label}
                      className="grid gap-1 px-5 py-4 transition hover:bg-brand/[0.04] sm:grid-cols-[2.5rem_1fr_1.2fr] sm:items-center sm:gap-4"
                    >
                      <span className="hidden font-mono text-[9px] text-brand/70 sm:block">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.17em] text-muted-foreground">
                        {spec.label}
                      </dt>
                      <dd className="font-display text-sm font-semibold text-foreground sm:text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-border bg-secondary/25 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Need the approved project specification?
                  </p>
                  <Link
                    to="/contact"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5 sm:mt-0"
                  >
                    Request datasheet <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
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
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      className={`h-full w-full transition duration-700 group-hover:scale-105 ${isCatalogueCutout(r) ? `object-contain drop-shadow-[0_14px_14px_rgba(10,30,24,0.14)] ${r.slug === "c-frame-wax-injector" ? "p-0 mix-blend-darken" : `p-5 ${usesLightBackdropBlend(r.image) ? "mix-blend-darken" : ""}`}` : "object-cover"}`}
                    />
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

function MachineGallery({ machine }: { machine: Machine }) {
  const images = machine.images?.length ? machine.images : [machine.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const isCastingImage = activeImage.includes("/productsimg/casting/");

  return (
    <div
      className="reveal-on-scroll relative overflow-hidden rounded-2xl border border-border bg-card shadow-deep"
      data-reveal-delay="120"
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden ${isCastingImage ? "bg-[#f6f7e5]" : "bg-secondary"}`}
      >
        <img
          src={activeImage}
          alt={`${machine.title} — view ${activeIndex + 1}`}
          className={`h-full w-full transition-opacity duration-300 ${isCastingImage ? `object-contain drop-shadow-[0_20px_20px_rgba(10,30,24,0.16)] ${machine.slug === "c-frame-wax-injector" ? "p-0 mix-blend-darken" : `p-6 sm:p-10 ${usesLightBackdropBlend(activeImage) ? "mix-blend-darken" : ""}`}` : "object-cover"}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full border border-border bg-card/85 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="border-t border-border bg-card/95 p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Product views
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-brand">
              Select an angle
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto" aria-label={`${machine.title} image gallery`}>
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${machine.title} view ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border bg-[#f6f7e5] transition sm:h-20 sm:w-24 ${
                  activeIndex === index
                    ? "border-brand ring-2 ring-brand/30"
                    : "border-border opacity-65 hover:border-brand/60 hover:opacity-100"
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
    </div>
  );
}
