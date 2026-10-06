import { useState } from "react";
import { ChevronDown, ChevronRight, Factory, MoveRight, PackageCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  functionalities,
  machineDivision,
  machineSection,
  productSectionMeta,
  type Mode,
  type ProductSection,
} from "@/content/site-data";

const SECTION_ORDER: ProductSection[] = [
  "wax-injection-machines",
  "wax-processing-conditioning",
  "wax-room-automation",
  "shelling-solutions",
  "ceramic-injectors",
  "fettling-equipment",
  "end-of-line-packaging",
  "flexible-industrial-automation",
];

const sections = SECTION_ORDER.map((id) => ({
  id,
  ...productSectionMeta[id],
  machines: functionalities.filter((machine) => machineSection(machine) === id),
}));

const divisions: Array<{
  id: Mode;
  label: string;
  eyebrow: string;
  icon: typeof Factory;
}> = [
  {
    id: "casting",
    label: "Investment Casting",
    eyebrow: "22 machines",
    icon: Factory,
  },
  {
    id: "robotics",
    label: "Robotics & Automation",
    eyebrow: "6 systems",
    icon: PackageCheck,
  },
];

export function DesktopMachineMenu({ active }: { active: boolean }) {
  return (
    <div className="group/machines relative">
      <Link
        to="/machines"
        search={{ division: "casting" }}
        data-active={active}
        aria-haspopup="true"
        className={`nav-link inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 2xl:px-2.5 ${
          active ? "text-brand" : "text-foreground/75 hover:text-brand"
        }`}
      >
        Machines
        <ChevronDown className="h-3.5 w-3.5 transition duration-300 group-hover/machines:rotate-180 group-focus-within/machines:rotate-180" />
      </Link>

      <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[min(92vw,76rem)] -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition duration-200 group-hover/machines:pointer-events-auto group-hover/machines:translate-y-0 group-hover/machines:opacity-100 group-focus-within/machines:pointer-events-auto group-focus-within/machines:translate-y-0 group-focus-within/machines:opacity-100">
        <div className="max-h-[min(72vh,46rem)] overflow-y-auto rounded-2xl border border-border bg-card/98 p-3 text-left shadow-deep backdrop-blur-2xl">
          <div className="grid gap-2 md:grid-cols-2">
            {divisions.map((division) => {
              const Icon = division.icon;
              return (
                <Link
                  key={division.id}
                  to="/machines"
                  search={{ division: division.id }}
                  className="group/division flex items-center gap-3 rounded-xl border border-border bg-background/55 p-3 transition hover:border-brand/45 hover:bg-brand/[0.06]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand transition group-hover/division:scale-105">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-semibold text-foreground">
                      {division.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.17em] text-muted-foreground">
                      {division.eyebrow}
                    </span>
                  </span>
                  <MoveRight className="ml-auto h-4 w-4 text-brand transition group-hover/division:translate-x-1" />
                </Link>
              );
            })}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="rounded-xl border border-border/80 bg-background/30 p-3 transition hover:border-brand/25"
              >
                <a
                  href={`/machines?division=${section.division}#${section.id}`}
                  className="group/section flex items-start gap-2"
                >
                  <span className="mt-0.5 font-mono text-[9px] font-semibold text-brand">
                    {(sectionIndex + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="font-display text-[13px] font-semibold leading-snug text-foreground transition group-hover/section:text-brand">
                    {section.label}
                  </span>
                </a>
                <ul className="mt-2.5 space-y-0.5 border-t border-border/70 pt-2">
                  {section.machines.map((machine) => (
                    <li key={machine.slug}>
                      <Link
                        to="/machines/$slug"
                        params={{ slug: machine.slug }}
                        className="group/product flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] leading-snug text-muted-foreground transition hover:bg-brand/[0.07] hover:text-brand"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0 opacity-45 transition group-hover/product:translate-x-0.5 group-hover/product:opacity-100" />
                        <span>{machine.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-brand px-4 py-3 text-brand-foreground">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-foreground/75">
              28 machines and automation systems · one engineering partner
            </p>
            <Link
              to="/machines"
              search={{ division: "casting" }}
              className="inline-flex shrink-0 items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em]"
            >
              View catalogue <MoveRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileMachineMenu({
  active,
  onNavigate,
}: {
  active: boolean;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(active);

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background/35">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className={`flex w-full items-center justify-between px-4 py-3 font-display text-[15px] transition ${
          active ? "font-semibold text-brand" : "font-medium text-foreground/85"
        }`}
      >
        Machines
        <ChevronDown
          className={`h-4 w-4 transition duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-2 pb-2 pt-2">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {divisions.map((division) => (
              <Link
                key={division.id}
                to="/machines"
                search={{ division: division.id }}
                onClick={onNavigate}
                className="flex items-center justify-between rounded-lg bg-brand/[0.08] px-3 py-2.5 font-display text-sm font-semibold text-foreground transition hover:text-brand"
              >
                {division.label}
                <ChevronRight className="h-3.5 w-3.5 text-brand" />
              </Link>
            ))}
          </div>
          <div className="mt-2 grid gap-1 sm:grid-cols-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`/machines?division=${section.division}#${section.id}`}
                onClick={onNavigate}
                className="rounded-lg px-3 py-2 text-xs text-muted-foreground transition hover:bg-secondary/60 hover:text-brand"
              >
                {section.label}
                <span className="ml-1 text-[10px] opacity-55">({section.machines.length})</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
