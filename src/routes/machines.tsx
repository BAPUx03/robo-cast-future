import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { functionalities, categoryMeta, type Category } from "@/content/site-data";
import heroImg from "@/assets/m-shelling-cell.jpg";
import { useState } from "react";

export const Route = createFileRoute("/machines")({
  head: () => ({
    meta: [
      { title: "Machines & Cells — Modtech Machinery" },
      { name: "description", content: "Browse Modtech Machinery's full catalogue of investment casting machinery and robotic cells." },
      { property: "og:title", content: "Modtech Machines & Cells" },
      { property: "og:description", content: "Wax injectors, slurry tanks, rain sanders, robotic shelling cells and more." },
    ],
  }),
  component: MachinesPage,
});

function MachinesPage() {
  useRevealOnScroll();
  const [hoverCat, setHoverCat] = useState<Category | null>(null);
  const visible = hoverCat ? functionalities.filter((f) => f.category === hoverCat) : functionalities;
  return (
    <PageShell>
      <PageHero
        kicker="/ machines"
        image={heroImg}
        title={<>Solutions across the <span className="text-gradient-brand">production line.</span></>}
        subtitle="Pick a category to filter the catalogue, then open any machine for full specifications."
      />

      <section className="relative bg-background py-12 sm:py-16">
        <div className="mx-auto mb-10 max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setHoverCat(null)}
              aria-pressed={hoverCat === null}
              className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                hoverCat === null ? "border-brand bg-brand text-brand-foreground shadow-glow" : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
              }`}
            >
              All machines
            </button>
            {(Object.keys(categoryMeta) as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setHoverCat(hoverCat === c ? null : c)}
                aria-pressed={hoverCat === c}
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  hoverCat === c ? "border-brand bg-brand text-brand-foreground shadow-glow" : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
                }`}
              >
                {categoryMeta[c].label}
              </button>
            ))}
            <span className="ml-auto hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:flex">
              {visible.length} machines
            </span>
          </div>
        </div>

        <div className="cat-group relative mx-auto max-w-7xl px-5 sm:px-8" data-hover={hoverCat ? "true" : "false"}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((f, idx) => (
              <Link
                key={`${hoverCat ?? "all"}-${f.code}`}
                to="/machines/$slug"
                params={{ slug: f.slug }}
                className="cat-card reveal group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
                style={{ animationDelay: `${(idx % 6) * 60}ms` }}
                data-active={hoverCat === f.category ? "true" : "false"}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={f.image} alt={f.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-md bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand backdrop-blur">{f.code}</span>
                    <span className="cat-tag rounded-md border border-border bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur transition">{categoryMeta[f.category].label}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="line-clamp-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-[1.35rem]">{f.title}</h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand transition group-hover:gap-3">
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
