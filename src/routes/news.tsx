import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MapPin,
  Newspaper,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { MarkdownContent } from "@/components/markdown-content";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { news, exhibitions, categoryMeta, type Category } from "@/content/site-data";
import { automationImages } from "@/content/automation-data";
import { DEMO_MODE, getDemoRows } from "@/lib/demo-admin";
import {
  CATEGORY_LABELS,
  KIND_LABELS,
  fetchPublishedPosts,
  formatDate,
  type BlogPost,
} from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";

type PublicNewsItem = (typeof news)[number] & { body?: string };
type PublicExhibition = (typeof exhibitions)[number];
type ContentFilter = "all" | "news" | "insights";

type UnifiedStory = {
  id: string;
  source: "post" | "news";
  contentType: Exclude<ContentFilter, "all">;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  category: string;
  label: string;
  date: string;
  slug?: string;
  readMinutes?: number;
  pinned: boolean;
};

function normalizeCategory(value: unknown): Category {
  const category = String(value ?? "automation");
  if (category === "robotic") return "robotics";
  return category === "casting" || category === "robotics" || category === "automation"
    ? category
    : "automation";
}

function mapNewsRows(rows: Record<string, unknown>[]): PublicNewsItem[] {
  return rows
    .filter((item) => item["published"] !== false)
    .map((item) => ({
      tag: String(item["tag"] ?? "News"),
      date: String(item["date_label"] ?? ""),
      title: String(item["title"] ?? "Untitled"),
      excerpt: String(item["excerpt"] ?? ""),
      body: String(item["body"] ?? ""),
      image: String(item["image_url"] || automationImages.palletizingLine),
      imageWebp: String(item["image_url"] || automationImages.palletizingLine),
      category: normalizeCategory(item["category"]),
    }));
}

async function loadNews(): Promise<PublicNewsItem[]> {
  if (DEMO_MODE) {
    const local = mapNewsRows(getDemoRows("news_items"));
    return local.length > 0 ? local : news;
  }
  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const items = mapNewsRows((data ?? []) as Record<string, unknown>[]);
  return items.length > 0 ? items : news;
}

function mapExhibitionRows(rows: Record<string, unknown>[]): PublicExhibition[] {
  return rows
    .filter((item) => item["published"] !== false)
    .map((item) => ({
      title: String(item["title"] ?? "Untitled event"),
      date: String(item["date_label"] ?? ""),
      location: String(item["location"] ?? ""),
      image: String(item["image_url"] || automationImages.facility),
    }));
}

async function loadExhibitions(): Promise<PublicExhibition[]> {
  if (DEMO_MODE) {
    const local = mapExhibitionRows(getDemoRows("exhibitions"));
    return local.length > 0 ? local : exhibitions;
  }
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const items = mapExhibitionRows((data ?? []) as Record<string, unknown>[]);
  return items.length > 0 ? items : exhibitions;
}

function postToStory(post: BlogPost): UnifiedStory {
  return {
    id: `post-${post.id}`,
    source: "post",
    contentType: post.kind === "news" ? "news" : "insights",
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    image: post.cover_url || automationImages.casting,
    category: post.category,
    label: KIND_LABELS[post.kind] ?? post.kind,
    date: formatDate(post.published_at),
    slug: post.slug,
    readMinutes: post.read_minutes,
    pinned: post.pinned,
  };
}

function newsToStory(item: PublicNewsItem, index: number): UnifiedStory {
  return {
    id: `news-${index}-${item.title}`,
    source: "news",
    contentType: "news",
    title: item.title,
    excerpt: item.excerpt,
    body: item.body || item.excerpt,
    image: item.image,
    category: item.category,
    label: item.tag,
    date: item.date,
    pinned: false,
  };
}

export const Route = createFileRoute("/news")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "News & Insights — Modtech Machinery" },
      {
        name: "description",
        content:
          "Modtech news, engineering articles, case studies and exhibition updates in one place.",
      },
      { property: "og:title", content: "Modtech News & Engineering Insights" },
      {
        property: "og:description",
        content: "Factory stories, technical knowledge and event updates from Modtech Machinery.",
      },
    ],
  }),
  component: NewsInsightsPage,
});

function NewsInsightsPage() {
  useRevealOnScroll();
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState<ContentFilter>("all");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<UnifiedStory | null>(null);
  const queryClient = useQueryClient();
  const { data: loadedNews, isLoading: newsLoading } = useQuery({
    queryKey: ["public-news"],
    queryFn: loadNews,
  });
  const { data: loadedPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPublishedPosts,
  });
  const { data: loadedExhibitions } = useQuery({
    queryKey: ["public-exhibitions"],
    queryFn: loadExhibitions,
  });

  const newsItems = loadedNews ?? news;
  const posts = useMemo(() => loadedPosts ?? [], [loadedPosts]);
  const eventItems = loadedExhibitions ?? exhibitions;
  const stories = useMemo(
    () => [...posts.map(postToStory), ...newsItems.map((item, index) => newsToStory(item, index))],
    [newsItems, posts],
  );
  const availableCategories = useMemo(
    () => Array.from(new Set(stories.map((story) => story.category))),
    [stories],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return stories.filter((story) => {
      if (contentType !== "all" && story.contentType !== contentType) return false;
      if (category !== "all" && story.category !== category) return false;
      if (!needle) return true;
      return [story.title, story.excerpt, story.body, story.label]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [category, contentType, query, stories]);

  const hasFilters = query.trim().length > 0 || contentType !== "all" || category !== "all";
  const featured = hasFilters ? undefined : (filtered.find((story) => story.pinned) ?? filtered[0]);
  const remaining = filtered.filter((story) => story.id !== featured?.id);
  const newsCount = stories.filter((story) => story.contentType === "news").length;
  const insightCount = stories.filter((story) => story.contentType === "insights").length;

  const clearFilters = () => {
    setQuery("");
    setContentType("all");
    setCategory("all");
  };

  useEffect(() => {
    const sync = () => {
      void queryClient.invalidateQueries({ queryKey: ["public-news"] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["public-exhibitions"] });
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [queryClient]);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  return (
    <PageShell>
      <section className="on-dark relative isolate overflow-hidden bg-carbon px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-20">
          <img
            src={automationImages.palletizingLine}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/95 to-carbon/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/35" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-25" />
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand/15 blur-[130px]" />

        <div className="mx-auto max-w-7xl">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-brand backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> News · Insights · Events
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <h1 className="reveal max-w-4xl font-display text-[clamp(2.8rem,6vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.05em]">
                Ideas in motion.{" "}
                <span className="block text-gradient-brand">Progress in practice.</span>
              </h1>
              <p
                className="reveal mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-lg"
                data-reveal-delay="100"
              >
                Company news, engineering knowledge, real-world case studies and exhibition updates
                — now in one focused hub.
              </p>
            </div>
            <div className="reveal grid grid-cols-3 gap-3" data-reveal-delay="180">
              <HeroStat value={newsCount} label="News" Icon={Newspaper} />
              <HeroStat value={insightCount} label="Insights" Icon={BookOpen} />
              <HeroStat value={eventItems.length} label="Events" Icon={CalendarDays} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-background px-5 py-14 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-15" />
        <div className="relative mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand">
                Knowledge centre
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Explore the latest from Modtech.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-right">
              Search across announcements, technical articles and field-proven case studies.
            </p>
          </header>

          <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-card backdrop-blur sm:p-6">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search news, articles, case studies or topics..."
                aria-label="Search news and insights"
                className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
              />
            </label>

            <div className="mt-5 grid gap-5 border-t border-border pt-5 lg:grid-cols-[auto_1fr] lg:gap-10">
              <FilterGroup label="Content">
                {(["all", "news", "insights"] as ContentFilter[]).map((value) => (
                  <FilterChip
                    key={value}
                    active={contentType === value}
                    onClick={() => setContentType(value)}
                  >
                    {value === "all" ? "All stories" : value === "news" ? "News" : "Insights"}
                  </FilterChip>
                ))}
              </FilterGroup>
              <FilterGroup label="Topic">
                <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                  All topics
                </FilterChip>
                {availableCategories.map((value) => (
                  <FilterChip
                    key={value}
                    active={category === value}
                    onClick={() => setCategory(value)}
                  >
                    {CATEGORY_LABELS[value] ??
                      categoryMeta[value as Category]?.label ??
                      value.replaceAll("_", " ")}
                  </FilterChip>
                ))}
              </FilterGroup>
            </div>

            {hasFilters && (
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  {filtered.length} matching {filtered.length === 1 ? "story" : "stories"}
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-brand transition hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" /> Clear filters
                </button>
              </div>
            )}
          </div>

          {(newsLoading || postsLoading) && stories.length === 0 && <LoadingGrid />}

          {!newsLoading && !postsLoading && filtered.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/30 px-6 py-14 text-center">
              <Search className="mx-auto h-7 w-7 text-brand" />
              <h3 className="mt-4 font-display text-xl font-bold">No matching stories found.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search or reset the filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-brand hover:underline"
              >
                Show all stories
              </button>
            </div>
          )}

          {featured && (
            <section className="mt-12" aria-label="Featured story">
              <StoryCard story={featured} featured onOpen={setSelected} />
            </section>
          )}

          {remaining.length > 0 && (
            <section className="mt-14" aria-labelledby="latest-stories-heading">
              <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">
                    Latest stories
                  </p>
                  <h3 id="latest-stories-heading" className="mt-2 font-display text-2xl font-bold">
                    News, articles & case studies
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">{remaining.length} stories</span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {remaining.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index} onOpen={setSelected} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-carbon px-5 py-16 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-35" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-brand/10 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="reveal-on-scroll flex flex-col gap-5 border-b border-foreground/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand">
                Exhibitions & events
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Meet our team <span className="text-gradient-brand">on the show floor.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-foreground/55 sm:text-right">
              See Modtech machinery and connect with our engineers at upcoming industry events.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {eventItems.map((event, index) => (
              <article
                key={`${event.title}-${event.date}`}
                className="reveal-on-scroll group overflow-hidden rounded-2xl border border-foreground/15 bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/60"
                data-reveal-delay={index * 80}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-carbon-2">
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-carbon/75 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                    Exhibition
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold leading-snug tracking-tight transition group-hover:text-brand">
                    {event.title}
                  </h3>
                  <div className="mt-4 grid gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-brand" /> {event.date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-brand" /> {event.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selected && <StoryDialog story={selected} onClose={() => setSelected(null)} />}
    </PageShell>
  );
}

function HeroStat({
  value,
  label,
  Icon,
}: {
  value: number;
  label: string;
  Icon: typeof Newspaper;
}) {
  return (
    <div className="rounded-2xl border border-foreground/15 bg-foreground/[0.04] p-4 backdrop-blur sm:p-5">
      <Icon className="h-4 w-4 text-brand" />
      <span className="mt-5 block font-display text-3xl font-bold sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </span>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.17em] transition ${
        active
          ? "border-brand bg-brand text-brand-foreground shadow-glow"
          : "border-border bg-background text-muted-foreground hover:border-brand/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function StoryCard({
  story,
  index = 0,
  featured = false,
  onOpen,
}: {
  story: UnifiedStory;
  index?: number;
  featured?: boolean;
  onOpen: (story: UnifiedStory) => void;
}) {
  const cardClass = `group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-deep ${
    featured ? "grid lg:grid-cols-[1.15fr_0.85fr]" : "flex h-full flex-col"
  }`;
  const content = (
    <>
      <div
        className={`relative overflow-hidden bg-carbon-2 ${featured ? "min-h-72 lg:min-h-[28rem]" : "aspect-[16/10]"}`}
      >
        <img
          src={story.image}
          alt={story.title}
          loading={featured ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-foreground shadow-glow">
            {story.label}
          </span>
          {featured && (
            <span className="rounded-full border border-white/20 bg-carbon/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75 backdrop-blur">
              Featured
            </span>
          )}
        </div>
      </div>
      <div className={`flex flex-1 flex-col ${featured ? "justify-center p-7 sm:p-10" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>{CATEGORY_LABELS[story.category] ?? story.category}</span>
          <span className="h-1 w-1 rounded-full bg-brand" />
          <span>{story.date}</span>
        </div>
        <h3
          className={`mt-3 font-display font-bold leading-tight tracking-tight transition group-hover:text-brand ${
            featured ? "text-2xl sm:text-4xl" : "text-xl"
          }`}
        >
          {story.title}
        </h3>
        <p
          className={`mt-3 text-sm leading-relaxed text-muted-foreground ${featured ? "line-clamp-4" : "line-clamp-3"}`}
        >
          {story.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            {story.readMinutes ? (
              <>
                <Clock3 className="h-3.5 w-3.5" /> {story.readMinutes} min read
              </>
            ) : (
              <>
                <Newspaper className="h-3.5 w-3.5" /> News update
              </>
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 text-brand">
            Read story <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </>
  );

  if (story.source === "post" && story.slug) {
    return (
      <Link
        to="/blog/$slug"
        params={{ slug: story.slug }}
        className={cardClass}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className={`${cardClass} text-left`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {content}
    </button>
  );
}

function LoadingGrid() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading stories">
      {[0, 1, 2].map((index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card/50">
          <div className="aspect-[16/10] animate-pulse bg-secondary/50" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-2/5 animate-pulse rounded bg-secondary" />
            <div className="h-6 w-4/5 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-full animate-pulse rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StoryDialog({ story, onClose }: { story: UnifiedStory; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-carbon/85 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-dialog-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background shadow-deep">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
            {story.label} · {story.date}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close story"
            className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:border-brand hover:text-brand"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <img src={story.image} alt="" className="aspect-[16/7] w-full object-cover" />
        <div className="px-5 py-7 sm:px-8 sm:py-9">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {CATEGORY_LABELS[story.category] ?? story.category}
          </div>
          <h2
            id="story-dialog-title"
            className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight"
          >
            {story.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{story.excerpt}</p>
          <div className="mt-8 border-t border-border pt-8">
            <MarkdownContent value={story.body} />
          </div>
        </div>
      </article>
    </div>
  );
}
