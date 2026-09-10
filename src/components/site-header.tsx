import { useEffect, useState } from "react";
import { Phone, Mail, Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { to: "/",           label: "Home" },
  { to: "/about",      label: "About Us" },
  { to: "/divisions",  label: "Divisions" },
  { to: "/machines",   label: "Products" },
  { to: "/automation", label: "Robotics & Automation" },
  { to: "/solutions",  label: "Services" },
  { to: "/industries", label: "Industries Served" },
  { to: "/news",       label: "Resources" },
  { to: "/blog",       label: "Blog" },
  { to: "/contact",    label: "Contact Us" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock the page behind the open menu so only the menu itself scrolls
  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", open);
    return () => document.documentElement.classList.remove("nav-open");
  }, [open]);

  return (
    <header
      data-scrolled={scrolled}
      className="nav-shell fixed inset-x-0 top-0 z-40 border-b border-transparent"
    >
      <div className="hidden border-b border-border/40 bg-carbon-2/40 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 whitespace-nowrap px-5 py-1.5 sm:px-8">
          <div className="flex min-w-0 items-center gap-5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand" />
              Indian Robotics & Casting Manufacturer
            </span>
            <span className="opacity-40">|</span>
            <span>24/7 Engineering Support</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <a href="tel:+910000000000" className="inline-flex items-center gap-1.5 transition hover:text-brand">
              <Phone className="h-3 w-3" /> +91 00000 00000
            </a>
            <a href="mailto:info@modtechworld.com" className="inline-flex items-center gap-1.5 transition hover:text-brand">
              <Mail className="h-3 w-3" /> info@modtechworld.com
            </a>
          </div>
        </div>
      </div>

      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 ${scrolled ? "py-3" : "py-4"} transition-[padding] duration-300`}>
        <Link to="/" className="group inline-flex min-w-0 items-center gap-3.5" aria-label="Modtech Machinery — home">
          <BrandLogo className="h-9 text-foreground transition-colors group-hover:text-brand sm:h-10" />
          <span className="hidden h-9 w-px bg-border sm:block" />
          <span className="hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground sm:block">
            Investment Casting
            <span className="block text-brand">Robotics &amp; Automation</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 font-display text-[13.5px] font-medium lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "nav-link whitespace-nowrap rounded-md px-2.5 py-2 text-brand" }}
              inactiveProps={{ className: "nav-link whitespace-nowrap rounded-md px-2.5 py-2 text-foreground/75 hover:text-brand" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-1px] xl:inline-flex"
          >
            Contact Us
            <span className="h-1.5 w-1.5 rounded-full bg-brand-foreground/70 blink-dot" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground transition hover:border-brand/50 hover:text-brand lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-border bg-card/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "rounded-lg bg-brand/12 px-4 py-2.5 font-display text-[15px] font-semibold text-brand" }}
                inactiveProps={{ className: "rounded-lg px-4 py-2.5 font-display text-[15px] font-medium text-foreground/85 transition hover:bg-secondary/40 hover:text-brand" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <a href="tel:+910000000000" className="inline-flex items-center gap-2 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Phone className="h-3.5 w-3.5 text-brand" /> +91 00000 00000
              </a>
              <a href="mailto:info@modtechworld.com" className="inline-flex items-center gap-2 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-brand" /> info@modtechworld.com
              </a>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow"
              >
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
