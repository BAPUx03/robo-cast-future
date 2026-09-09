import { useEffect } from "react";

/**
 * Enables click-and-drag horizontal scrolling on every element matching
 * `.drag-scroll` (or its scrollable child). Touch devices already swipe
 * natively — this only enhances mouse/trackpad users.
 */
export function useDragScroll(selector: string = ".drag-scroll") {
  useEffect(() => {
    const containers = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!containers.length) return;

    const cleanups: Array<() => void> = [];

    containers.forEach((root) => {
      // Use the first scrollable descendant if the root itself isn't scrollable.
      const scroller =
        root.scrollWidth > root.clientWidth
          ? root
          : (root.querySelector<HTMLElement>(":scope > div[class*='overflow-x']") ??
            (root.firstElementChild as HTMLElement | null) ??
            root);
      if (!scroller) return;

      let isDown = false;
      let startX = 0;
      let startLeft = 0;
      let moved = false;

      const onDown = (e: PointerEvent) => {
        // Ignore right/middle clicks
        if (e.button !== 0) return;
        isDown = true;
        moved = false;
        startX = e.clientX;
        startLeft = scroller.scrollLeft;
        scroller.setPointerCapture(e.pointerId);
        scroller.style.cursor = "grabbing";
      };
      const onMove = (e: PointerEvent) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        scroller.scrollLeft = startLeft - dx;
      };
      const onUp = (e: PointerEvent) => {
        if (!isDown) return;
        isDown = false;
        scroller.releasePointerCapture(e.pointerId);
        scroller.style.cursor = "";
      };
      const onClickCapture = (e: MouseEvent) => {
        // Suppress click that ended a drag, otherwise links would fire.
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      };

      scroller.style.cursor = "grab";
      scroller.addEventListener("pointerdown", onDown);
      scroller.addEventListener("pointermove", onMove);
      scroller.addEventListener("pointerup", onUp);
      scroller.addEventListener("pointercancel", onUp);
      scroller.addEventListener("click", onClickCapture, true);

      cleanups.push(() => {
        scroller.removeEventListener("pointerdown", onDown);
        scroller.removeEventListener("pointermove", onMove);
        scroller.removeEventListener("pointerup", onUp);
        scroller.removeEventListener("pointercancel", onUp);
        scroller.removeEventListener("click", onClickCapture, true);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [selector]);
}
