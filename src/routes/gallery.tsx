import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
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
      <section className="gallery-hero on-dark relative isolate overflow-hidden bg-carbon px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_20%,rgba(70,219,169,0.13),transparent_34%),linear-gradient(135deg,#03100d_0%,#071b16_58%,#020a08_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-25" />
        <div className="pointer-events-none absolute -right-40 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-brand backdrop-blur">
            <Camera className="h-3.5 w-3.5" /> Global Gallery
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:gap-20">
            <div>
              <h1 className="reveal max-w-4xl font-display text-[2.35rem] font-bold leading-[0.94] tracking-[-0.05em] sm:text-[clamp(3rem,6.2vw,6.5rem)] sm:leading-[0.9]">
                Projects, people and{" "}
                <span className="block text-gradient-brand">global partnerships.</span>
              </h1>
              <p
                className="reveal mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-lg"
                style={{ animationDelay: "100ms" }}
              >
                A closer look at customer visits, technical collaborations and the teams behind
                Modtech projects around the world.
              </p>
            </div>
            <div
              className="reveal overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-deep backdrop-blur-sm sm:p-8"
              style={{ animationDelay: "150ms" }}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-brand">
                Curated visual journal
              </p>
              <div className="mt-6 grid grid-cols-2 border-y border-white/10 py-5">
                <HeroMetric value={items.length} label="Photographs" Icon={Images} />
                <HeroMetric
                  value={availableCategories.length}
                  label="Collections"
                  Icon={Building2}
                />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-white/55">
                Each photograph preserves its original framing, keeping the people, equipment and
                setting clearly visible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-background px-5 py-14 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-15" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand">
                Global presence
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                Explore the journey.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Browse customer installations, international visits and moments from the Modtech
                office.
              </p>
              <div
                className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"
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
            </aside>

            <div className="min-w-0">
              <header className="flex items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    Showing {visibleItems.length}{" "}
                    {visibleItems.length === 1 ? "photograph" : "photographs"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                    {category === "all"
                      ? "Our Global Presence."
                      : `${GALLERY_CATEGORY_LABELS[category]}.`}
                  </h3>
                </div>
                <Camera className="hidden h-8 w-8 text-brand sm:block" />
              </header>

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
                  className="mt-8 grid grid-flow-dense grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-12"
                >
                  {visibleItems.map((item, index) => (
                    <GalleryCard
                      key={item.id}
                      item={item}
                      index={index}
                      displayNumber={itemNumberById.get(item.id) ?? index + 1}
                      total={items.length}
                      editorialLayout={category === "all"}
                      onOpen={() => setSelectedId(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <section className="relative mt-20 overflow-hidden rounded-3xl border border-border bg-carbon px-6 py-10 sm:px-10 sm:py-12">
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

function HeroMetric({ value, label, Icon }: { value: number; label: string; Icon: typeof Images }) {
  return (
    <div className="border-l border-white/10 px-5 first:border-l-0 first:pl-0">
      <Icon className="h-4 w-4 text-brand" />
      <span className="mt-3 block font-display text-3xl font-bold text-white">{value}</span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/50">
        {label}
      </span>
    </div>
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
      className={`gallery-filter inline-flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.14em] transition sm:min-w-[10rem] lg:w-full ${
        active
          ? "border-brand bg-brand text-brand-foreground shadow-glow"
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

const editorialGalleryLayout = [
  { className: "sm:col-span-2 lg:col-span-12", aspectRatio: 16 / 9 },
  { className: "lg:col-span-6", aspectRatio: 4 / 3 },
  { className: "lg:col-span-6", aspectRatio: 4 / 3 },
  { className: "lg:col-span-4", aspectRatio: 3 / 4 },
  { className: "lg:col-span-8", aspectRatio: 3 / 2 },
  { className: "lg:col-span-4", aspectRatio: 3 / 4 },
  { className: "lg:col-span-4", aspectRatio: 3 / 4 },
  { className: "lg:col-span-4", aspectRatio: 3 / 4 },
  { className: "sm:col-span-2 lg:col-span-12", aspectRatio: 16 / 9 },
] as const;

function GalleryCard({
  item,
  index,
  displayNumber,
  total,
  editorialLayout,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  displayNumber: number;
  total: number;
  editorialLayout: boolean;
  onOpen: () => void;
}) {
  const layout = editorialLayout ? editorialGalleryLayout[index] : undefined;
  const aspectRatio = layout?.aspectRatio ?? item.aspect_ratio ?? (item.portrait ? 3 / 4 : 4 / 3);
  const large = editorialLayout && index === 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${item.title}`}
      className={`gallery-card group relative isolate w-full self-start overflow-hidden rounded-2xl border border-border bg-carbon text-left shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        layout?.className ?? "sm:col-span-1 lg:col-span-6"
      }`}
      style={{ aspectRatio, animationDelay: `${(index % 6) * 65}ms` }}
    >
      <img
        src={item.image_url}
        alt={item.alt_text}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        className="gallery-card-media absolute inset-0 -z-20 h-full w-full object-contain"
        style={{ objectPosition: item.object_position ?? "50% 50%" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-carbon/5 to-transparent" />
      <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-carbon/65 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/70 backdrop-blur sm:right-5 sm:top-5">
        <span className="hidden sm:inline">Photo </span>
        {displayNumber} / {total}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand">
              {GALLERY_CATEGORY_LABELS[item.category]}
            </span>
            <h3
              className={`mt-2 font-display font-bold text-white ${large ? "text-xl sm:text-3xl" : "text-base sm:text-lg"}`}
            >
              {item.title}
            </h3>
            {item.caption && (
              <p className="gallery-card-caption mt-2 line-clamp-2 max-w-xl text-xs leading-relaxed text-white/60">
                {item.caption}
              </p>
            )}
            {item.location && (
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/60">
                <MapPin className="h-3 w-3 text-brand" /> {item.location}
              </span>
            )}
          </div>
          <span className="grid h-10 w-10 shrink-0 translate-y-2 place-items-center rounded-full bg-brand text-brand-foreground opacity-0 shadow-glow transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </div>
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
