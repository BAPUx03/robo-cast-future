import { useEffect } from "react";

/**
 * Applies the shared reveal timing and observes scroll-reveal elements.
 * Once a scroll-reveal element is visible, the class stays.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");

    const applyDelay = (el: HTMLElement) => {
      const rawDelay = el.dataset.revealDelay;
      if (!rawDelay) return;

      const delay = Number(rawDelay);
      if (!Number.isFinite(delay) || delay < 0) return;

      if (el.classList.contains("reveal")) el.style.animationDelay = `${delay}ms`;
      if (el.classList.contains("reveal-on-scroll")) el.style.transitionDelay = `${delay}ms`;
    };

    const immediateReveals = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal[data-reveal-delay]"),
    );
    immediateReveals.forEach(applyDelay);

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => {
      applyDelay(el);
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
}
