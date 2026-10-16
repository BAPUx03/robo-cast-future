import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { processSteps } from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process — From Concept to Production | Modtech Machine" },
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

      <section className="relative overflow-hidden bg-background px-5 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-20" />
        <div className="relative mx-auto max-w-6xl">
          <ol
            className="relative space-y-6 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-px before:bg-gradient-to-b before:from-brand before:via-brand/45 before:to-border md:space-y-8 md:before:left-1/2"
            aria-label="Engineering delivery process"
          >
            {processSteps.map((s, i) => (
              <li
                key={s.code}
                className="reveal-on-scroll relative pl-16 md:grid md:grid-cols-2 md:gap-24 md:pl-0"
                data-reveal-delay={i * 90}
              >
                <span className="absolute left-0 top-6 z-10 grid h-12 w-12 place-items-center rounded-full border border-brand/50 bg-carbon font-mono text-xs font-semibold text-brand shadow-glow md:left-1/2 md:-translate-x-1/2">
                  {s.code}
                </span>

                <article
                  className={`group relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-elevated sm:p-7 ${
                    i % 2 === 0 ? "md:col-start-1" : "md:col-start-2"
                  }`}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand/10 opacity-40 blur-3xl transition duration-500 group-hover:opacity-80" />
                  <div
                    className={`relative flex items-start gap-4 ${
                      i % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-secondary/50 text-brand transition duration-300 group-hover:border-brand/50 group-hover:bg-brand/10">
                      <s.Icon className="h-5 w-5" />
                    </span>
                    <div className={`min-w-0 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                      <h3 className="font-display text-2xl font-bold tracking-tight">{s.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
