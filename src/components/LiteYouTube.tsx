import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type LiteYouTubeProps = {
  /** YouTube video ID, e.g. "dbxs9yaNtkA" */
  id: string;
  /** Optional start time in seconds */
  start?: number;
  title: string;
  className?: string;
  /** Tailwind aspect-ratio override; defaults to 16/9 */
  aspectClassName?: string;
};

/**
 * Click-to-load YouTube embed. Until the user clicks Play we render only a
 * static poster image + button (a few KB) — no third-party scripts, no
 * cookies. After the click we mount the real iframe with autoplay.
 *
 * This keeps the PDP fast and avoids the ~500KB+ YouTube embed bundle for
 * shoppers who never press play.
 */
export const LiteYouTube = ({
  id,
  start,
  title,
  className,
  aspectClassName = "aspect-video",
}: LiteYouTubeProps) => {
  const [active, setActive] = useState(false);

  // hqdefault is universally available; maxresdefault sometimes 404s.
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${
    start ? `&start=${start}` : ""
  }`;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-ink-deep",
        aspectClassName,
        className,
      )}
    >
      {active ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/55 via-ink-deep/10 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/95 shadow-lg ring-1 ring-foreground/10 transition group-hover:scale-105">
              <Play className="ml-1 h-7 w-7 fill-foreground text-foreground" />
            </span>
          </span>
          <span className="absolute bottom-3 left-3 right-3 text-left text-[11px] tracking-[0.18em] uppercase text-background/90">
            {title}
          </span>
        </button>
      )}
    </div>
  );
};
