import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { categoryMeta, machineDivision, machineSection, type Machine } from "@/content/site-data";
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
    const title = m ? `${m.title} — Modtech Machinery` : "Machine — Modtech Machinery";
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
          to="/machines"
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

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          <div className="reveal-on-scroll lg:col-span-2">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">
              / overview
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for repeatability.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{m.desc}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {m.highlights.map((h) => (
                <div
                  key={h}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-sm text-foreground/90">{h}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">
                / applications
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {m.applications.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="reveal-on-scroll" data-reveal-delay="120">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">
                / specs
              </div>
              <dl className="mt-4 divide-y divide-border">
                {m.specs.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-4 py-3">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="text-right font-display text-sm font-semibold text-foreground">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/contact"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-1px]"
              >
                Request datasheet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative bg-carbon px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">
                  / related machines
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  More from {categoryMeta[division].label.toLowerCase()}.
                </h2>
              </div>
              <Link
                to="/machines"
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
