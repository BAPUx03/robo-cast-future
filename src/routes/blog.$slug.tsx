import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, User, ArrowRight, BookOpen, Check, List, Share2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { MarkdownContent } from "@/components/markdown-content";
import {
  CATEGORY_LABELS,
  KIND_LABELS,
  fetchPostBySlug,
  fetchPublishedPosts,
  formatDate,
  slugify,
} from "@/lib/cms";
import { automationImages } from "@/content/automation-data";

export const Route = createFileRoute("/blog/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Article — Modtech Machinery" },
      {
        name: "description",
        content:
          "Insights on investment casting machinery, robotics and automation from Modtech Machinery.",
      },
      { property: "og:title", content: "Modtech Machinery Insight" },
      { property: "og:description", content: "Engineering notes from the Modtech shop floor." },
    ],
  }),
  component: BlogArticle,
});

function BlogArticle() {
  const { slug } = Route.useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [shared, setShared] = useState(false);
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["post", slug], queryFn: () => fetchPostBySlug(slug) });
  const { data: all } = useQuery({ queryKey: ["posts"], queryFn: fetchPublishedPosts });

  const related = (all ?? [])
    .filter((item) => item.slug !== slug && item.kind !== "news")
    .sort((a, b) => Number(b.category === post?.category) - Number(a.category === post?.category))
    .slice(0, 3);

  const sections = useMemo(
    () =>
      (post?.body ?? "")
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter((part) => part.startsWith("## ") || part.startsWith("### "))
        .map((part) => {
          const level = part.startsWith("### ") ? 3 : 2;
          const title = part.replace(/^#{2,3}\s+/, "");
          return { level, title, id: slugify(title) };
        }),
    [post?.body],
  );

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(maxScroll > 0 ? Math.min(100, (window.scrollY / maxScroll) * 100) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [post]);

  const shareArticle = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title, text: post?.excerpt, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // Dismissing the native share sheet does not need an error state.
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-5 py-24">
          <div className="h-8 w-2/3 animate-pulse rounded bg-card" />
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-card" />
        </div>
      </PageShell>
    );
  }

  if (!post) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">
            {isError ? "Article unavailable" : "Article not found"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {isError
              ? "We could not load this article. Please try again shortly."
              : "This post may have been moved or unpublished."}
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-brand-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to insights
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden>
        <div
          className="h-full bg-brand shadow-glow transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      <article>
        <header className="relative isolate overflow-hidden bg-carbon px-5 py-16 sm:px-8 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img
              src={post.cover_url || automationImages.casting}
              alt=""
              aria-hidden
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-carbon/85 via-carbon/90 to-carbon" />
          </div>
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-brand hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Blog & insights
              </Link>
            </nav>
            <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="rounded-full bg-brand px-3 py-1 text-brand-foreground">
                {KIND_LABELS[post.kind] ?? post.kind}
              </span>
              <span>{CATEGORY_LABELS[post.category] ?? post.category}</span>
              <span className="h-1 w-1 rounded-full bg-brand" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-brand" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-brand" />
                {post.read_minutes} min read
              </span>
              <button
                type="button"
                onClick={shareArticle}
                className="inline-flex items-center gap-2 transition hover:text-brand"
              >
                {shared ? (
                  <Check className="h-3.5 w-3.5 text-brand" />
                ) : (
                  <Share2 className="h-3.5 w-3.5 text-brand" />
                )}
                {shared ? "Shared" : "Share article"}
              </button>
            </div>
          </div>
        </header>

        <div className="bg-background px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <img
              src={post.cover_url || automationImages.casting}
              alt={post.title}
              className="aspect-[16/9] w-full rounded-2xl border border-border object-cover"
            />

            {sections.length > 0 && (
              <nav
                className="mt-8 rounded-2xl border border-border bg-card/60 p-5 shadow-card sm:p-6"
                aria-label="Article contents"
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                  <List className="h-4 w-4" /> In this article
                </div>
                <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                  {sections.map((section, index) => (
                    <li
                      key={`${section.id}-${index}`}
                      className={section.level === 3 ? "sm:pl-4" : ""}
                    >
                      <a
                        href={`#${section.id}`}
                        className="group flex items-start gap-2 text-sm leading-relaxed text-muted-foreground transition hover:text-brand"
                      >
                        <span className="mt-0.5 font-mono text-[10px] text-brand">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="mt-10">
              <MarkdownContent value={post.body} />
            </div>

            {post.tags?.length > 0 && (
              <div
                className="mt-10 flex flex-wrap gap-2 border-t border-border pt-7"
                aria-label="Article topics"
              >
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-12 rounded-2xl border border-border bg-card p-7">
              <h3 className="font-display text-xl font-bold">Planning a similar line?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Send us the part, the volume and the cycle time — we'll come back with a blueprint.
              </p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5"
              >
                Talk to engineering <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <Link
              to="/blog"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand transition hover:gap-3"
            >
              <BookOpen className="h-4 w-4" /> Browse all insights
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-border bg-carbon px-5 py-14 sm:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">
                    / keep reading
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold">
                    Related engineering insights
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand sm:inline-flex"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-5 grid gap-6 sm:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-brand/60"
                  >
                    <img
                      src={p.cover_url || automationImages.casting}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="p-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {formatDate(p.published_at)}
                      </div>
                      <h3 className="mt-2 font-display text-base font-semibold leading-tight transition group-hover:text-brand">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
