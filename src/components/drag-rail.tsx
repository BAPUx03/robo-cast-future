import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal drag-to-scroll rail with prev/next arrow buttons.
 * - Mouse: click + drag to pan
 * - Touch: native swipe
 * - Buttons: scroll one viewport-card at a time
 * - Wheel: vertical scroll converted to horizontal when hovered
 */
export function DragRail({
  children,
  className = "",
  step,
  ariaLabel = "Horizontal scroller",
  controlsPlacement = "overlay",
}: {
  children: React.ReactNode;
  className?: string;
  /** Pixels per arrow click, or one card at a time. Defaults to 80% of the rail width. */
  step?: number | "item";
  ariaLabel?: string;
  controlsPlacement?: "overlay" | "below";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1 across the rail

  // ----- arrow visibility + progress based on scroll position -----
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth - 1;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < max);
      setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true });
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  // ----- click + drag -----
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      // Avoid hijacking native scrollbars/buttons
      if ((e.target as HTMLElement).closest("button, a")) {
        // still allow drag but track movement so click is suppressed if dragged
      }
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      el.style.cursor = "grab";
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    // Wheel: convert vertical wheel to horizontal scroll for desktops
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const max = el.scrollWidth - el.clientWidth;
        if ((e.deltaY < 0 && el.scrollLeft > 0) || (e.deltaY > 0 && el.scrollLeft < max)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    if (step === "item") {
      const positions = Array.from(el.children, (child) =>
        Math.max(0, (child as HTMLElement).offsetLeft - el.offsetLeft),
      );
      const target =
        dir === 1
          ? positions.find((position) => position > el.scrollLeft + 8)
          : [...positions].reverse().find((position) => position < el.scrollLeft - 8);
      if (target !== undefined) el.scrollTo({ left: target, behavior: "smooth" });
      return;
    }
    const amount = step ?? Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        className={`flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>

      {/* Arrow controls */}
      <div
        className={
          controlsPlacement === "below"
            ? "mt-1 flex justify-end gap-2"
            : "pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4"
        }
      >
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          className="rail-arrow pointer-events-auto"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          className="rail-arrow pointer-events-auto"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
