import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, User, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CATEGORY_LABELS, KIND_LABELS, fetchPostBySlug, fetchPublishedPosts, formatDate } from "@/lib/cms";
import { automationImages } from "@/content/automation-data";

export const Route = createFileRoute("/blog/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Article — Modtech Machinery" },
      { name: "description", content: "Insights on investment casting machinery, robotics and automation from Modtech Machinery." },
      { property: "og:title", content: "Modtech Machinery Insight" },
      { property: "og:description", content: "Engineering notes from the Modtech shop floor." },
    ],
  }),
  component: BlogArticle,
});

function BlogArticle() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({ queryKey: ["post", slug], queryFn: () => fetchPostBySlug(slug) });
  const { data: all } = useQuery({ queryKey: ["posts"], queryFn: fetchPublishedPosts });

  const related = (all ?? []).filter((p) => p.slug !== slug).slice(0, 3);

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
          <h1 className="font-display text-3xl font-bold">Article not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">This post may have been unpublished.</p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-brand-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to insights
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <article>
        <header className="relative isolate overflow-hidden bg-carbon px-5 py-16 sm:px-8 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img src={post.cover_url || automationImages.casting} alt="" aria-hidden className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-carbon/85 via-carbon/90 to-carbon" />
          </div>
          <div className="mx-auto max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-brand hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> All insights
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="rounded-full bg-brand px-3 py-1 text-brand-foreground">{KIND_LABELS[post.kind] ?? post.kind}</span>
              <span>{CATEGORY_LABELS[post.category] ?? post.category}</span>
              <span className="h-1 w-1 rounded-full bg-brand" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="inline-flex items-center gap-2"><User className="h-3.5 w-3.5 text-brand" />{post.author}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand" />{post.read_minutes} min read</span>
            </div>
          </div>
        </header>

        <div className="bg-background px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <img src={post.cover_url || automationImages.casting} alt={post.title} className="aspect-[16/9] w-full rounded-2xl border border-border object-cover" />
            <div className="mt-10 space-y-5 text-[15px] leading-[1.85] text-muted-foreground">
              {post.body.split(/\n{2,}/).map((para, i) => {
                const text = para.trim();
                if (!text) return null;
                if (text.startsWith("## ")) {
                  return <h2 key={i} className="pt-4 font-display text-2xl font-bold tracking-tight text-foreground">{text.replace("## ", "")}</h2>;
                }
                if (text.startsWith("- ")) {
                  return (
                    <ul key={i} className="space-y-2 pl-1">
                      {text.split("\n").map((li, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          <span>{li.replace(/^-\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{text}</p>;
              })}
            </div>

            {post.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">#{t}</span>
                ))}
              </div>
            )}

            <div className="mt-12 rounded-2xl border border-border bg-card p-7">
              <h3 className="font-display text-xl font-bold">Planning a similar line?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Send us the part, the volume and the cycle time — we'll come back with a blueprint.</p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5">
                Talk to engineering <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-border bg-carbon px-5 py-14 sm:px-8">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">/ keep reading</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-3">
                {related.map((p) => (
                  <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-brand/60">
                    <img src={p.cover_url || automationImages.casting} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="p-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{formatDate(p.published_at)}</div>
                      <h3 className="mt-2 font-display text-base font-semibold leading-tight transition group-hover:text-brand">{p.title}</h3>
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
