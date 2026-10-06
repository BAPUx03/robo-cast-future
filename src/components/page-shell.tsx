import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bot, Factory, Linkedin, Mail, MapPin } from "lucide-react";
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
  const enquiryContacts = [
    {
      label: "Investment Casting Machines",
      description: "New machine requirements",
      email: content.primary_email,
      Icon: Factory,
    },
    {
      label: "Robotics & Automation",
      description: "Automation project enquiries",
      email: content.automation_email,
      Icon: Bot,
    },
  ];
  const links: Array<{
    to:
      | "/"
      | "/about"
      | "/divisions"
      | "/solutions"
      | "/industries"
      | "/process"
      | "/gallery"
      | "/blog"
      | "/contact";
    label: string;
  }> = [
    { to: "/about", label: "About Us" },
    { to: "/divisions", label: "Divisions / Machines" },
    { to: "/solutions", label: "Services / Solutions" },
    { to: "/industries", label: "Industries Served" },
    { to: "/process", label: "Process" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blogs" },
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
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.72fr_1.3fr] lg:gap-12">
        <div>
          <Link to="/" className="inline-flex flex-col gap-3" aria-label="Modtech Machine — home">
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
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <h2 className="font-display text-sm font-semibold text-foreground">
              Project enquiries
            </h2>
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-brand">
              Choose a division
            </span>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {enquiryContacts.map((contact) => (
              <li key={contact.label}>
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent(`${contact.label} enquiry`)}`}
                  className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/65 p-4 transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:bg-card hover:shadow-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  aria-label={`Email Modtech for ${contact.label}`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand transition duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-brand-foreground">
                      <contact.Icon className="h-4 w-4" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                  </span>
                  <span className="mt-4 font-display text-sm font-semibold leading-snug text-foreground">
                    {contact.label}
                  </span>
                  <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                    {contact.description}
                  </span>
                  <span className="mt-3 inline-flex min-w-0 items-center gap-1.5 break-all text-[11px] font-medium tracking-[-0.015em] text-brand xl:text-[10px] 2xl:text-[11px]">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {contact.email}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{content.address}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Modtech Machine · All rights reserved
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {content.footer_line}
        </p>
      </div>
    </footer>
  );
}
