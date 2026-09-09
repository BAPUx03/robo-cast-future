import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Award, BadgeCheck, Mail, MapPin, Phone, ShieldCheck, Trophy } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { EnquiryForm } from "@/components/enquiry-form";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { divisions, categoryMeta, stats, industries } from "@/content/site-data";
import machineHeroImg from "@/assets/machine-hero.jpg";
import heroBgLoop from "@/assets/hero-bg-loop.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Modtech Machinery — Robotics Automation & Investment Casting Systems" },
      { name: "description", content: "Modtech Machinery engineers robotic automation cells and investment casting machinery. Two divisions, one engineering ecosystem." },
      { property: "og:title", content: "Modtech Machinery — Robotics & Casting Automation" },
      { property: "og:description", content: "Two divisions, one engineering ecosystem. Robotic automation and investment casting machinery for modern manufacturers." },
    ],
  }),
  component: HomePage,
});

const CERTS = [
  { title: "ISO 9001:2015",       desc: "Quality Management System certified.",          Icon: ShieldCheck },
  { title: "CE Marked",           desc: "Conformance with EU machinery directives.",     Icon: BadgeCheck  },
  { title: "Make in India",       desc: "Government of India recognised manufacturer.",  Icon: Award       },
  { title: "Industry Excellence", desc: "Recognised by India's leading foundry forums.", Icon: Trophy     },
];

function HomePage() {
  useRevealOnScroll();
  return (
    <PageShell>
      <section className="on-dark relative isolate -mt-28 overflow-hidden bg-carbon pt-28 sm:-mt-32 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img src={machineHeroImg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          <video src={heroBgLoop.url} poster={machineHeroImg} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/92 via-carbon/60 to-carbon" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-25" />

        <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-7xl flex-col justify-center px-5 pb-16 pt-10 text-center sm:min-h-[64vh] sm:px-8 sm:pb-20">
          <div className="reveal mx-auto inline-flex items-center gap-2 rounded-full border border-brand/40 bg-carbon/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-brand backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand blink-dot" />
            Engineered in India · Deployed Worldwide
          </div>
          <h1 className="reveal mx-auto mt-6 max-w-5xl font-display text-[clamp(2.3rem,5.8vw,5.2rem)] font-bold tracking-[-0.03em]" style={{ animationDelay: "90ms" }}>
            Investment Casting &amp; Robotics
            <br />
            <span className="text-gradient-brand">that delivers value!</span>
          </h1>
          <p className="reveal mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg" style={{ animationDelay: "180ms" }}>
            From <span className="text-brand">wax injectors</span> and <span className="text-brand">slurry systems</span> to fully
            <span className="text-brand"> automated shelling cells</span> — engineered, built and integrated under one roof.
          </p>
          <div className="reveal mx-auto mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "270ms" }}>
            <Link to="/divisions" className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]">
              Explore Divisions
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-3 rounded-full border border-brand/40 bg-carbon/60 px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur transition hover:border-brand hover:text-brand">
              Talk to Engineering
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Industries we serve" className="relative overflow-hidden border-y border-border bg-carbon-2/60">
        <div className="flex items-center gap-6 px-5 py-4 sm:px-8">
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-brand sm:inline">/ industries we serve</span>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="marquee flex w-max items-center gap-10">
              {[...industries, ...industries].map((label, i) => (
                <span key={`${label}-${i}`} className="inline-flex items-center gap-3 font-display text-sm font-semibold tracking-wide text-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-carbon px-5 py-16 sm:px-8 sm:py-20">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        <div className="relative mx-auto max-w-7xl">
          <div className="reveal-on-scroll text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ at a glance</div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Two divisions. <span className="text-gradient-brand">One team.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Side by side — Investment Casting machinery first, Robotics & Automation cells alongside.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {divisions.map((d) => (
              <article key={d.code} className="reveal-on-scroll corner-tl group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={d.image} alt={d.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-md bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand backdrop-blur">{d.code}</span>
                    <span className="rounded-md border border-border bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">{categoryMeta[d.category].label}</span>
                  </div>
                </div>
                <div className="p-7">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{d.tag}</div>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{d.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                  <Link to="/divisions" className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand transition hover:gap-3">
                    See full division <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <dl className="reveal-on-scroll mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card px-4 py-5 text-center sm:py-6">
                <dd className="font-display text-2xl font-bold leading-none text-gradient-brand sm:text-3xl">{s.value}</dd>
                <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll text-center">
            <div className="font-mono to-foreground text-[11px] uppercase tracking-[0.3em] text-brand">/ where to next</div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Pick a path. <span className="text-gradient-brand">We&apos;ll guide you.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              A clear, page-by-page tour of who we are and what we build.
            </p>
          </div>

          <div className="reveal-on-scroll mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { to: "/divisions"  as const, kicker: "01", title: "Our Two Divisions",    desc: "Robotics & Automation, and Investment Casting — explained side by side." },
              { to: "/machines"   as const, kicker: "02", title: "Products & Machines",  desc: "Browse the full catalogue of equipment we design, build and integrate." },
              { to: "/solutions"  as const, kicker: "03", title: "Services",             desc: "What we deliver and how each engineering capability works for you." },
              { to: "/industries" as const, kicker: "04", title: "Industries Served",    desc: "From aerospace to railways — sectors where Modtech machines run." },
              { to: "/about"      as const, kicker: "05", title: "About Modtech",        desc: "20+ years of engineering for India's leading manufacturers." },
              { to: "/contact"    as const, kicker: "06", title: "Talk to Us",           desc: "Tell us about your line. We'll come back with a system blueprint." },
            ].map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:border-brand/60 hover:shadow-deep"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ {card.kicker}</div>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand transition group-hover:gap-3">
                  Open page <ArrowRight className="h-3.5 w-3.5" />
                </div>
                <span className="pointer-events-none absolute right-5 top-5 opacity-0 transition group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5 text-brand" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-carbon px-5 py-16 sm:px-8 sm:py-20">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <div className="reveal-on-scroll text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ awards & certifications</div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Built to the <span className="text-gradient-brand">highest standards</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Recognised, certified and trusted across India and global markets.
            </p>
          </div>
          <ul className="reveal-on-scroll mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CERTS.map((c) => (
              <li key={c.title} className="group rounded-2xl border border-border bg-card p-6 text-center shadow-card transition hover:-translate-y-1 hover:border-brand/60">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-border bg-secondary/40 text-brand transition group-hover:bg-brand/10 group-hover:scale-110">
                  <c.Icon className="h-7 w-7" />
                </span>
                <div className="mt-4 font-display text-base font-bold tracking-tight">{c.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-on-scroll text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">/ get in touch</div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Tell us about <span className="text-gradient-brand">your line</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Send an enquiry and our engineering team will reply with a system blueprint.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="reveal-on-scroll space-y-4">
              <a href="mailto:info@modtechworld.com" className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</div>
                  <div className="mt-1 font-display text-base font-semibold text-foreground transition group-hover:text-brand">info@modtechworld.com</div>
                </div>
              </a>
              <a href="tel:+910000000000" className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Phone</div>
                  <div className="mt-1 font-display text-base font-semibold text-foreground transition group-hover:text-brand">+91 00000 00000</div>
                </div>
              </a>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary/40 text-brand">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Workshop</div>
                  <div className="mt-1 font-display text-base font-semibold text-foreground">India · Global delivery</div>
                </div>
              </div>
            </div>
            <EnquiryForm heading="Request a quote" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background px-5 py-16 sm:px-8 sm:py-20">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[140px]" />
        <div className="reveal-on-scroll relative mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Ready to <span className="text-gradient-brand">engineer your line?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Tell us about the part, the volume, and the cycle time. We&apos;ll come back with a system blueprint.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]">
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/machines" className="inline-flex items-center gap-3 rounded-full border border-border bg-card/40 px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-brand/50 hover:text-brand">
              Browse machines <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
