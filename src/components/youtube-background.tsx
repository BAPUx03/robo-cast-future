import { useEffect, useState } from "react";

type YouTubeBackgroundProps = {
  videoId: string;
  title: string;
  className?: string;
  priority?: boolean;
};

export function YouTubeBackground({
  videoId,
  title,
  className = "",
  priority = false,
}: YouTubeBackgroundProps) {
  const [showPoster, setShowPoster] = useState(true);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const source =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}` +
    "&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3";

  useEffect(() => {
    setShowPoster(true);
  }, [videoId]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlaybackPreference = () => setCanPlayVideo(!reducedMotion.matches);

    updatePlaybackPreference();
    reducedMotion.addEventListener("change", updatePlaybackPreference);
    return () => reducedMotion.removeEventListener("change", updatePlaybackPreference);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-carbon ${className}`}
      style={{ containerType: "size" }}
      aria-hidden="true"
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt=""
        aria-hidden
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
          showPoster ? "opacity-100" : "opacity-0"
        }`}
      />
      {canPlayVideo && (
        <iframe
          src={source}
          title={title}
          onLoad={() => setShowPoster(false)}
          tabIndex={-1}
          loading={priority ? "eager" : "lazy"}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 scale-[1.12] border-0 opacity-80"
          style={{
            width: "max(100cqw, 177.78cqh)",
            height: "max(100cqh, 56.25cqw)",
          }}
        />
      )}
    </div>
  );
}
