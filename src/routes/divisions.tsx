import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { divisions, categoryMeta } from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { useState } from "react";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/divisions")({
  head: () => ({
    meta: [
      { title: "Divisions — Robotics & Investment Casting | Modtech Machinery" },
      {
        name: "description",
        content:
          "Two engineering divisions under one roof: Robotics & Automation, and Investment Casting. Learn what each delivers.",
      },
      { property: "og:title", content: "Modtech Divisions — Robotics & Casting" },
      {
        property: "og:description",
        content: "Robotics & Automation and Investment Casting — explained side by side.",
      },
    ],
  }),
  component: DivisionsPage,
});

function DivisionsPage() {
  useRevealOnScroll();
  const content = useSiteContent("divisions");
  const [hoverCat, setHoverCat] = useState<keyof typeof categoryMeta | null>(null);
  return (
    <PageShell>
      <PageHero
        kicker={content.eyebrow}
        image={automationImages.robot6Axis}
        title={
          <>
            {content.title} <span className="text-gradient-brand">{content.accent}</span>
          </>
        }
        subtitle={content.description}
      />

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div
            className="cat-group grid gap-8 lg:grid-cols-2"
            data-hover={hoverCat ? "true" : "false"}
            onMouseLeave={() => setHoverCat(null)}
          >
            {divisions.map((d, idx) => (
              <article
                key={d.code}
                className="cat-card reveal-on-scroll corner-tl group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card"
                data-reveal-delay={idx * 140}
                data-active={hoverCat === d.category ? "true" : "false"}
                onMouseEnter={() => setHoverCat(d.category)}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-md bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand backdrop-blur">
                      {d.code}
                    </span>
                    <span className="cat-tag rounded-md border border-border bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur transition">
                      {categoryMeta[d.category].label}
                    </span>
                  </div>
                </div>
                <div className="p-7 sm:p-8">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {d.tag}
                  </div>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-tight">{d.title}</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{d.description}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-2">
                    {d.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-2 rounded-md border border-border/70 bg-secondary/40 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      to={d.category === "casting" ? "/machines" : "/solutions"}
                      className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]"
                    >
                      {d.category === "casting" ? "See machines" : "See solutions"}{" "}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand transition hover:gap-3"
                    >
                      Discuss this division <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
