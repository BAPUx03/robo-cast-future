import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Images,
  MapPin,
  Maximize2,
  X,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import {
  defaultGalleryItems,
  fetchPublishedGallery,
  GALLERY_CATEGORY_LABELS,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery";

export const Route = createFileRoute("/gallery")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gallery - Modtech Machine Global Projects & Visits" },
      {
        name: "description",
        content:
          "Explore Modtech Machine's global projects, customer visits, technical collaborations and industry events.",
      },
      { property: "og:title", content: "Our Global Presence - Modtech Machine Gallery" },
      {
        property: "og:description",
        content:
          "A visual journal of Modtech Machine's customer partnerships and engineering work around the world.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  useRevealOnScroll();
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: fetchPublishedGallery,
  });
  const items = useMemo(() => data ?? defaultGalleryItems, [data]);
  const availableCategories = useMemo(() => {
    const preferredOrder: GalleryCategory[] = ["factory", "events", "office", "facility", "team"];
    const available = new Set(items.map((item) => item.category));
    return preferredOrder.filter((value) => available.has(value));
  }, [items]);
  const itemNumberById = useMemo(
    () => new Map(items.map((item, index) => [item.id, index + 1])),
    [items],
  );
  const visibleItems = useMemo(
    () => (category === "all" ? items : items.filter((item) => item.category === category)),
    [category, items],
  );
  const selectedIndex = selectedId ? visibleItems.findIndex((item) => item.id === selectedId) : -1;
  const selected = selectedIndex >= 0 ? visibleItems[selectedIndex] : null;

  const showRelative = useCallback(
    (offset: number) => {
      if (selectedIndex < 0 || visibleItems.length < 2) return;
      const nextIndex = (selectedIndex + offset + visibleItems.length) % visibleItems.length;
      setSelectedId(visibleItems[nextIndex].id);
    },
    [selectedIndex, visibleItems],
  );

  useEffect(() => {
    const syncGallery = () => {
      void queryClient.invalidateQueries({ queryKey: ["public-gallery"] });
    };
    window.addEventListener("storage", syncGallery);
    return () => window.removeEventListener("storage", syncGallery);
  }, [queryClient]);

  useEffect(() => {
    if (!selected) return;
    document.documentElement.classList.add("nav-open");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
      if (event.key === "ArrowLeft") showRelative(-1);
      if (event.key === "ArrowRight") showRelative(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("nav-open");
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, showRelative]);

  return (
    <PageShell>
      <section className="gallery-hero on-dark relative isolate overflow-hidden bg-carbon px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_70%,rgba(70,219,169,0.12),transparent_36%),linear-gradient(135deg,#03100d_0%,#071b16_58%,#020a08_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
          <div>
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
              <Camera className="h-3.5 w-3.5" /> The Gallery
            </div>
            <h1 className="reveal mt-6 max-w-2xl font-display text-[2.7rem] font-bold leading-[0.98] tracking-[-0.05em] sm:text-[clamp(3.6rem,5.3vw,5.5rem)]">
              People. Projects. <span className="text-gradient-brand">Partnerships.</span>
            </h1>
            <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Moments from customer sites, international visits and the teams bringing Modtech
              engineering to life.
            </p>
            <div className="reveal mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/15 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              <span>
                <strong className="mr-2 font-display text-xl text-white">{items.length}</strong>{" "}
                photographs
              </span>
              <span>
                <strong className="mr-2 font-display text-xl text-white">
                  {availableCategories.length}
                </strong>{" "}
                collections
              </span>
            </div>
          </div>
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-deep sm:aspect-[16/10]">
            <img
              src={items[0]?.image_url ?? defaultGalleryItems[0].image_url}
              alt={items[0]?.alt_text ?? defaultGalleryItems[0].alt_text}
              className="h-full w-full object-cover"
              style={{ objectPosition: items[0]?.object_position ?? "50% 45%" }}
              fetchPriority="high"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon/90 via-carbon/45 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand">
                Featured moment
              </p>
              <p className="mt-1 max-w-md font-display text-xl font-bold text-white sm:text-2xl">
                {items[0]?.title ?? defaultGalleryItems[0].title}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-15" />
        <div className="relative mx-auto max-w-7xl">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                Explore the collection
              </p>
              <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Our global presence.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Browse the people and places behind our work. Select a collection to see more.
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {visibleItems.length} {visibleItems.length === 1 ? "photograph" : "photographs"}
            </span>
          </header>

          <div
            className="mt-6 flex gap-2 overflow-x-auto border-b border-border pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Gallery filters"
          >
            <FilterButton
              active={category === "all"}
              count={items.length}
              onClick={() => setCategory("all")}
            >
              All photographs
            </FilterButton>
            {availableCategories.map((value) => (
              <FilterButton
                key={value}
                active={category === value}
                count={items.filter((item) => item.category === value).length}
                onClick={() => setCategory(value)}
              >
                {GALLERY_CATEGORY_LABELS[value]}
              </FilterButton>
            ))}
          </div>

          <div className="min-w-0">
            {category !== "all" && (
              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {GALLERY_CATEGORY_LABELS[category]}
              </h3>
            )}

            {isLoading && items.length === 0 ? (
              <GallerySkeleton />
            ) : visibleItems.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
                <Images className="mx-auto h-8 w-8 text-brand" />
                <h3 className="mt-4 font-display text-xl font-bold">
                  No images in this category yet.
                </h3>
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-brand hover:underline"
                >
                  View all images
                </button>
              </div>
            ) : (
              <div
                key={category}
                className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleItems.map((item, index) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    index={index}
                    displayNumber={itemNumberById.get(item.id) ?? index + 1}
                    total={items.length}
                    onOpen={() => setSelectedId(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <section className="relative mt-14 overflow-hidden rounded-3xl border border-border bg-carbon px-6 py-9 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-[90px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
                  Visit Modtech
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  See the engineering behind the machine.
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  Talk to our team about your process, arrange a facility visit or review a live
                  application with our engineers.
                </p>
              </div>
              <Link
                to="/contact"
                search={{ machine: undefined }}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5"
              >
                Plan a visit <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </section>

      {selected && (
        <Lightbox
          item={selected}
          current={selectedIndex + 1}
          total={visibleItems.length}
          onClose={() => setSelectedId(null)}
          onPrevious={() => showRelative(-1)}
          onNext={() => showRelative(1)}
        />
      )}
    </PageShell>
  );
}

function FilterButton({
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
      className={`gallery-filter inline-flex min-h-11 shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-full border px-4 py-2.5 text-left font-mono text-[9px] uppercase tracking-[0.12em] transition ${
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-foreground"
      }`}
    >
      <span>{children}</span>
      <span
        className={`shrink-0 rounded-full px-2 py-1 text-[8px] ${
          active ? "bg-carbon/10 text-brand-foreground/80" : "bg-background text-foreground/55"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function GalleryCard({
  item,
  index,
  displayNumber,
  total,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  displayNumber: number;
  total: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${item.title}`}
      className="gallery-card group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ animationDelay: `${(index % 6) * 65}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-carbon sm:aspect-square">
        <img
          src={item.image_url}
          alt={item.alt_text}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          className="gallery-card-media h-full w-full object-cover"
          style={{ objectPosition: item.object_position ?? "50% 50%" }}
        />
        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-carbon/75 px-3 py-1.5 font-mono text-[9px] text-white backdrop-blur">
          {String(displayNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground shadow-glow transition-transform group-hover:scale-110">
          <Maximize2 className="h-4 w-4" />
        </span>
      </div>
      <div className="px-4 py-4 sm:px-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand">
          {GALLERY_CATEGORY_LABELS[item.category]}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-foreground">
          {item.title}
        </h3>
        {item.location && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" /> {item.location}
          </p>
        )}
      </div>
    </button>
  );
}

function GallerySkeleton() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`aspect-[4/3] animate-pulse rounded-2xl border border-border bg-card ${index === 0 ? "sm:col-span-2 sm:aspect-video" : ""}`}
        />
      ))}
    </div>
  );
}

function Lightbox({
  item,
  current,
  total,
  onClose,
  onPrevious,
  onNext,
}: {
  item: GalleryItem;
  current: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="gallery-lightbox fixed inset-0 z-[90] flex flex-col bg-carbon/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-7">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand">
            {GALLERY_CATEGORY_LABELS[item.category]} / {current} of {total}
          </p>
          <h2 className="mt-1 truncate font-display text-base font-bold text-white sm:text-xl">
            {item.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-brand hover:text-brand"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8"
        onMouseDown={(event) => {
          if (event.currentTarget === event.target) onClose();
        }}
      >
        <img
          key={item.id}
          src={item.image_url}
          alt={item.alt_text}
          className="gallery-lightbox-image max-h-full max-w-full rounded-xl object-contain shadow-deep"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={onPrevious}
              aria-label="Previous image"
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-carbon/75 text-white backdrop-blur transition hover:border-brand hover:text-brand sm:left-6"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-carbon/75 text-white backdrop-blur transition hover:border-brand hover:text-brand sm:right-6"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {(item.caption || item.location) && (
        <div className="border-t border-white/10 px-5 py-4 text-center sm:px-8">
          {item.caption && (
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/65">
              {item.caption}
            </p>
          )}
          {item.location && (
            <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-brand">
              <MapPin className="h-3 w-3" /> {item.location}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
