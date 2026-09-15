import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Pin, Clock, ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/page-shell";
import { CATEGORY_LABELS, KIND_LABELS, fetchPublishedPosts, formatDate } from "@/lib/cms";
import { automationImages } from "@/content/automation-data";

export const Route = createFileRoute("/blog")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Blog & Insights — Modtech Machinery" },
      { name: "description", content: "Articles, case studies and news on investment casting machinery, robotics and factory automation from Modtech Machinery." },
      { property: "og:title", content: "Modtech Machinery Blog & Insights" },
      { property: "og:description", content: "Investment casting, robotics and automation insights from the Modtech engineering floor." },
    ],
  }),
  component: BlogIndex,
});

const KINDS = ["all", "blog", "article", "news", "case_study"] as const;
const CATS = ["all", "casting", "automation", "robotics", "company"] as const;

function BlogIndex() {
  const { data, isLoading, error } = useQuery({ queryKey: ["posts"], queryFn: fetchPublishedPosts });
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<string>("all");
  const [cat, setCat] = useState<string>("all");

  const posts = data ?? [];
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (!needle) return true;
      return [p.title, p.excerpt, p.body, ...(p.tags ?? [])].join(" ").toLowerCase().includes(needle);
    });
  }, [posts, q, kind, cat]);

  const pinned = filtered.filter((p) => p.pinned);
  const rest = filtered.filter((p) => !p.pinned);

  return (
    <PageShell>
      <PageHero
        kicker="/ insights"
        image={automationImages.casting}
        title={<>Notes from the <span className="text-gradient-brand">shop floor</span>.</>}
        subtitle="Articles, case studies and announcements on investment casting, robotics and automation."
      />

      <section className="relative bg-background px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Search + filters */}
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search articles, machines, topics…"
                className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
                  {k === "all" ? "All types" : KIND_LABELS[k]}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                  {c === "all" ? "All topics" : CATEGORY_LABELS[c]}
                </Chip>
              ))}
            </div>
          </div>

          {isLoading && <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-card/50" />)}</div>}
          {error && <p className="mt-10 text-sm text-destructive">Could not load posts. Please refresh.</p>}

          {!isLoading && !error && filtered.length === 0 && (
            <p className="mt-12 text-center text-sm text-muted-foreground">No posts match that search yet.</p>
          )}

          {pinned.length > 0 && (
            <div className="mt-10">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ pinned</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {pinned.map((p, i) => <PostCard key={p.id} post={p} index={i} featured />)}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-12">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ latest</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
        active
          ? "border-brand bg-brand text-brand-foreground shadow-glow"
          : "border-border bg-background text-muted-foreground hover:border-brand/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function PostCard({ post, index, featured = false }: { post: import("@/lib/cms").BlogPost; index: number; featured?: boolean }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group flex animate-fade-in flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1.5 hover:border-brand/60 hover:shadow-glow"
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <img
          src={post.cover_url || automationImages.casting}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-brand-foreground">
          {KIND_LABELS[post.kind] ?? post.kind}
        </span>
        {post.pinned && (
          <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-carbon/80 text-brand">
            <Pin className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>{CATEGORY_LABELS[post.category] ?? post.category}</span>
          <span className="h-1 w-1 rounded-full bg-brand" />
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h3 className={`mt-3 font-display font-bold leading-tight transition group-hover:text-brand ${featured ? "text-xl sm:text-2xl" : "text-lg"}`}>
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" />{post.read_minutes} min read</span>
          <span className="inline-flex items-center gap-1.5 text-brand">Read <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
        </div>
      </div>
    </Link>
  );
}
