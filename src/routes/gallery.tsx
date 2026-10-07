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
      { title: "Gallery - Inside Modtech Machine" },
      {
        name: "description",
        content:
          "Explore Modtech Machine's offices, engineering facilities, factory floors and automation projects.",
      },
      { property: "og:title", content: "Inside Modtech Machine - Gallery" },
      {
        property: "og:description",
        content: "A visual tour of our people, facilities and engineering work.",
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
  const heroItem = useMemo(() => items.find((item) => item.featured) ?? items[0], [items]);
  const heroCollageItems = useMemo(
    () =>
      [heroItem, ...items.filter((item) => item.id !== heroItem?.id)].filter(Boolean).slice(0, 3),
    [heroItem, items],
  ) as GalleryItem[];
  const availableCategories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
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
      <section className="gallery-hero on-dark relative isolate overflow-hidden bg-carbon px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-20">
          {heroItem && (
            <img
              src={heroItem.image_url}
              alt=""
              aria-hidden
              className="gallery-hero-media h-full w-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/95 to-carbon/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/35" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-25" />
        <div className="pointer-events-none absolute -right-40 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/15 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-brand backdrop-blur">
            <Camera className="h-3.5 w-3.5" /> Inside Modtech
          </div>
          <div className="mt-8 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h1 className="reveal max-w-4xl font-display text-[clamp(3rem,6.2vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.055em]">
                The people and places{" "}
                <span className="block text-gradient-brand">behind every build.</span>
              </h1>
              <p
                className="reveal mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-lg"
                style={{ animationDelay: "100ms" }}
              >
                A closer look at our offices, engineering facilities, integration bays and the
                people who turn demanding production challenges into reliable machinery.
              </p>
              <div
                className="reveal mt-10 grid max-w-md grid-cols-2 border-y border-white/10 py-5"
                style={{ animationDelay: "150ms" }}
              >
                <HeroMetric value={items.length} label="Gallery images" Icon={Images} />
                <HeroMetric
                  value={availableCategories.length}
                  label="Inside stories"
                  Icon={Building2}
                />
              </div>
            </div>
            <div
              className="gallery-collage reveal grid h-[27rem] grid-cols-[1.25fr_0.75fr] grid-rows-2 gap-3 sm:h-[34rem]"
              style={{ animationDelay: "180ms" }}
            >
              {heroCollageItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`gallery-collage-card group relative overflow-hidden border border-white/15 bg-card text-left shadow-deep ${
                    index === 0 ? "row-span-2 rounded-l-[2rem] rounded-r-xl" : "rounded-xl"
                  }`}
                  aria-label={`Open image: ${item.title}`}
                >
                  <img
                    src={item.image_url}
                    alt={item.alt_text}
                    className="gallery-collage-image absolute inset-0 h-full w-full object-cover"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/95 via-transparent to-carbon/10" />
                  <span className="absolute right-4 top-4 font-mono text-[8px] tracking-[0.18em] text-white/60">
                    0{index + 1}
                  </span>
                  <div
                    className={`absolute inset-x-0 bottom-0 ${index === 0 ? "p-6 sm:p-8" : "p-4"}`}
                  >
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-brand">
                        {GALLERY_CATEGORY_LABELS[item.category]}
                      </p>
                      <h2
                        className={`mt-2 font-display font-bold text-white ${index === 0 ? "text-xl sm:text-3xl" : "text-sm sm:text-lg"}`}
                      >
                        {item.title}
                      </h2>
                    </div>
                  </div>
                  <span className="absolute left-4 top-4 grid h-9 w-9 -translate-y-2 place-items-center rounded-full bg-brand text-brand-foreground opacity-0 shadow-glow transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
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
                Visual journal
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                Explore by space.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Step inside our workplace, project rooms and engineering floor.
              </p>
              <div className="mt-7 flex flex-wrap gap-2 lg:flex-col" aria-label="Gallery filters">
                <FilterButton
                  active={category === "all"}
                  count={items.length}
                  onClick={() => setCategory("all")}
                >
                  All images
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
                    Showing {visibleItems.length} {visibleItems.length === 1 ? "image" : "images"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                    {category === "all"
                      ? "Inside Modtech."
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
                  className="mt-8 grid auto-rows-[16rem] grid-flow-dense gap-4 md:grid-cols-2"
                >
                  {visibleItems.map((item, index) => (
                    <GalleryCard
                      key={item.id}
                      item={item}
                      index={index}
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
      <span className="mt-3 block font-display text-3xl font-bold text-white">
        {String(value).padStart(2, "0")}
      </span>
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
      className={`gallery-filter inline-flex items-center justify-between gap-4 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.17em] transition lg:w-full lg:rounded-xl lg:px-4 lg:py-3 ${
        active
          ? "border-brand bg-brand text-brand-foreground shadow-glow"
          : "border-border bg-card/60 text-muted-foreground hover:border-brand/60 hover:text-foreground"
      }`}
    >
      <span>{children}</span>
      <span className={active ? "text-brand-foreground/65" : "text-muted-foreground/55"}>
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}

function GalleryCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: () => void;
}) {
  const large = item.featured || index === 0;
  const wide = !large && index % 4 === 3;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${item.title}`}
      className={`gallery-card group relative isolate overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card ${
        large ? "md:col-span-2 md:row-span-2" : wide ? "md:col-span-2" : ""
      }`}
      style={{ animationDelay: `${(index % 6) * 70}ms` }}
    >
      <img
        src={item.image_url}
        alt={item.alt_text}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        className="gallery-card-media absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-carbon/15 to-transparent" />
      <span className="absolute right-5 top-5 font-mono text-[9px] tracking-[0.18em] text-white/45">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand">
              {GALLERY_CATEGORY_LABELS[item.category]}
            </span>
            <h3
              className={`mt-2 font-display font-bold text-white ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}
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
    <div className="mt-10 grid auto-rows-[16rem] gap-4 md:grid-cols-2">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`animate-pulse rounded-2xl border border-border bg-card ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
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
