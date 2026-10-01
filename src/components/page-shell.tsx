import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Linkedin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BrandLogo } from "@/components/brand-logo";
import { useSiteContent } from "@/lib/site-content";
import { companyContact } from "@/content/automation-data";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-background pt-28 text-foreground sm:pt-32">
        {children}
      </main>
      <SiteFooter />
      <FloatingActions />
    </>
  );
}

export function PageHero({
  title,
  subtitle,
  image,
}: {
  kicker?: string;
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
        <h1 className="reveal mx-auto max-w-4xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-bold tracking-[-0.03em]">
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
  const whatsappNumber = companyContact.phone.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    "Hello Modtech, I would like to discuss a project requirement.",
  );
  return (
    <div className="floating-actions fixed bottom-5 right-4 z-40 flex flex-col gap-3 transition-opacity duration-300 sm:bottom-7 sm:right-7">
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Modtech on WhatsApp"
        title="Chat with Modtech on WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_35px_rgba(37,211,102,0.42)] ring-2 ring-white/40 transition duration-200 hover:-translate-y-1 hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25d366]/35 sm:h-16 sm:w-16"
      >
        <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-carbon px-3 py-2 font-display text-xs font-semibold text-foreground opacity-0 shadow-deep transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
        >
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.5-4.6A8.5 8.5 0 1 1 20.5 11.6Z" />
      <path d="M8.2 7.8c.3-.4.7-.4 1-.1l1.1 1.5c.2.3.2.6 0 .9l-.6.8c.8 1.7 1.8 2.7 3.5 3.5l.8-.6c.3-.2.6-.2.9 0l1.5 1.1c.3.2.3.7-.1 1-1 .9-2.2 1.1-3.6.5-2.5-1-4.9-3.4-5.9-5.9-.6-1.4-.4-2.7.5-3.6Z" />
    </svg>
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
    {
      href: "https://www.linkedin.com/company/modtech-machines-pvt-ltd",
      Icon: Linkedin,
      label: "Modtech Machines on LinkedIn",
    },
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
          <nav className="grid grid-cols-2 gap-y-2 font-display text-sm text-muted-foreground">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="transition hover:text-brand">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${content.primary_email}`}
                className="inline-flex min-w-0 items-center gap-2 break-all transition hover:text-brand"
              >
                <Mail className="h-4 w-4 text-brand" /> {content.primary_email}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${content.automation_email}`}
                className="inline-flex min-w-0 items-center gap-2 break-all transition hover:text-brand"
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
