import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";

type YouTubeVideoCardProps = {
  videoId: string;
  title: string;
  category: string;
  description: string;
  featured?: boolean;
};

export function YouTubeVideoCard({
  videoId,
  title,
  category,
  description,
  featured = false,
}: YouTubeVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <article
      className={`group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/15 ${
        featured ? "lg:grid lg:grid-rows-[auto_1fr]" : ""
      }`}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${title}`}
            className="absolute inset-0 w-full cursor-pointer overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] group-hover:saturate-110 motion-reduce:transition-none"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/35 bg-black/55 text-white shadow-2xl backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground motion-reduce:transition-none sm:h-16 sm:w-16">
                <Play className="ml-0.5 h-5 w-5 fill-current sm:h-6 sm:w-6" />
              </span>
            </span>
            <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
              {category}
            </span>
          </button>
        )}
      </div>

      <div className={`flex flex-col ${featured ? "p-6 sm:p-7" : "p-5"}`}>
        <h3
          className={`font-display font-bold leading-tight text-white ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{description}</p>
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand transition hover:text-white"
          aria-label={`Watch ${title} on YouTube (opens in a new tab)`}
        >
          Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
