import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { processSteps } from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process — From Concept to Production | Modtech Machinery" },
      {
        name: "description",
        content:
          "A transparent five-step path from first call to commissioning — Consult, Engineer, Build, Automate, Support.",
      },
      { property: "og:title", content: "Modtech Process" },
      {
        property: "og:description",
        content: "Five clear steps from concept to fully commissioned production line.",
      },
    ],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  useRevealOnScroll();
  const content = useSiteContent("process");
  return (
    <PageShell>
      <PageHero
        kicker={content.eyebrow}
        image={automationImages.facility}
        title={
          <>
            {content.title} <span className="text-gradient-brand">{content.accent}</span>
          </>
        }
        subtitle={content.description}
      />

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-5">
            {processSteps.map((s, i) => (
              <li
                key={s.code}
                className="reveal-on-scroll group relative overflow-hidden bg-card p-6 transition hover:bg-card/60"
                data-reveal-delay={i * 100}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-xs text-brand">{s.code}</span>
                  <span className="h-2 w-2 rounded-full bg-brand/40 transition group-hover:scale-150 group-hover:bg-brand" />
                </div>
                <div className="relative mt-6 inline-flex">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-secondary/40 text-brand transition group-hover:border-brand/60 group-hover:bg-brand/10">
                    <s.Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-xl font-bold">{s.name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                {i < processSteps.length - 1 && (
                  <span className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center md:flex">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-carbon text-brand">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
