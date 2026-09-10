import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Package, Play } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import {
  automationSolutions,
  automationStats,
  automationIndustries,
  automationPartners,
  automationCustomers,
  automationImages,
  robotTypes,
  tendingCells,
} from "@/content/automation-data";

export const Route = createFileRoute("/automation")({
  head: () => ({
    meta: [
      { title: "Robotics & Automation — End-of-Line Packaging | Modtech" },
      { name: "description", content: "Robotic case erectors, case packers, palletizing, pick & place, machine tending and vision systems — turnkey end-of-line packaging automation by Modtech." },
      { property: "og:title", content: "Modtech Robotics & Automation" },
      { property: "og:description", content: "Turnkey robotic packaging and machine tending cells for FMCG, pharma, food & beverage, plastics and casting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AutomationPage,
});

function AutomationPage() {
  useRevealOnScroll();
  return (
    <PageShell>
      <PageHero
        kicker="/ robotics & automation"
        image={automationImages.casePacker}
        title={<>Come & solve it with <span className="text-gradient-brand">robots</span>.</>}
        subtitle="Turnkey end-of-line packaging and machine tending automation — designed, built and commissioned from our Ahmedabad facility for FMCG, pharma, food & beverage, plastics, foundry and investment casting."
      />

      <section className="relative bg-background px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <dl className="reveal-on-scroll grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
            {automationStats.map((s) => (
              <div key={s.label} className="bg-card px-4 py-7 text-center">
                <dd className="font-display text-3xl font-bold leading-none text-gradient-brand">{s.value}</dd>
                <dt className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>

          {/* Solutions */}
          <div className="mt-16 space-y-8">
            {automationSolutions.map((s, i) => (
              <article
                key={s.slug}
                id={s.slug}
                className="reveal-on-scroll grid overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:grid-cols-2"
              >
                <div className={`relative min-h-[260px] bg-carbon-2 ${i % 2 ? "lg:order-2" : ""}`}>
                  <img src={s.image} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent lg:bg-gradient-to-r" />
                </div>
                <div className="p-7 sm:p-9">
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ {String(i + 1).padStart(2, "0")}</div>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">{s.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">Value addition</div>
                      <ul className="mt-3 space-y-2">
                        {s.valueAdds.map((v) => (
                          <li key={v} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{v}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">The system includes</div>
                      <ul className="mt-3 space-y-2">
                        {s.includes.map((v) => (
                          <li key={v} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                            <Package className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{v}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {s.gallery && s.gallery.length > 0 && (
                  <div className="border-t border-border bg-carbon-2/40 p-5 sm:p-7 lg:col-span-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">/ on the shop floor</div>
                    <div className={`mt-4 grid gap-4 ${s.gallery.length > 1 ? "sm:grid-cols-2" : ""} ${s.gallery.length > 2 ? "lg:grid-cols-4" : ""}`}>
                      {s.gallery.map((g, gi) => (
                        <div key={gi} className="overflow-hidden rounded-xl border border-border bg-carbon-2">
                          <img src={g} alt={`${s.title} installation ${gi + 1}`} loading="lazy" className="h-44 w-full object-cover transition duration-700 hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Machine tending cells */}
          <div className="reveal-on-scroll mt-16">
            <div className="text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ machine tending cells</div>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Real installations, <span className="text-gradient-brand">running today</span>.
              </h2>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {tendingCells.map((c) => (
                <li key={c.name} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  <div className="grid grid-cols-2 gap-px bg-border">
                    {c.images.map((img, ii) => (
                      <div key={ii} className="relative aspect-[4/3] overflow-hidden bg-carbon-2">
                        <img src={img} alt={`${c.name} ${ii + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <h3 className="font-display text-sm font-bold tracking-tight">{c.name}</h3>
                    {c.video && (
                      <a href={c.video} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-brand transition hover:bg-brand hover:text-brand-foreground">
                        <Play className="h-3 w-3" /> Watch
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Robots */}
      <section className="relative bg-carbon px-5 py-16 sm:px-8 sm:py-20">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <div className="reveal-on-scroll text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ robots for specific needs</div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              The right robot for <span className="text-gradient-brand">every task</span>.
            </h2>
          </div>
          <ul className="reveal-on-scroll mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {robotTypes.map((r) => (
              <li key={r.name} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-brand/60">
                <div className="relative aspect-[4/3] overflow-hidden bg-carbon-2">
                  <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold tracking-tight">{r.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries + partners + customers */}
      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="reveal-on-scroll rounded-2xl border border-border bg-card/60 px-6 py-8 sm:px-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ industries we automate</div>
            <div className="mt-5 flex flex-wrap gap-2">
              {automationIndustries.map((i) => (
                <span key={i} className="rounded-full border border-border bg-background px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{i}</span>
              ))}
            </div>
          </div>

          <div className="reveal-on-scroll grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card/60 px-6 py-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ official integrators & partners</div>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                {automationPartners.map((p) => (
                  <span key={p} className="font-display text-base font-bold tracking-wider text-muted-foreground/85">{p}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 px-6 py-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ our valued customers</div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {automationCustomers.map((c) => (
                  <span key={c} className="font-display text-sm font-bold tracking-wider text-muted-foreground/80 transition hover:text-brand">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal-on-scroll flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]">
              Discuss your packaging line <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
