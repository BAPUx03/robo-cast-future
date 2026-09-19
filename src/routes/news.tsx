import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, X } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { news, exhibitions, categoryMeta, type Category } from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { useEffect, useState } from "react";
import { useSiteContent } from "@/lib/site-content";
import { getDemoRows } from "@/lib/demo-admin";
import { MarkdownContent } from "@/components/markdown-content";

type PublicNewsItem = (typeof news)[number] & { body?: string };

function loadNews(): PublicNewsItem[] {
  if (!import.meta.env.DEV) return news;
  const local = getDemoRows("news_items")
    .filter((item) => item["published"] !== false)
    .map((item) => ({
      tag: String(item["tag"] ?? "News"),
      date: String(item["date_label"] ?? ""),
      title: String(item["title"] ?? "Untitled"),
      excerpt: String(item["excerpt"] ?? ""),
      body: String(item["body"] ?? ""),
      image: String(item["image_url"] || automationImages.palletizingLine),
      imageWebp: String(item["image_url"] || automationImages.palletizingLine),
      category: String(item["category"] ?? "automation") as Category,
    }));
  return local.length > 0 ? local : news;
}

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Case Studies — Modtech Machinery" },
      {
        name: "description",
        content:
          "Latest factory stories, robotic deployments and casting case studies from Modtech Machinery.",
      },
      { property: "og:title", content: "Latest @ Modtech" },
      {
        property: "og:description",
        content:
          "News, case studies and factory stories from across our robotic and casting deployments.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  useRevealOnScroll();
  const content = useSiteContent("news");
  const [newsCat, setNewsCat] = useState<Category | null>(null);
  const [items, setItems] = useState<PublicNewsItem[]>(loadNews);
  const [selected, setSelected] = useState<PublicNewsItem | null>(null);
  const filtered = newsCat ? items.filter((item) => item.category === newsCat) : items;

  useEffect(() => {
    const sync = () => setItems(loadNews());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <PageShell>
      <PageHero
        kicker={content.eyebrow}
        image={automationImages.palletizingLine}
        title={
          <>
            {content.title} <span className="text-gradient-brand">{content.accent}</span>
          </>
        }
        subtitle={content.description}
      />

      <section className="relative bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setNewsCat(null)}
              aria-pressed={newsCat === null}
              className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                newsCat === null
                  ? "border-brand bg-brand text-brand-foreground shadow-glow"
                  : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
              }`}
            >
              All stories
            </button>
            {(Object.keys(categoryMeta) as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewsCat(newsCat === c ? null : c)}
                aria-pressed={newsCat === c}
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  newsCat === c
                    ? "border-brand bg-brand text-brand-foreground shadow-glow"
                    : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-brand"
                }`}
              >
                {categoryMeta[c].label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {filtered.map((n, i) => (
              <article
                key={n.title}
                className="reveal-on-scroll group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-brand/60"
                data-reveal-delay={i * 120}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-carbon-2">
                  <picture>
                    <source srcSet={n.imageWebp} type="image/webp" />
                    <img
                      src={n.image}
                      alt={n.title}
                      loading="lazy"
                      decoding="async"
                      width={1280}
                      height={800}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-md bg-brand px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-foreground shadow-glow">
                      {n.tag}
                    </span>
                    <span className="rounded-md bg-card/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
                      {n.date}
                    </span>
                  </div>
                  <span className="absolute bottom-4 right-4 inline-flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-brand text-brand-foreground opacity-0 shadow-glow transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold leading-snug tracking-tight transition group-hover:text-brand">
                    {n.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.excerpt}</p>
                  <button
                    type="button"
                    onClick={() => setSelected(n)}
                    className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand"
                  >
                    Read story <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions & Events */}
      <section className="relative bg-carbon px-5 py-16 sm:px-8 sm:py-20">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <div className="reveal-on-scroll text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">
              / exhibitions & events
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Meet us at <span className="text-gradient-brand">global trade shows</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Modtech machinery on display across India, USA and Europe — connect with our team at
              upcoming foundry, casting and automation expos.
            </p>
          </div>

          <div className="reveal-on-scroll mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exhibitions.map((e, i) => (
              <article
                key={e.title}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-brand/60"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-carbon-2">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold leading-snug tracking-tight transition group-hover:text-brand">
                    {e.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3 text-brand" />
                      {e.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-brand" />
                      {e.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-carbon/80 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelected(null);
          }}
        >
          <article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background shadow-deep">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
                {selected.tag} · {selected.date}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close story"
                className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:border-brand hover:text-brand"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <img src={selected.image} alt="" className="aspect-[16/7] w-full object-cover" />
            <div className="px-5 py-7 sm:px-8 sm:py-9">
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
                {selected.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {selected.excerpt}
              </p>
              <div className="mt-8 border-t border-border pt-8">
                <MarkdownContent value={selected.body || selected.excerpt} />
              </div>
            </div>
          </article>
        </div>
      )}
    </PageShell>
  );
}
