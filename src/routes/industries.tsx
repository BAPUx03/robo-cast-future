import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plane, Car, Shield, Zap, Droplets, Hammer, Settings2, HeartPulse, TrainFront, Wrench, Anchor, Sprout } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { automationImages } from "@/content/automation-data";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries Served — Modtech Machinery" },
      { name: "description", content: "Modtech Machinery powers production lines across Automotive, Aerospace, Defence, Energy, Medical, Railways and more." },
      { property: "og:title", content: "Industries Served — Modtech Machinery" },
      { property: "og:description", content: "Robotics and investment casting machinery deployed across 12+ industrial sectors." },
    ],
  }),
  component: IndustriesPage,
});

const INDUSTRIES = [
  { name: "Automotive",            Icon: Car,         desc: "Engine, drivetrain and chassis components at scale." },
  { name: "Aerospace",             Icon: Plane,       desc: "Turbine cores, blades and high-precision airframe parts." },
  { name: "Defence",               Icon: Shield,      desc: "Mission-critical castings and armour-grade hardware." },
  { name: "Energy & Power",        Icon: Zap,         desc: "Turbine, generator and switchgear components." },
  { name: "Oil & Gas",             Icon: Droplets,    desc: "Valves, fittings and corrosion-resistant assemblies." },
  { name: "Heavy Engineering",     Icon: Hammer,      desc: "Large-format castings and structural hardware." },
  { name: "Pumps & Valves",        Icon: Settings2,   desc: "Precision-cast bodies, impellers and seats." },
  { name: "Medical",               Icon: HeartPulse,  desc: "Orthopaedic and surgical-grade investment castings." },
  { name: "Railways",              Icon: TrainFront,  desc: "Bogie, brake and traction-grade components." },
  { name: "Industrial Tooling",    Icon: Wrench,      desc: "Tool steels, jigs and fixturing." },
  { name: "Marine",                Icon: Anchor,      desc: "Propulsion, valves and seawater-grade hardware." },
  { name: "Agricultural Equipment",Icon: Sprout,      desc: "Wear-resistant cast components for the field." },
];

function IndustriesPage() {
  useRevealOnScroll();
  return (
    <PageShell>
      <PageHero
        kicker="/ industries served"
        image={automationImages.robotCobot}
        title={<>Engineered for the <span className="text-gradient-brand">industries that build the world</span>.</>}
        subtitle="From precision aerospace cores to high-volume automotive lines — Modtech machines run inside every major manufacturing sector."
      />

      <section className="relative bg-background px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((it) => (
              <li key={it.name} className="reveal-on-scroll group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-brand/60">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-secondary/40 text-brand transition group-hover:bg-brand/10 group-hover:scale-110">
                    <it.Icon className="h-6 w-6" />
                  </span>
                  <div className="font-display text-lg font-bold tracking-tight">{it.name}</div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
              </li>
            ))}
          </ul>

          <div className="reveal-on-scroll mt-12 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-2px]">
              Discuss your sector <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
