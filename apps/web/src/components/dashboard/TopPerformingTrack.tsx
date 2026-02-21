import { Music, Info, Eye, Users } from "lucide-react";

interface TopPerformingTrackProps {
  title: string;
  artist: string;
  genres: string[];
  thumbnailUrl: string | null;
  totalViews: number;
  creatorCount: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function TopPerformingTrack({
  title,
  artist,
  genres,
  thumbnailUrl,
  totalViews,
  creatorCount,
}: TopPerformingTrackProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border-subtle bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Music className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Top Performing Track</span>
        </div>
        <button
          type="button"
          className="rounded p-0.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Info about top performing track"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Album art */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          className="mb-4 aspect-square w-full max-w-[200px] rounded-lg object-cover"
          width={200}
          height={200}
        />
      ) : (
        <div className="mb-4 flex aspect-square w-full max-w-[200px] items-center justify-center rounded-lg bg-surface-elevated">
          <Music className="h-12 w-12 text-foreground-muted" aria-hidden="true" />
        </div>
      )}

      {/* Track info */}
      <h3 className="text-lg font-semibold text-foreground" style={{ textWrap: "balance" }}>
        {title}
      </h3>
      <p className="mt-0.5 text-sm text-foreground-muted">
        Artist: {artist}
      </p>
      {genres.length > 0 ? (
        <p className="mt-0.5 text-sm text-foreground-muted">
          {genres.join(" \u2022 ")}
        </p>
      ) : null}

      {/* Stats */}
      <div className="mt-4 flex gap-8">
        <div>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {formatNumber(totalViews)}
          </p>
          <p className="flex items-center gap-1 text-xs text-foreground-muted">
            <Eye className="h-3 w-3" aria-hidden="true" />
            Views Across Platforms
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {formatNumber(creatorCount)}
          </p>
          <p className="flex items-center gap-1 text-xs text-foreground-muted">
            <Users className="h-3 w-3" aria-hidden="true" />
            Creators chose it
          </p>
        </div>
      </div>
    </div>
  );
}
