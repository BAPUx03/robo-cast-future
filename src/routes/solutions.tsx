import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { modeData, type Mode } from "@/content/site-data";
import heroImg from "@/assets/casting-visual.jpg";
import { useState } from "react";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Robotic Automation & Casting | Modtech Machinery" },
      { name: "description", content: "Switch between Robotic & Automation and Investment Casting solutions to see graphics, features and CTAs." },
      { property: "og:title", content: "Modtech Solutions" },
      { property: "og:description", content: "Two divisions, one switch — see what we build, how it works, and where it ships." },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  useRevealOnScroll();
  const [mode, setMode] = useState<Mode>("casting");
  const m = modeData[mode];
  return (
    <PageShell>
      <PageHero
        kicker="/ solutions"
        image={heroImg}
        title={<>Two worlds. <span className="text-gradient-brand">One switch.</span></>}
        subtitle="Toggle between our two engineering divisions to see what we build, how it works, and where it ships."
      />

      <section className="relative bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <div className="inline-flex w-full max-w-md items-center justify-center rounded-full border border-border bg-card/70 p-1 shadow-card backdrop-blur" role="tablist" aria-label="Solution mode">
              {(Object.keys(modeData) as Mode[]).map((k) => (
                <button
                  key={k}
                  role="tab"
                  type="button"
                  aria-selected={mode === k}
                  onClick={() => setMode(k)}
                  className={`relative flex-1 rounded-full px-3 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition sm:text-[11px] ${
                    mode === k ? "bg-brand text-brand-foreground shadow-glow" : "text-muted-foreground hover:text-brand"
                  }`}
                >
                  {modeData[k].label}
                </button>
              ))}
            </div>
          </div>

          <div key={mode} className="mt-12 grid animate-fade-in gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-deep">
              <div className="relative aspect-[16/11] overflow-hidden">
                <img src={m.image} alt={m.label} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-card via-card/20 to-transparent" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2">
                  <span className="rounded-md bg-brand px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-foreground shadow-glow">
                    {mode === "casting" ? "DIV.01" : "DIV.02"}
                  </span>
                  <span className="rounded-md bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand backdrop-blur">{m.kicker}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">{m.title}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{m.description}</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {m.features.map((f) => (
                  <li
                    key={f.title}
                    className="cap-tile rounded-xl border border-border bg-card/60 p-4"
                    onMouseMove={(e) => {
                      const el = e.currentTarget;
                      const r = el.getBoundingClientRect();
                      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                      el.style.setProperty("--my", `${e.clientY - r.top}px`);
                    }}
                  >
                    <div className="cap-tile-content">
                      <div className="font-display text-sm font-semibold text-foreground">{f.title}</div>
                      <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/machines" className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]">
                  {m.primaryCta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground transition hover:border-brand/50 hover:text-brand">
                  {m.secondaryCta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
