import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, Factory, Globe2, Mail, MapPin, Wrench } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { EnquiryForm } from "@/components/enquiry-form";
import { Button } from "@/components/ui/button";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { stats } from "@/content/site-data";
import {
  automationCustomers,
  automationIndustries,
  automationPartners,
  automationSolutions,
  companyContact,
} from "@/content/automation-data";
import castingImage from "@/assets/m-wax-injector.jpg";
import roboticsImage from "@/assets/case-packer.png.asset.json";
import heroVideo from "@/assets/hero-bg-loop.mp4.asset.json";
import heroPoster from "@/assets/machine-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Modtech | Casting Machinery & Robotic Automation" },
      {
        name: "description",
        content: "Modtech engineers investment casting machinery and customised robotic automation systems for manufacturers worldwide.",
      },
      { property: "og:title", content: "Modtech | Casting Machinery & Robotic Automation" },
      {
        property: "og:description",
        content: "Investment casting machinery and customised robotic automation systems, engineered and built in India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const featuredSolutions = automationSolutions.slice(0, 5);

const advantages = [
  {
    Icon: Factory,
    title: "Indigenous development",
    text: "Machines, robot cells, controls and custom tooling developed by Modtech's engineering team in India.",
  },
  {
    Icon: Wrench,
    title: "Customised turnkey systems",
    text: "Complete solutions configured around the product, plant layout, throughput and safety requirements.",
  },
  {
    Icon: Globe2,
    title: "Worldwide support",
    text: "Ethernet-enabled remote support and service capability for installations across more than 45 countries.",
  },
];

function HomePage() {
  useRevealOnScroll();

  return (
    <PageShell>
      <section className="home-hero on-dark relative isolate -mt-28 min-h-[calc(100svh-1rem)] overflow-hidden bg-carbon pt-28 sm:-mt-32 sm:pt-32">
        <div className="home-hero-media pointer-events-none absolute inset-0 -z-10">
          <video
            src={heroVideo.url}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/80 to-carbon/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/40" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20" />

        <div className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl content-center gap-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:pb-16">
          <div className="max-w-4xl">
            <div className="reveal inline-flex items-center gap-2 border-l-2 border-brand pl-3 font-mono text-[10px] uppercase tracking-[0.24em] text-brand sm:text-xs">
              Engineering manufacturing systems since 1994
            </div>
            <h1 className="reveal mt-6 max-w-4xl font-display text-[clamp(2.6rem,7vw,6.4rem)] font-bold leading-[0.95]" data-reveal-delay="80">
              Investment casting.
              <span className="mt-2 block text-brand">Robotic automation.</span>
            </h1>
            <p className="reveal mt-7 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg" data-reveal-delay="160">
              Modtech designs and builds investment casting machinery and customised turnkey automation—from robotic case handling and palletizing to machine tending and vision-guided cells.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3" data-reveal-delay="240">
              <Button asChild size="lg" className="h-12 px-6 font-mono text-xs uppercase tracking-wider">
                <Link to="/machines">Explore machines <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-foreground/30 bg-carbon/50 px-6 font-mono text-xs uppercase tracking-wider backdrop-blur hover:border-brand hover:bg-carbon/80 hover:text-brand">
                <Link to="/automation">Automation systems <ArrowUpRight /></Link>
              </Button>
            </div>
          </div>

          <dl className="reveal grid grid-cols-2 border border-foreground/15 bg-carbon/65 backdrop-blur-md lg:grid-cols-1" data-reveal-delay="320">
            {stats.slice(0, 3).map((item) => (
              <div key={item.label} className="border-b border-r border-foreground/15 p-4 last:border-b-0 sm:p-5 lg:border-r-0">
                <dd className="font-display text-2xl font-bold text-brand sm:text-3xl">{item.value}</dd>
                <dt className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/60">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label="Industries served" className="overflow-hidden border-y border-border bg-carbon-2 py-4">
        <div className="home-marquee flex w-max items-center gap-10">
          {[...automationIndustries, ...automationIndustries].map((industry, index) => (
            <span key={`${industry}-${index}`} className="inline-flex items-center gap-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-1.5 bg-brand" />{industry}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <header className="reveal-on-scroll grid gap-6 border-b border-border pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">Two engineering divisions</p>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">One team.<br />Two disciplines.</h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground lg:justify-self-end">
              Dedicated expertise for precision foundry equipment and factory automation, backed by in-house design, manufacturing, integration and service.
            </p>
          </header>

          <div className="mt-12 space-y-20 sm:mt-16 sm:space-y-28">
            <DivisionChapter
              number="01"
              title="Investment Casting Machinery"
              description="Equipment for wax preparation and injection, ceramic shell building and foundry processing—engineered for repeatable production and dependable uptime."
              image={castingImage}
              alt="Modtech wax injection machinery"
              to="/machines"
              linkLabel="View casting machines"
              points={["Wax injectors", "Wax conditioning systems", "Slurry equipment", "Rain sanders & shelling cells"]}
            />
            <DivisionChapter
              number="02"
              title="Robotics & Automation"
              description="Custom robot cells for packaging, material handling and machine tending, built around each product, process and factory layout."
              image={roboticsImage.url}
              alt="Modtech robotic case packing system"
              to="/automation"
              linkLabel="Explore automation"
              points={["Robotic case erecting & packing", "Robotic palletizing", "Pick & place", "Machine tending & vision systems"]}
              reverse
            />
          </div>
        </div>
      </section>

      <section className="on-dark bg-carbon px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">Automation portfolio</p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold sm:text-6xl">Built around the work your line needs done.</h2>
            </div>
            <Button asChild variant="outline" className="w-fit border-foreground/25 bg-transparent font-mono text-xs uppercase tracking-wider hover:border-brand hover:bg-brand hover:text-brand-foreground">
              <Link to="/automation">See all systems <ArrowRight /></Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-12">
            {featuredSolutions.map((solution, index) => (
              <Link
                key={solution.slug}
                to="/automation"
                className={`home-solution reveal-on-scroll group relative min-h-[24rem] overflow-hidden bg-card ${index < 2 ? "lg:col-span-6" : "lg:col-span-4"}`}
                data-reveal-delay={(index % 3) * 90}
              >
                <img src={solution.image} alt={solution.title} loading="lazy" className="home-machine-image absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">System {String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 max-w-sm font-display text-2xl font-bold sm:text-3xl">{solution.title}</h3>
                  <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-foreground/70">{solution.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-brand">View system <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-on-scroll grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">Why Modtech</p>
              <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">Engineering that stays accountable.</h2>
              <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">From the first layout to commissioning and after-sales support, one engineering partner owns the complete system.</p>
            </div>
            <ol className="border-t border-border">
              {advantages.map(({ Icon, title, text }, index) => (
                <li key={title} className="grid gap-4 border-b border-border py-7 sm:grid-cols-[4rem_1fr] sm:py-9">
                  <div className="flex items-center gap-3 sm:block">
                    <span className="font-mono text-xs text-brand">0{index + 1}</span>
                    <Icon className="mt-0 h-5 w-5 text-brand sm:mt-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold">{title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-carbon-2 px-5 py-16 sm:px-8 sm:py-20">
        <div className="reveal-on-scroll mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">Trusted ecosystem</p>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">Global production experience.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">More than 1,000 projects delivered across 45+ countries, including work with 10+ Fortune 500 customers.</p>
            </div>
            <div className="space-y-8">
              <ProofRow label="Robot partners" items={automationPartners} />
              <ProofRow label="Selected customers" items={automationCustomers.slice(0, 10)} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-background px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="reveal-on-scroll lg:pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">Start a project</p>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">Tell us what your line needs to achieve.</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">Share the product, process, output target and available space. Modtech's engineering team will review the requirement.</p>
            <div className="mt-8 space-y-5 border-t border-border pt-7 text-sm">
              <a href={`mailto:${companyContact.email}`} className="flex items-center gap-3 text-foreground transition hover:text-brand"><Mail className="h-4 w-4 text-brand" />{companyContact.email}</a>
              <div className="flex items-start gap-3 text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span>{companyContact.address}</span></div>
            </div>
          </div>
          <EnquiryForm heading="Request an engineering consultation" />
        </div>
      </section>
    </PageShell>
  );
}

function DivisionChapter({
  number,
  title,
  description,
  image,
  alt,
  to,
  linkLabel,
  points,
  reverse = false,
}: {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  to: "/machines" | "/automation";
  linkLabel: string;
  points: string[];
  reverse?: boolean;
}) {
  return (
    <article className="reveal-on-scroll grid gap-8 lg:grid-cols-12 lg:items-center">
      <div className={`home-image-reveal relative min-h-[22rem] overflow-hidden sm:min-h-[32rem] lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
        <img src={image} alt={alt} loading="lazy" className="home-machine-image absolute inset-0 h-full w-full object-cover" />
        <span className="absolute left-4 top-4 bg-carbon/80 px-3 py-2 font-mono text-xs text-brand backdrop-blur">DIV.{number}</span>
      </div>
      <div className={`lg:col-span-5 ${reverse ? "lg:order-1 lg:pr-10" : "lg:pl-10"}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand">Division {number}</p>
        <h3 className="mt-4 font-display text-3xl font-bold sm:text-5xl">{title}</h3>
        <p className="mt-5 leading-relaxed text-muted-foreground">{description}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {points.map((point) => <li key={point} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 shrink-0 text-brand" />{point}</li>)}
        </ul>
        <Button asChild variant="link" className="mt-7 h-auto p-0 font-mono text-xs uppercase tracking-wider">
          <Link to={to}>{linkLabel} <ArrowRight /></Link>
        </Button>
      </div>
    </article>
  );
}

function ProofRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
        {items.map((item) => <span key={item} className="font-display text-sm font-semibold text-foreground/80 sm:text-base">{item}</span>)}
      </div>
    </div>
  );
}