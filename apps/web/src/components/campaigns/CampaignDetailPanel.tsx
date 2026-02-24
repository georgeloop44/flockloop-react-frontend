import type { CampaignRead } from "@flockloop/shared-types";
import { useAudioStore } from "@flockloop/audio-state";
import { Play, Pause, Heart, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignDetailPanelProps {
  campaign: CampaignRead;
  onPlayToggle: (campaign: CampaignRead) => void;
  onCreateAndEarn: (campaign: CampaignRead) => void;
  onSkip: () => void;
}

function GenreTag({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-foreground-secondary">
      {label}
    </span>
  );
}

function SubsLeftBadge({ count }: { count: number | undefined }) {
  if (count === undefined) return null;

  return (
    <span className="rounded-md bg-status-pending/20 px-2.5 py-1 text-xs font-medium text-status-pending">
      {count} Subs Left
    </span>
  );
}

export function CampaignDetailPanel({
  campaign,
  onPlayToggle,
  onCreateAndEarn,
  onSkip,
}: CampaignDetailPanelProps) {
  const currentTrackId = useAudioStore((s) => s.currentTrack?.trackId);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const isCurrentTrack = currentTrackId === campaign.track.id;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const subsLeft =
    campaign.max_submissions !== undefined
      ? campaign.max_submissions - (campaign.submissions_count ?? 0)
      : undefined;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-foreground-muted">Campaign details</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Save campaign"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Album art + track info */}
        <div className="flex min-w-0 flex-1 gap-4">
          {campaign.track.thumbnail_url ? (
            <img
              src={campaign.track.thumbnail_url}
              alt=""
              className="h-24 w-24 shrink-0 rounded-lg object-cover"
              width={96}
              height={96}
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
              <Play className="h-8 w-8 text-foreground-muted" aria-hidden="true" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className="truncate text-lg font-semibold text-foreground"
                style={{ textWrap: "balance" }}
              >
                {campaign.track.title}
              </h3>
              <button
                type="button"
                onClick={() => onPlayToggle(campaign)}
                className={cn(
                  "shrink-0 rounded p-1 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  isThisPlaying
                    ? "text-primary"
                    : "text-foreground-muted hover:text-foreground",
                )}
                aria-label={isThisPlaying ? "Pause" : "Play"}
              >
                {isThisPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
            </div>

            <p className="mt-0.5 text-sm text-foreground-muted">
              Artist: {campaign.track.artist}
            </p>

            {campaign.genres?.length ? (
              <p className="mt-0.5 text-sm text-foreground-muted">
                {campaign.genres.join(" \u2022 ")}
              </p>
            ) : null}

            {/* Tags */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {campaign.styles?.map((style) => (
                <GenreTag key={style} label={style} />
              ))}
              <SubsLeftBadge count={subsLeft} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={() => onCreateAndEarn(campaign)}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create & Earn
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
