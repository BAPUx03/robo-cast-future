import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Mail, Megaphone, Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";
import { DesktopMachineMenu, MobileMachineMenu } from "@/components/machine-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  fetchPublicAnnouncement,
  isAnnouncementActive,
  safeAnnouncementUrl,
} from "@/lib/announcement";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/solutions", label: "Solutions" },
  { to: "/industries", label: "Industries" },
  { to: "/process", label: "Process" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blogs" },
  { to: "/contact", label: "Contact" },
] as const;

function AnnouncementBar() {
  const { data: announcement } = useQuery({
    queryKey: ["public-announcement"],
    queryFn: fetchPublicAnnouncement,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!announcement?.active_until) return;
    const end = new Date(announcement.active_until).getTime();
    if (!Number.isFinite(end) || end <= Date.now()) return;
    const timer = window.setTimeout(
      () => setNow(Date.now()),
      Math.min(end - Date.now() + 100, 2_147_483_647),
    );
    return () => window.clearTimeout(timer);
  }, [announcement?.active_until]);

  if (!isAnnouncementActive(announcement, now)) return null;

  const href = safeAnnouncementUrl(announcement!.redirect_url);
  const external = Boolean(href && /^https?:\/\//i.test(href));
  const message = announcement!.message.trim();
  const segments = Array.from({ length: 4 }, (_, index) => (
    <span key={index} aria-hidden="true" className="announcement-segment">
      <span className="announcement-signal" />
      <span>{message}</span>
      {href && (
        <span className="inline-flex items-center gap-1.5 font-semibold text-brand-foreground/75">
          Explore <ArrowUpRight className="h-3 w-3" />
        </span>
      )}
    </span>
  ));
  const trackClass =
    "announcement-track focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-foreground/60";

  return (
    <div className="announcement-bar" aria-label={`Announcement: ${message}`}>
      <div className="announcement-label" aria-hidden="true">
        <Megaphone className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Modtech update</span>
        <span className="sm:hidden">Update</span>
      </div>
      <div className="announcement-viewport">
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={trackClass}
            aria-label={`${message}. Open announcement.`}
          >
            {segments}
          </a>
        ) : (
          <div className={trackClass}>{segments}</div>
        )}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isNavItemActive = (to: (typeof NAV_ITEMS)[number]["to"]) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  const isMachinesActive = location.pathname.startsWith("/machines");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
      <AnnouncementBar />

      <div
        className={`mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto] ${scrolled ? "py-3" : "py-4"} transition-[padding] duration-300`}
      >
        <Link
          to="/"
          className="group inline-flex min-w-0 items-center gap-3.5 justify-self-start"
          aria-label="Modtech Machine — home"
        >
          <BrandLogo className="h-9 text-foreground transition-colors group-hover:text-brand sm:h-10" />
          <span className="hidden h-9 w-px bg-border 2xl:block" />
          <span className="hidden font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground 2xl:block">
            Investment Casting
            <span className="block text-brand">Robotics &amp; Automation</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-0 font-display text-[12px] font-medium xl:flex 2xl:text-[13px]">
          {NAV_ITEMS.map((item, index) => (
            <div key={item.to} className="contents">
              <Link
                to={item.to}
                data-active={isNavItemActive(item.to)}
                className={`nav-link whitespace-nowrap rounded-md px-2 py-2 2xl:px-2.5 ${
                  isNavItemActive(item.to) ? "text-brand" : "text-foreground/75 hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
              {index === 1 && <DesktopMachineMenu active={isMachinesActive} />}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:translate-y-[-1px] 2xl:inline-flex"
          >
            Contact Us
            <span className="h-1.5 w-1.5 rounded-full bg-brand-foreground/70 blink-dot" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground transition hover:border-brand/50 hover:text-brand xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-border bg-card/95 backdrop-blur-xl xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.to} className="contents">
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  data-active={isNavItemActive(item.to)}
                  className={`rounded-lg px-4 py-2.5 font-display text-[15px] transition ${
                    isNavItemActive(item.to)
                      ? "bg-brand/12 font-semibold text-brand"
                      : "font-medium text-foreground/85 hover:bg-secondary/40 hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
                {index === 1 && (
                  <MobileMachineMenu active={isMachinesActive} onNavigate={() => setOpen(false)} />
                )}
              </div>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <a
                href="mailto:sales.automation@modtechworld.com"
                className="inline-flex items-center gap-2 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <Mail className="h-3.5 w-3.5 text-brand" /> sales.automation@modtechworld.com
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
