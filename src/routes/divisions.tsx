import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { divisions } from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
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
          <div className="cat-group grid gap-8 lg:grid-cols-2">
            {divisions.map((d, idx) => (
              <Link
                key={d.code}
                to="/machines"
                search={{ division: d.category }}
                aria-label={`View ${d.title} products`}
                className="cat-card reveal-on-scroll corner-tl group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-deep"
                data-reveal-delay={idx * 140}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
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
                  <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition group-hover:gap-3">
                    View {d.category === "casting" ? "casting products" : "automation products"}{" "}
                    <ArrowRight className="h-3.5 w-3.5" />
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
