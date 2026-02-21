import { useAudioStore } from "@flockloop/audio-state";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function BottomAudioPlayer() {
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const pause = useAudioStore((s) => s.pause);
  const resume = useAudioStore((s) => s.resume);
  const skipNext = useAudioStore((s) => s.skipNext);
  const skipPrevious = useAudioStore((s) => s.skipPrevious);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex h-16 shrink-0 items-center gap-4 border-t border-border-subtle bg-surface px-4">
      {/* Track info */}
      <div className="flex min-w-0 items-center gap-3">
        {currentTrack.thumbnailUrl ? (
          <img
            src={currentTrack.thumbnailUrl}
            alt=""
            className="h-10 w-10 rounded object-cover"
            width={40}
            height={40}
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-elevated">
            <Play className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {currentTrack.title}
          </p>
          <p className="truncate text-xs text-foreground-muted">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={skipPrevious}
          className="rounded p-1.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={isPlaying ? pause : resume}
          className="rounded p-1.5 text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
        <button
          type="button"
          onClick={skipNext}
          className="rounded p-1.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* Time */}
      <span className="shrink-0 text-xs tabular-nums text-foreground-muted">
        {formatTime(currentTime)}
      </span>

      {/* Progress bar */}
      <div className="relative flex-1">
        <div className="h-1 rounded-full bg-surface-elevated">
          <div
            className="h-1 rounded-full bg-primary transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={currentTime}
          onChange={(e) => {
            // seek is provided by the page-level audio player hook
            // We dispatch a custom event that the hook listens to
            const time = Number(e.target.value);
            window.dispatchEvent(
              new CustomEvent("flockloop:seek", { detail: time }),
            );
          }}
          className="absolute inset-0 h-1 w-full cursor-pointer opacity-0"
          aria-label="Seek"
        />
      </div>

      {/* Duration */}
      <span className="shrink-0 text-xs tabular-nums text-foreground-muted">
        {formatTime(duration)}
      </span>
    </div>
  );
}
