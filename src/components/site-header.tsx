import { useEffect, useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/divisions", label: "Divisions" },
  { to: "/machines", label: "Machines" },
  { to: "/blog", label: "Blogs" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isNavItemActive = (to: (typeof NAV_ITEMS)[number]["to"]) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", open);
    return () => document.documentElement.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktopBreakpoint = window.matchMedia("(min-width: 80rem)");
    const closeOnDesktop = () => {
      if (desktopBreakpoint.matches) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    desktopBreakpoint.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktopBreakpoint.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="nav-shell fixed inset-x-0 top-0 z-40 border-b border-border">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 sm:h-[4.5rem] sm:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Link
          to="/"
          className="inline-flex min-w-0 items-center justify-self-start"
          aria-label="Modtech Machine — home"
        >
          <BrandLogo className="h-9 text-foreground sm:h-10" />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden min-w-0 items-center justify-center gap-0.5 font-display text-[13px] font-medium xl:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-active={isNavItemActive(item.to)}
              className={`nav-link whitespace-nowrap rounded-md px-2.5 py-2 ${
                isNavItemActive(item.to) ? "text-brand" : "text-foreground/80 hover:text-brand"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-site-menu"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/60 text-foreground transition hover:border-brand/50 hover:text-brand xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-site-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-border bg-card xl:hidden sm:max-h-[calc(100dvh-4.5rem)]"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                data-active={isNavItemActive(item.to)}
                className={`flex min-h-11 items-center rounded-lg px-4 py-2.5 font-display text-[15px] transition ${
                  isNavItemActive(item.to)
                    ? "bg-brand/12 font-semibold text-brand"
                    : "font-medium text-foreground/85 hover:bg-secondary/40 hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:sales.automation@modtechworld.com"
              className="mt-2 flex min-h-11 min-w-0 items-center gap-2 break-all border-t border-border px-4 pt-3 text-xs text-muted-foreground"
            >
              <Mail className="h-4 w-4 shrink-0 text-brand" />
              sales.automation@modtechworld.com
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
