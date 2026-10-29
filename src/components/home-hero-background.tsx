import { useEffect, useState } from "react";

const POSTER = "/modtech-home-poster.webp";
const VIDEO = "/modtech-home-hero.mp4";

export function HomeHeroBackground() {
  const [allowPlayback, setAllowPlayback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const updatePlayback = () =>
      setAllowPlayback(!motionPreference.matches && !connection?.saveData);

    updatePlayback();
    motionPreference.addEventListener("change", updatePlayback);
    return () => motionPreference.removeEventListener("change", updatePlayback);
  }, []);

  return (
    <div
      className="home-hero-media pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-carbon"
      aria-hidden="true"
    >
      <img
        src={POSTER}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {allowPlayback && (
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="metadata"
          poster={POSTER}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? "opacity-100" : "opacity-0"}`}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
