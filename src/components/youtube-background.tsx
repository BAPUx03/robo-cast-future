import { useEffect, useId, useRef, useState } from "react";

type YouTubePlayer = {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
};

type YouTubePlayerEvent = { target: YouTubePlayer };
type YouTubePlayerStateEvent = { data: number };

type YouTubeApi = {
  Player: new (
    element: HTMLIFrameElement,
    options: {
      events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onStateChange: (event: YouTubePlayerStateEvent) => void;
        onAutoplayBlocked: () => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: { PLAYING: number };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | undefined;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      if (window.YT) resolve(window.YT);
      else reject(new Error("YouTube player API did not initialize."));
    };

    const existingScript = document.getElementById("youtube-iframe-api");
    if (existingScript) {
      existingScript.addEventListener("error", () => reject(new Error("YouTube API failed.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "youtube-iframe-api";
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.addEventListener("error", () => reject(new Error("YouTube API failed.")), {
      once: true,
    });
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

type YouTubeBackgroundProps = {
  videoId: string;
  title: string;
  className?: string;
  priority?: boolean;
  startAt?: number;
};

export function YouTubeBackground({
  videoId,
  title,
  className = "",
  priority = false,
  startAt = 0,
}: YouTubeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerId = `yt-background-${useId().replaceAll(":", "")}`;
  const [showPoster, setShowPoster] = useState(true);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [playbackState, setPlaybackState] = useState<"poster" | "loading" | "playing" | "blocked">(
    "poster",
  );
  const safeStartAt = Math.max(0, Math.floor(startAt));
  const siteOrigin = typeof window === "undefined" ? "" : window.location.origin;
  const source =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}` +
    `&start=${safeStartAt}` +
    "&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1" +
    (siteOrigin ? `&origin=${encodeURIComponent(siteOrigin)}` : "");

  useEffect(() => {
    setShowPoster(true);
    setPlayerLoaded(false);
    setPlaybackState("poster");
  }, [videoId]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlaybackPreference = () => setCanPlayVideo(!reducedMotion.matches);

    updatePlaybackPreference();
    reducedMotion.addEventListener("change", updatePlaybackPreference);
    return () => reducedMotion.removeEventListener("change", updatePlaybackPreference);
  }, []);

  useEffect(() => {
    if (priority) {
      setIsNearViewport(true);
      return;
    }

    const element = containerRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!canPlayVideo || !isNearViewport) return;
    void loadYouTubeApi().catch(() => setPlaybackState("poster"));
  }, [canPlayVideo, isNearViewport]);

  useEffect(() => {
    if (!playerLoaded) return;
    let cancelled = false;
    let player: YouTubePlayer | undefined;

    loadYouTubeApi()
      .then((api) => {
        const iframe = iframeRef.current;
        if (cancelled || !iframe) return;

        player = new api.Player(iframe, {
          events: {
            onReady: (event) => {
              event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data !== api.PlayerState.PLAYING) return;
              setPlaybackState("playing");
              setShowPoster(false);
            },
            onAutoplayBlocked: () => setPlaybackState("blocked"),
          },
        });
      })
      .catch(() => setPlaybackState("poster"));

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [playerId, playerLoaded]);

  return (
    <div
      ref={containerRef}
      data-youtube-state={playbackState}
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
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }}
        className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
          showPoster ? "opacity-100" : "opacity-0"
        }`}
      />
      {canPlayVideo && isNearViewport && (
        <iframe
          ref={iframeRef}
          id={playerId}
          src={source}
          title={title}
          onLoad={() => {
            setPlaybackState("loading");
            setPlayerLoaded(true);
          }}
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
