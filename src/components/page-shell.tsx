import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Linkedin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BrandLogo } from "@/components/brand-logo";
import { useSiteContent } from "@/lib/site-content";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />
      <div className="pt-28 sm:pt-32">{children}</div>
      <SiteFooter />
      <FloatingActions />
    </main>
  );
}

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
}: {
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden bg-carbon px-5 py-16 sm:px-8 sm:py-24 ${image ? "on-dark" : ""}`}
    >
      {image && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/88 via-carbon/82 to-carbon" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/15 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">{kicker}</div>
        <h1 className="reveal mx-auto mt-4 max-w-4xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-bold tracking-[-0.03em]">
          {title}
        </h1>
        {subtitle && (
          <p
            className="reveal mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

function FloatingActions() {
  const content = useSiteContent("global");
  return (
    <div className="floating-actions fixed bottom-7 right-7 z-40 hidden flex-col gap-3 transition-opacity duration-300 sm:flex">
      <a
        href={`mailto:${content.automation_email}`}
        aria-label="Email Modtech"
        className="group grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground shadow-glow ring-2 ring-white/10 transition hover:scale-110"
      >
        <Mail className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-carbon px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground shadow-deep group-hover:block">
          Email Modtech
        </span>
      </a>
    </div>
  );
}

function SiteFooter() {
  const content = useSiteContent("global");
  const links: Array<{
    to:
      | "/"
      | "/about"
      | "/divisions"
      | "/solutions"
      | "/machines"
      | "/industries"
      | "/process"
      | "/news"
      | "/blog"
      | "/contact";
    label: string;
  }> = [
    { to: "/about", label: "About Us" },
    { to: "/divisions", label: "Divisions" },
    { to: "/machines", label: "Products / Machines" },
    { to: "/solutions", label: "Services / Solutions" },
    { to: "/industries", label: "Industries Served" },
    { to: "/process", label: "Process" },
    { to: "/news", label: "Resources / News" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact Us" },
  ];
  const socials = [
    { href: "https://www.linkedin.com/", Icon: Linkedin, label: "LinkedIn" },
    { href: "https://www.facebook.com/", Icon: Facebook, label: "Facebook" },
    { href: "https://www.instagram.com/", Icon: Instagram, label: "Instagram" },
    { href: "https://www.youtube.com/", Icon: Youtube, label: "YouTube" },
    { href: "https://twitter.com/", Icon: Twitter, label: "Twitter / X" },
  ];
  return (
    <footer className="relative border-t border-border bg-carbon-2 px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex flex-col gap-3" aria-label="Modtech Machinery — home">
            <BrandLogo className="h-11 text-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
              Investment Casting · Robotics &amp; Automation
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {content.company_tagline}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition hover:-translate-y-0.5 hover:border-brand/60 hover:text-brand"
              >
                <s.Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            / navigate
          </div>
          <nav className="mt-4 grid grid-cols-2 gap-y-2 font-display text-sm text-muted-foreground">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="transition hover:text-brand">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            / reach us
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${content.primary_email}`}
                className="inline-flex items-center gap-2 transition hover:text-brand"
              >
                <Mail className="h-4 w-4 text-brand" /> {content.primary_email}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${content.automation_email}`}
                className="inline-flex items-center gap-2 transition hover:text-brand"
              >
                <Mail className="h-4 w-4 text-brand" /> {content.automation_email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>{content.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Modtech Machinery · All rights reserved
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {content.footer_line}
        </p>
      </div>
    </footer>
  );
}
