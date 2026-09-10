import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Cpu, Layers, Eye, Globe2, Bot, LifeBuoy } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { stats, clients } from "@/content/site-data";
import heroImg from "@/assets/machine-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Modtech Machinery | India's Robotics & Casting Engineer" },
      { name: "description", content: "20+ years engineering robotics and investment casting machinery for India's leading manufacturers." },
      { property: "og:title", content: "About Modtech Machinery" },
      { property: "og:description", content: "India's engineering partner for robotics and investment casting." },
    ],
  }),
  component: AboutPage,
});

const capabilities = [
  { t: "In-house Engineering", d: "Mechanical, electrical and controls under one roof.", Icon: Cpu },
  { t: "Modular Lines",        d: "Deploy a single machine or a full integrated cell.", Icon: Layers },
  { t: "PLC + Vision",         d: "Real-time monitoring with safety-rated robotics.",   Icon: Eye },
  { t: "Global Delivery",      d: "Commissioning and lifecycle support worldwide.",     Icon: Globe2 },
  { t: "Robotic Cells",        d: "Six-axis integration with custom end-of-arm tooling.", Icon: Bot },
  { t: "Lifecycle Support",    d: "Spares, retrofits and continuous optimisation.",    Icon: LifeBuoy },
];

function AboutPage() {
  useRevealOnScroll();
  return (
    <PageShell>
      <PageHero
        kicker="/ about modtech"
        image={heroImg}
        title={<>India&apos;s engineering partner for <span className="text-gradient-brand">robotics & casting</span>.</>}
        subtitle="We design, build and integrate complete production lines — from a single wax injector to a fully autonomous shelling cell."
      />

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Stats */}
          <dl className="reveal-on-scroll grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card px-5 py-7 text-center">
                <dd className="font-display text-3xl font-bold leading-none text-gradient-brand sm:text-4xl">{s.value}</dd>
                <dt className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>

          {/* Story — establishment / projects / concept */}
          <div className="reveal-on-scroll mt-16 grid gap-6 lg:grid-cols-3">
            {[
              { code: "01", title: "Establishment", body: "Modtech manufactures state-of-the-art machines incorporating robotics and automation, engineered around each customer's line. Every product has been indigenously developed in-house since 1994." },
              { code: "02", title: "Projects",      body: "Within two decades Modtech has become one of India's largest exporters of special-purpose machines, with an installation base across 45+ countries including the UK, France, Germany, Japan, the USA and Russia." },
              { code: "03", title: "The Concept",   body: "We keep our equipment upgraded with new technology to stay future ready. Despite the advanced features, the machines remain easy to operate and carry a minimal cost of maintenance." },
            ].map((s) => (
              <div key={s.code} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ {s.code}</div>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>


          {/* Distinctive divisions */}
          <div className="reveal-on-scroll mt-16 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "Wax Injectors & Shell Room Automation",
                body: "A global leader in wax injectors and shell room automation since 1994. As a top industrial automation manufacturer we offer affordable, customised solutions specialising in the investment casting industry, ranking among India's top five automation providers — with installations in over 45 countries.",
              },
              {
                title: "Robotics & Automation — Packaging",
                body: "Established a decade ago, our automation division delivers turnkey solutions across FMCG, pharmaceuticals, food & beverages, investment casting, foundry and plastics. With 250+ skilled employees and a dedicated design and manufacturing facility in Ahmedabad, we handle cartons, bottles, cans, tins, soap, confectionery, tubs, glass, bales and sacks.",
              },
            ].map((d) => (
              <div key={d.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <h3 className="font-display text-xl font-bold tracking-tight">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </div>
            ))}
          </div>

          {/* Why Modtech — service & support */}
          <div className="reveal-on-scroll mt-16 rounded-2xl border border-border bg-card/60 px-6 py-8 sm:px-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ why modtech</div>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">Cost efficient, logical, world-class solutions</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Unmatched, lightning-fast service backed by a 3-tier support structure",
                "Unique RITE service programme and service centre",
                "24 × 7 online support from India",
                "Global standard parts with spare back-up",
              ].map((p) => (
                <li key={p} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{p}
                </li>
              ))}
            </ul>
          </div>

          {/* Capabilities */}
          <div className="reveal-on-scroll mt-16">
            <div className="text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ capabilities</div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">What we bring to your line</h2>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <li
                  key={c.t}
                  className="cap-tile group rounded-xl border border-border bg-card/70 p-5"
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    el.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                >
                  <div className="cap-tile-content">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card/80 text-brand transition group-hover:border-brand/60 group-hover:bg-brand/10 group-hover:scale-110">
                          <c.Icon className="h-4 w-4" />
                        </span>
                        <div className="font-display text-base font-semibold text-foreground">{c.t}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-brand" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Clients */}
          <div className="reveal-on-scroll mt-16 rounded-2xl border border-border bg-card/60 px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Trusted by leading manufacturers
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {clients.map((c) => (
                <span key={c} className="font-display text-base font-bold tracking-wider text-muted-foreground/80 transition hover:text-brand sm:text-lg">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="reveal-on-scroll mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link to="/divisions" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]">
              Explore divisions <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand transition hover:gap-3">
              Talk to engineering <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
