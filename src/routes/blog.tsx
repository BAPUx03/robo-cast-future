import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Pin, Search, X } from "lucide-react";
import { PageHero, PageShell } from "@/components/page-shell";
import {
  CATEGORY_LABELS,
  KIND_LABELS,
  fetchPublishedPosts,
  formatDate,
  type BlogPost,
} from "@/lib/cms";
import { automationImages } from "@/content/automation-data";

export const Route = createFileRoute("/blog")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Blog & Engineering Insights — Modtech Machinery" },
      {
        name: "description",
        content:
          "Practical articles and case studies on investment casting machinery, robotics and industrial automation from Modtech Machinery.",
      },
      { property: "og:title", content: "Modtech Blog & Engineering Insights" },
      {
        property: "og:description",
        content:
          "Engineering knowledge from the Modtech shop floor—covering investment casting, robotics and automation.",
      },
    ],
  }),
  component: BlogIndex,
});

const KINDS = ["all", "blog", "article", "case_study"] as const;
const CATEGORIES = ["all", "casting", "automation", "robotics", "company"] as const;

function BlogIndex() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPublishedPosts,
  });
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  // Announcements live on /news. Keeping them out of the blog prevents the
  // same content from appearing in both sections.
  const posts = useMemo(() => (data ?? []).filter((post) => post.kind !== "news"), [data]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (kind !== "all" && post.kind !== kind) return false;
      if (category !== "all" && post.category !== category) return false;
      if (!needle) return true;
      return [post.title, post.excerpt, post.body, ...(post.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [posts, query, kind, category]);

  const kindCounts = useMemo(
    () =>
      posts.reduce<Record<string, number>>(
        (counts, post) => ({ ...counts, [post.kind]: (counts[post.kind] ?? 0) + 1 }),
        {},
      ),
    [posts],
  );
  const categoryCounts = useMemo(
    () =>
      posts.reduce<Record<string, number>>(
        (counts, post) => ({ ...counts, [post.category]: (counts[post.category] ?? 0) + 1 }),
        {},
      ),
    [posts],
  );
  const availableKinds = KINDS.filter((value) => value === "all" || kindCounts[value]);
  const availableCategories = CATEGORIES.filter(
    (value) => value === "all" || categoryCounts[value],
  );
  const hasFilters = query.trim().length > 0 || kind !== "all" || category !== "all";
  const featured = hasFilters ? undefined : (filtered.find((post) => post.pinned) ?? filtered[0]);
  const remaining = filtered.filter((post) => post.id !== featured?.id);

  const clearFilters = () => {
    setQuery("");
    setKind("all");
    setCategory("all");
  };

  return (
    <PageShell>
      <PageHero
        kicker="/ blog & insights"
        image={automationImages.casting}
        title={
          <>
            Engineering knowledge from the <span className="text-gradient-brand">shop floor</span>.
          </>
        }
        subtitle="Practical articles and real-world case studies on investment casting, robotics and industrial automation."
      />

      <section className="relative bg-background px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">
                / knowledge centre
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Explore our latest thinking.
              </h2>
            </div>
            {!isLoading && !error && (
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <BookOpen className="h-4 w-4 text-brand" />
                {posts.length} {posts.length === 1 ? "insight" : "insights"}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/60 p-5 shadow-card sm:p-6">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles, machines or topics..."
                aria-label="Search blog posts"
                className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
              />
            </label>

            <div className="grid gap-5 lg:grid-cols-2">
              <FilterGroup label="Content type">
                {availableKinds.map((value) => (
                  <FilterChip
                    key={value}
                    active={kind === value}
                    count={value === "all" ? posts.length : kindCounts[value]}
                    onClick={() => setKind(value)}
                  >
                    {value === "all" ? "All types" : KIND_LABELS[value]}
                  </FilterChip>
                ))}
              </FilterGroup>

              <FilterGroup label="Topic">
                {availableCategories.map((value) => (
                  <FilterChip
                    key={value}
                    active={category === value}
                    count={value === "all" ? posts.length : categoryCounts[value]}
                    onClick={() => setCategory(value)}
                  >
                    {value === "all" ? "All topics" : CATEGORY_LABELS[value]}
                  </FilterChip>
                ))}
              </FilterGroup>
            </div>

            {hasFilters && (
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  {filtered.length} matching {filtered.length === 1 ? "result" : "results"}
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

          {isLoading && <LoadingGrid />}

          {error && (
            <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
              <h2 className="font-display text-xl font-bold">
                Insights are temporarily unavailable.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please refresh the page or try again shortly.
              </p>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
              <Search className="mx-auto h-7 w-7 text-brand" />
              <h2 className="mt-4 font-display text-xl font-bold">No matching insights found.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another search or reset the filters.
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-brand hover:underline"
                >
                  Show all insights
                </button>
              )}
            </div>
          )}

          {featured && (
            <section className="mt-12">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">
                / featured insight
              </h2>
              <div className="mt-4">
                <PostCard post={featured} index={0} featured />
              </div>
            </section>
          )}

          {remaining.length > 0 && (
            <section className="mt-14">
              <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">
                    {hasFilters ? "/ search results" : "/ latest insights"}
                  </h2>
                  {hasFilters && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Articles matching your selected filters.
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {remaining.length} {remaining.length === 1 ? "story" : "stories"}
                </span>
              </div>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {remaining.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </section>
          )}

          {!isLoading && !error && posts.length > 0 && (
            <section className="relative mt-20 overflow-hidden rounded-3xl border border-border bg-carbon px-6 py-10 sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">
                    / put insight into production
                  </p>
                  <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Have a process challenge worth solving?
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                    Share your product, throughput target and line constraints. Our engineering team
                    will help define the right machine or automation approach.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/machines"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground transition hover:border-brand hover:text-brand"
                  >
                    Explore machines <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5"
                  >
                    Talk to engineering <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </PageShell>
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
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
        active
          ? "border-brand bg-brand text-brand-foreground shadow-glow"
          : "border-border bg-background text-muted-foreground hover:border-brand/60 hover:text-foreground"
      }`}
    >
      {children}
      <span className={`ml-2 ${active ? "text-brand-foreground/70" : "text-muted-foreground/70"}`}>
        {count}
      </span>
    </button>
  );
}

function LoadingGrid() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading articles">
      {[0, 1, 2].map((index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card/50">
          <div className="aspect-[4/3] animate-pulse bg-secondary/50" />
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

function PostCard({
  post,
  index,
  featured = false,
}: {
  post: BlogPost;
  index: number;
  featured?: boolean;
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`group animate-fade-in overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1.5 hover:border-brand/60 hover:shadow-glow ${
        featured ? "grid lg:grid-cols-[1.2fr_0.8fr]" : "flex flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden ${featured ? "min-h-64 lg:min-h-[26rem]" : "aspect-[4/3]"}`}
      >
        <img
          src={post.cover_url || automationImages.casting}
          alt={post.title}
          loading={featured ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-brand-foreground">
          {KIND_LABELS[post.kind] ?? post.kind}
        </span>
        {post.pinned && (
          <span
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-carbon/80 text-brand backdrop-blur"
            aria-label="Featured article"
          >
            <Pin className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "justify-center p-7 sm:p-10" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>{CATEGORY_LABELS[post.category] ?? post.category}</span>
          <span className="h-1 w-1 rounded-full bg-brand" />
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h3
          className={`mt-3 font-display font-bold leading-tight transition group-hover:text-brand ${
            featured ? "text-2xl sm:text-4xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>
        <p
          className={`mt-3 text-sm leading-relaxed text-muted-foreground ${featured ? "line-clamp-4" : "line-clamp-3"}`}
        >
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> {post.read_minutes} min read
          </span>
          <span className="inline-flex items-center gap-1.5 text-brand">
            Read article <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
