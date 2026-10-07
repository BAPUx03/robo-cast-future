import { useEffect, useState } from "react";

type YouTubeBackgroundProps = {
  videoId: string;
  title: string;
  className?: string;
};

export function YouTubeBackground({ videoId, title, className = "" }: YouTubeBackgroundProps) {
  const [showPoster, setShowPoster] = useState(true);
  const source =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}` +
    "&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3";

  useEffect(() => {
    setShowPoster(true);
  }, [videoId]);

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
        loading="eager"
        fetchPriority="high"
        className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
          showPoster ? "opacity-100" : "opacity-0"
        }`}
      />
      <iframe
        src={source}
        title={title}
        onLoad={() => setShowPoster(false)}
        tabIndex={-1}
        loading="eager"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 scale-[1.12] border-0 opacity-80"
        style={{
          width: "max(100cqw, 177.78cqh)",
          height: "max(100cqh, 56.25cqw)",
        }}
      />
    </div>
  );
}
