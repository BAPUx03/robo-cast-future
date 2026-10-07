import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Bot, ChevronDown, ChevronRight, Factory, MoveRight } from "lucide-react";
import {
  functionalities,
  machineDivision,
  machineSection,
  productSectionMeta,
  type Mode,
  type ProductSection,
} from "@/content/site-data";

const sections = (
  Object.entries(productSectionMeta) as Array<
    [ProductSection, (typeof productSectionMeta)[ProductSection]]
  >
).map(([id, section]) => ({
  id,
  ...section,
  machines: functionalities.filter((machine) => machineSection(machine) === id),
}));

const divisionOptions: Array<{
  id: Mode;
  label: string;
  eyebrow: string;
  description: string;
  Icon: typeof Factory;
}> = [
  {
    id: "casting",
    label: "Investment Casting",
    eyebrow: `${functionalities.filter((machine) => machineDivision(machine) === "casting").length} machines`,
    description: "Wax, shelling, ceramic and fettling equipment.",
    Icon: Factory,
  },
  {
    id: "robotics",
    label: "Robotics & Automation",
    eyebrow: `${functionalities.filter((machine) => machineDivision(machine) === "robotics").length} systems`,
    description: "Turnkey packaging and industrial automation cells.",
    Icon: Bot,
  },
];

function sectionHref(section: (typeof sections)[number]) {
  return `/machines?division=${section.division}#${section.id}`;
}

export function DesktopDivisionMenu({ active }: { active: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Mode>("casting");
  const [selectedSection, setSelectedSection] = useState<ProductSection>("wax-injection-machines");
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const visibleSections = sections.filter((section) => section.division === selectedDivision);
  const focusedSection =
    visibleSections.find((section) => section.id === selectedSection) ?? visibleSections[0];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.href]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const desktopBreakpoint = window.matchMedia("(min-width: 80rem)");
    const closeOnBreakpointChange = () => setMenuOpen(false);

    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    document.addEventListener("keydown", closeOnEscape);
    desktopBreakpoint.addEventListener("change", closeOnBreakpointChange);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
      document.removeEventListener("keydown", closeOnEscape);
      desktopBreakpoint.removeEventListener("change", closeOnBreakpointChange);
    };
  }, [menuOpen]);

  function chooseDivision(division: Mode) {
    setSelectedDivision(division);
    const firstSection = sections.find((section) => section.division === division);
    if (firstSection) setSelectedSection(firstSection.id);
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setMenuOpen(false);
        }
      }}
    >
      <Link
        to="/divisions"
        data-active={active}
        onClick={() => setMenuOpen(false)}
        className={`nav-link inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-2 2xl:px-2.5 ${
          active ? "text-brand" : "text-foreground/75 hover:text-brand"
        }`}
      >
        Divisions
        <ChevronDown
          aria-hidden="true"
          className={`pointer-events-none h-3.5 w-3.5 transition duration-200 ${menuOpen ? "rotate-180" : ""}`}
        />
      </Link>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="desktop-division-menu"
        aria-label={menuOpen ? "Close divisions menu" : "Open divisions menu"}
        onClick={() => setMenuOpen((current) => !current)}
        className="absolute right-1 top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      />

      <div
        id="desktop-division-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`absolute left-1/2 top-full z-50 w-[min(94vw,64rem)] -translate-x-[38%] pt-4 transition duration-200 ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card/98 text-left shadow-deep backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-6 border-b border-border bg-background/55 px-5 py-3.5">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-brand">
                Division navigator
              </p>
              <p className="mt-1 font-display text-sm font-semibold text-foreground">
                Explore machines by engineering division
              </p>
            </div>
            <a
              href="/divisions#division-selector"
              onClick={() => setMenuOpen(false)}
              className="group/all inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/[0.08] px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-brand transition hover:border-brand hover:bg-brand hover:text-brand-foreground"
            >
              View divisions
              <MoveRight className="h-3.5 w-3.5 transition group-hover/all:translate-x-0.5" />
            </a>
          </div>

          <div className="grid min-h-[25rem] grid-cols-[13.5rem_18rem_minmax(0,1fr)]">
            <div className="border-r border-border bg-background/30 p-3">
              <p className="px-2 pb-2 pt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Select division
              </p>
              <div className="space-y-2">
                {divisionOptions.map((division) => {
                  const selected = division.id === selectedDivision;
                  return (
                    <button
                      key={division.id}
                      type="button"
                      onMouseEnter={() => chooseDivision(division.id)}
                      onFocus={() => chooseDivision(division.id)}
                      onClick={() => chooseDivision(division.id)}
                      aria-pressed={selected}
                      className={`group/division w-full rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-brand/45 bg-brand/[0.09] shadow-sm"
                          : "border-transparent hover:border-border hover:bg-card"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition ${
                            selected
                              ? "bg-brand text-brand-foreground"
                              : "bg-secondary text-muted-foreground group-hover/division:text-brand"
                          }`}
                        >
                          <division.Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-[13px] font-semibold leading-tight text-foreground">
                            {division.label}
                          </span>
                          <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.15em] text-brand">
                            {division.eyebrow}
                          </span>
                        </span>
                      </span>
                      <span className="mt-2.5 block text-[10px] leading-relaxed text-muted-foreground">
                        {division.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Link
                to="/machines"
                search={{ division: selectedDivision }}
                className="group/catalogue mt-3 flex items-center justify-between rounded-lg px-2.5 py-2 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-brand transition hover:bg-brand/[0.07]"
              >
                Full catalogue
                <MoveRight className="h-3.5 w-3.5 transition group-hover/catalogue:translate-x-0.5" />
              </Link>
            </div>

            <div className="border-r border-border p-3">
              <p className="px-2 pb-2 pt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Product categories
              </p>
              <div className="space-y-1">
                {visibleSections.map((section, index) => {
                  const selected = section.id === focusedSection.id;
                  return (
                    <a
                      key={section.id}
                      href={sectionHref(section)}
                      onMouseEnter={() => setSelectedSection(section.id)}
                      onFocus={() => setSelectedSection(section.id)}
                      className={`group/section flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition ${
                        selected
                          ? "bg-secondary/80 text-brand"
                          : "text-foreground hover:bg-secondary/45"
                      }`}
                    >
                      <span
                        className={`font-mono text-[9px] font-semibold ${
                          selected ? "text-brand" : "text-muted-foreground/60"
                        }`}
                      >
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[12px] font-semibold leading-snug">
                          {section.label}
                        </span>
                        <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.13em] text-muted-foreground">
                          {section.machines.length} options
                        </span>
                      </span>
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition ${
                          selected ? "translate-x-0.5 text-brand" : "text-muted-foreground/50"
                        }`}
                      />
                    </a>
                  );
                })}
              </div>
            </div>

            <div
              key={focusedSection.id}
              className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-1 p-5 duration-200"
            >
              <div className="border-b border-border pb-3">
                <p className="font-display text-base font-semibold text-foreground">
                  {focusedSection.label}
                </p>
                <p className="mt-1.5 max-w-md text-[11px] leading-relaxed text-muted-foreground">
                  {focusedSection.description}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {focusedSection.machines.map((machine) => (
                  <Link
                    key={machine.slug}
                    to="/machines/$slug"
                    params={{ slug: machine.slug }}
                    className="group/product flex min-h-11 items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-[11px] leading-snug text-foreground/75 transition hover:border-brand/20 hover:bg-brand/[0.07] hover:text-brand"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-secondary font-mono text-[8px] text-muted-foreground transition group-hover/product:bg-brand group-hover/product:text-brand-foreground">
                      {machine.code.split(".").at(-1)}
                    </span>
                    <span>{machine.title}</span>
                  </Link>
                ))}
              </div>

              <a
                href={sectionHref(focusedSection)}
                className="group/range mt-4 inline-flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-brand"
              >
                Explore this category
                <MoveRight className="h-3.5 w-3.5 transition group-hover/range:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileDivisionMenu({
  active,
  onNavigate,
}: {
  active: boolean;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<ProductSection | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background/35">
      <div className="flex items-center">
        <Link
          to="/divisions"
          onClick={onNavigate}
          className={`min-w-0 flex-1 rounded-l-xl px-4 py-2.5 font-display text-[15px] transition ${
            active ? "bg-brand/12 font-semibold text-brand" : "font-medium text-foreground/85"
          }`}
        >
          Divisions
        </Link>
        <button
          type="button"
          aria-label={expanded ? "Close division menu" : "Open division menu"}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
          className="grid h-11 w-12 place-items-center border-l border-border text-brand transition hover:bg-brand/[0.08]"
        >
          <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && (
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 border-t border-border p-2 duration-200">
          {divisionOptions.map((division) => {
            const divisionSections = sections.filter((section) => section.division === division.id);
            return (
              <div
                key={division.id}
                className="mb-2 overflow-hidden rounded-lg border border-border/70 bg-card/45 last:mb-0"
              >
                <Link
                  to="/machines"
                  search={{ division: division.id }}
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 border-b border-border/70 bg-brand/[0.07] px-3 py-2.5"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-brand/12 text-brand">
                    <division.Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold text-foreground">
                      {division.label}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-brand">
                      {division.eyebrow}
                    </span>
                  </span>
                  <MoveRight className="ml-auto h-3.5 w-3.5 text-brand" />
                </Link>

                <div className="p-1.5">
                  {divisionSections.map((section) => {
                    const sectionOpen = expandedSection === section.id;
                    return (
                      <div key={section.id} className="border-b border-border/55 last:border-b-0">
                        <button
                          type="button"
                          aria-expanded={sectionOpen}
                          onClick={() =>
                            setExpandedSection((current) =>
                              current === section.id ? null : section.id,
                            )
                          }
                          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2.5 text-left transition hover:bg-secondary/45"
                        >
                          <span className="flex-1 font-display text-xs font-semibold text-foreground/85">
                            {section.label}
                          </span>
                          <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                            {section.machines.length}
                          </span>
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-brand transition ${
                              sectionOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {sectionOpen && (
                          <div className="grid gap-0.5 px-2 pb-2">
                            {section.machines.map((machine) => (
                              <Link
                                key={machine.slug}
                                to="/machines/$slug"
                                params={{ slug: machine.slug }}
                                onClick={onNavigate}
                                className="flex items-center gap-2 rounded-md px-2 py-2 text-[11px] leading-snug text-muted-foreground transition hover:bg-brand/[0.07] hover:text-brand"
                              >
                                <ChevronRight className="h-3 w-3 shrink-0 text-brand/70" />
                                {machine.title}
                              </Link>
                            ))}
                            <a
                              href={sectionHref(section)}
                              onClick={onNavigate}
                              className="px-2 py-2 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-brand"
                            >
                              View category
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
