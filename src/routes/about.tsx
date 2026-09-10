import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Cpu,
  Eye,
  Globe2,
  Headphones,
  Layers,
  LifeBuoy,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { stats, clients } from "@/content/site-data";
import heroImg from "@/assets/machine-hero.jpg";
import castingImg from "@/assets/tending-wax-1.jpg.asset.json";
import roboticsImg from "@/assets/robot-6-axis.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Modtech | Robotics & Casting Engineering" },
      { name: "description", content: "Since 1994, Modtech has engineered robotics, automation and investment casting machinery for manufacturers across 45+ countries." },
      { property: "og:title", content: "About Modtech Machinery" },
      { property: "og:description", content: "India's engineering partner for robotics, automation and investment casting machinery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const story = [
  {
    code: "01",
    year: "1994",
    title: "Built here. Proven everywhere.",
    body: "Modtech began by developing investment casting machinery in-house. That hands-on engineering culture still shapes every machine, cell and production line we deliver.",
  },
  {
    code: "02",
    year: "45+ countries",
    title: "Indian engineering, global installation base.",
    body: "Our special-purpose machines now operate across the UK, France, Germany, Japan, the USA, Russia and major manufacturing markets worldwide.",
  },
  {
    code: "03",
    year: "Future ready",
    title: "Advanced technology without unnecessary complexity.",
    body: "We continually upgrade our equipment while keeping operation intuitive, maintenance practical and every system ready for long-term production.",
  },
];

const capabilities = [
  { t: "In-house Engineering", d: "Mechanical, electrical and controls under one roof.", Icon: Cpu },
  { t: "Modular Lines", d: "A single machine or a complete integrated production cell.", Icon: Layers },
  { t: "PLC + Vision", d: "Real-time monitoring and safety-rated robotic control.", Icon: Eye },
  { t: "Global Delivery", d: "Commissioning and lifecycle support across the world.", Icon: Globe2 },
  { t: "Robotic Cells", d: "Six-axis integration with purpose-built end-of-arm tooling.", Icon: Bot },
  { t: "Lifecycle Support", d: "Spares, retrofits and continuous line optimisation.", Icon: LifeBuoy },
];

const promises = [
  "Fast service backed by a three-tier support structure",
  "Dedicated RITE service programme and service centre",
  "24 × 7 online technical support from India",
  "Globally standardised parts with dependable spare backup",
];

function AboutPage() {
  useRevealOnScroll();

  return (
    <PageShell>
      <section className="on-dark relative isolate min-h-[620px] overflow-hidden border-b border-border bg-carbon px-5 pb-10 pt-14 sm:px-8 sm:pb-14 lg:min-h-[720px] lg:pt-20">
        <img src={heroImg} alt="Modtech industrial machinery inside the manufacturing facility" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-carbon via-carbon/90 to-carbon/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-transparent to-carbon/40" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col justify-between lg:min-h-[610px]">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand">/ About Modtech · Since 1994</div>
              <h1 className="reveal mt-6 max-w-5xl font-display text-[clamp(2.8rem,7vw,6.7rem)] font-bold leading-[0.94]">
                Engineering that moves <span className="text-brand">industry forward.</span>
              </h1>
            </div>
            <p className="reveal max-w-md border-l border-brand/50 pl-5 text-base leading-relaxed text-muted-foreground lg:mb-2 lg:text-lg" style={{ animationDelay: "120ms" }}>
              We design, build and integrate production systems—from precision wax machinery to autonomous robotic cells—under one roof in Ahmedabad.
            </p>
          </div>

          <dl className="mt-14 grid grid-cols-2 border-y border-border/70 bg-carbon/55 backdrop-blur-md lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="border-border/70 px-4 py-5 sm:px-6 lg:border-r lg:last:border-r-0">
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">0{index + 1} / {stat.label}</dt>
                <dd className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand">/ Our journey</div>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">Three decades of building what production demands.</h2>
            </div>
            <ol className="border-t border-border">
              {story.map((item) => (
                <li key={item.code} className="group grid gap-4 border-b border-border py-8 sm:grid-cols-[72px_150px_1fr] sm:items-start">
                  <span className="font-mono text-xs text-brand">{item.code}</span>
                  <span className="font-display text-sm font-semibold text-foreground sm:text-base">{item.year}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold transition group-hover:text-brand sm:text-2xl">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-carbon-2">
        <div className="mx-auto max-w-[1600px]">
          <article className="reveal-on-scroll grid lg:grid-cols-2">
            <div className="min-h-[340px] overflow-hidden lg:min-h-[560px]">
              <img src={castingImg.url} alt="Modtech investment casting automation cell" loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]" />
            </div>
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
              <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-copper">Division 01 / Investment Casting</div>
              <h2 className="mt-5 max-w-xl font-display text-3xl font-bold sm:text-5xl">From wax pattern to shell room.</h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">A global leader in wax injectors and shell room automation since 1994. Our indigenously developed equipment combines affordability, custom engineering and dependable production performance.</p>
              <Button asChild variant="outline" className="mt-8 w-fit border-brand/40 bg-transparent text-foreground hover:bg-brand hover:text-brand-foreground">
                <a href="/machines">Explore casting machines <ArrowRight /></a>
              </Button>
            </div>
          </article>

          <article className="reveal-on-scroll grid border-t border-border lg:grid-cols-2">
            <div className="min-h-[340px] overflow-hidden lg:order-2 lg:min-h-[560px]">
              <img src={roboticsImg.url} alt="Six-axis industrial robot used in Modtech automation systems" loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]" />
            </div>
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
              <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-cyan">Division 02 / Robotics & Automation</div>
              <h2 className="mt-5 max-w-xl font-display text-3xl font-bold sm:text-5xl">Turnkey automation for the real factory floor.</h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">Our 250+ person team builds packaging, handling and process automation for FMCG, pharmaceuticals, food and beverages, plastics, foundries and investment casting.</p>
              <Button asChild variant="outline" className="mt-8 w-fit border-brand/40 bg-transparent text-foreground hover:bg-brand hover:text-brand-foreground">
                <a href="/automation">Explore automation <ArrowRight /></a>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-brand px-5 py-16 text-brand-foreground sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="reveal-on-scroll">
            <div className="font-mono text-[10px] uppercase tracking-[0.26em] opacity-70">/ The Modtech promise</div>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-bold sm:text-5xl">Support designed around uptime.</h2>
          </div>
          <ul className="reveal-on-scroll grid border-t border-brand-foreground/25 sm:grid-cols-2">
            {promises.map((promise, index) => (
              <li key={promise} className="flex gap-4 border-b border-brand-foreground/25 py-6 sm:px-5 sm:odd:border-r">
                <span className="font-mono text-xs opacity-60">0{index + 1}</span>
                <span className="font-display text-base font-semibold leading-snug">{promise}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-10 lg:grid-cols-[0.45fr_1fr] lg:gap-20">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand">/ Capabilities</div>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">One accountable engineering team.</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">From concept and controls to commissioning and support, every discipline works together.</p>
            </div>
            <ul className="grid border-l border-t border-border sm:grid-cols-2">
              {capabilities.map((capability, index) => (
                <li key={capability.t} className="group min-h-44 border-b border-r border-border p-6 transition hover:bg-card sm:p-8">
                  <div className="flex items-center justify-between">
                    <capability.Icon className="h-5 w-5 text-brand" />
                    <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-lg font-semibold group-hover:text-brand">{capability.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{capability.d}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal-on-scroll mt-24 border-y border-border py-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand">/ Trusted on the line</div>
                <h2 className="mt-3 font-display text-2xl font-bold">Chosen by leading manufacturers.</h2>
              </div>
              <div className="flex max-w-4xl flex-wrap gap-x-7 gap-y-4 lg:justify-end">
                {clients.map((client) => (
                  <span key={client} className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:text-foreground">{client}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal-on-scroll mt-20 grid gap-8 border-l-2 border-brand pl-6 sm:pl-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-brand"><Headphones className="h-4 w-4" /> Start a conversation</div>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold sm:text-5xl">Bring us the production challenge. We&apos;ll engineer the line.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="/contact">Talk to engineering <ArrowUpRight /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/divisions">View divisions <Check /></a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}