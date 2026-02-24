import { Suspense, useState, useCallback, useEffect } from "react";
import { useTracks } from "@flockloop/api-client";
import { mediaApi } from "@flockloop/api-client";
import { useAudioStore, setSkipCallbacks, audioLoadAndPlay } from "@flockloop/audio-state";
import type { TrackRead } from "@flockloop/shared-types";
import type { AudioTrack } from "@flockloop/audio-state";
import { Plus, Play, Pause, Disc3 } from "lucide-react";
import { UploadTrackDialog } from "@/components/tracks/UploadTrackDialog";
import { toast } from "sonner";

function TrackRow({
  track,
  isActive,
  isPlaying,
  onPlay,
}: {
  track: TrackRead;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  return (
    <tr
      className={`border-b border-border-subtle transition-colors ${
        isActive ? "bg-primary/5" : "hover:bg-surface-hover"
      }`}
    >
      <td className="w-12 px-4 py-3">
        <button
          type="button"
          onClick={onPlay}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label={isActive && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        >
          {isActive && isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5 ml-0.5" />
          )}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {track.thumbnail_url ? (
            <img
              src={track.thumbnail_url}
              alt=""
              className="h-10 w-10 rounded object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-elevated">
              <Disc3 className="h-5 w-5 text-foreground-muted" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <p className={`truncate text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
              {track.title}
            </p>
            <p className="truncate text-xs text-foreground-muted">{track.artist}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

function MyTracksContent() {
  const { data: tracks } = useTracks();
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentTrack = useAudioStore((s) => s.currentTrack);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const pause = useAudioStore((s) => s.pause);
  const resume = useAudioStore((s) => s.resume);
  const stop = useAudioStore((s) => s.stop);

  // Stop audio when leaving the page
  useEffect(() => () => { stop(); }, [stop]);

  const playTrack = useCallback(
    async (track: TrackRead) => {
      // If same track is playing, toggle pause/resume
      if (currentTrack?.trackId === track.id) {
        if (isPlaying) {
          pause();
        } else {
          resume();
        }
        return;
      }

      try {
        // Fetch presigned download URL then play
        const { download_url } = await mediaApi.getDownloadUrl(track.media_id);
        const audioTrack: AudioTrack = {
          trackId: track.id,
          title: track.title,
          artist: track.artist,
          thumbnailUrl: track.thumbnail_url,
          mediaId: track.media_id,
        };
        audioLoadAndPlay(audioTrack, download_url);
      } catch {
        toast.error("Failed to load track. Please try again.");
      }
    },
    [currentTrack?.trackId, isPlaying, pause, resume],
  );

  // Set up skip callbacks for the BottomAudioPlayer
  useEffect(() => {
    if (tracks.length === 0) return;

    const getIndex = () => {
      const id = useAudioStore.getState().currentTrack?.trackId;
      return tracks.findIndex((t) => t.id === id);
    };

    setSkipCallbacks(
      () => {
        const idx = getIndex();
        const next = tracks[(idx + 1) % tracks.length];
        if (next) playTrack(next);
      },
      () => {
        const idx = getIndex();
        const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
        if (prev) playTrack(prev);
      },
    );
  }, [tracks, playTrack]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Tracks</h2>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Upload Track
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface py-16 text-center">
          <Disc3 className="h-12 w-12 text-foreground-muted" aria-hidden="true" />
          <h3 className="mt-4 text-sm font-medium text-foreground">
            No tracks yet
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">
            Upload your first track to start creating campaigns.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="w-12 px-4 py-3" />
                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
                  Track
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  isActive={currentTrack?.trackId === track.id}
                  isPlaying={currentTrack?.trackId === track.id && isPlaying}
                  onPlay={() => playTrack(track)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Suspense fallback={null}>
        <UploadTrackDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </Suspense>
    </div>
  );
}

function TracksSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-surface" />
        <div className="h-9 w-36 animate-pulse rounded-lg bg-surface" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-16 animate-pulse rounded bg-surface" />
      ))}
    </div>
  );
}

export default function MyTracksPage() {
  return (
    <Suspense fallback={<TracksSkeleton />}>
      <MyTracksContent />
    </Suspense>
  );
}
