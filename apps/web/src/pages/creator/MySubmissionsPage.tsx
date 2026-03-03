import { Suspense, useMemo, useState } from "react";
import { useMySubmissions, useCampaigns } from "@flockloop/api-client";
import type { SubmissionRead } from "@flockloop/shared-types";
import { cn } from "@/lib/utils";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import {
  Clock,
  CheckCircle,
  XCircle,
  Inbox,
  ExternalLink,
  ChevronDown,
  Eye,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-status-pending/20 text-status-pending",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    color: "bg-status-accepted/20 text-status-accepted",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-status-rejected/20 text-status-rejected",
    icon: XCircle,
  },
} as const;

function StatusBadge({ status }: { status: SubmissionRead["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.color,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </span>
  );
}

function getVideoId(submission: SubmissionRead): string | null {
  return (
    submission.youtube_video_id ??
    extractYouTubeVideoId(submission.youtube_url)
  );
}

function SubmissionsContent() {
  const { data: submissions } = useMySubmissions();
  const { data: campaigns } = useCampaigns();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const campaignNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of campaigns) {
      map.set(c.id, c.name);
    }
    return map;
  }, [campaigns]);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Inbox className="h-12 w-12 text-foreground-muted" aria-hidden="true" />
        <h3 className="mt-4 text-sm font-medium text-foreground">
          No submissions yet
        </h3>
        <p className="mt-1 text-sm text-foreground-muted">
          Discover campaigns and start earning by creating content.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
              Campaign
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted">
              Views
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted">
              Likes
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted">
              Comments
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
              Submitted
            </th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const isExpanded = expandedId === submission.id;
            const videoId = getVideoId(submission);

            return (
              <SubmissionRow
                key={submission.id}
                submission={submission}
                campaignName={
                  campaignNames.get(submission.campaign_id) ??
                  submission.campaign_id
                }
                videoId={videoId}
                isExpanded={isExpanded}
                onToggle={() =>
                  setExpandedId(isExpanded ? null : submission.id)
                }
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SubmissionRow({
  submission,
  campaignName,
  videoId,
  isExpanded,
  onToggle,
}: {
  submission: SubmissionRead;
  campaignName: string;
  videoId: string | null;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={cn(
          "cursor-pointer border-b border-border-subtle transition-colors hover:bg-surface-hover",
          isExpanded && "bg-surface-hover",
        )}
      >
        <td className="px-4 py-3">
          <span className="text-sm font-medium text-foreground">
            {campaignName}
          </span>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={submission.status} />
        </td>
        <td className="px-4 py-3 text-right text-sm tabular-nums text-foreground-muted">
          {submission.view_count?.toLocaleString() ?? "\u2014"}
        </td>
        <td className="px-4 py-3 text-right text-sm tabular-nums text-foreground-muted">
          {submission.like_count?.toLocaleString() ?? "\u2014"}
        </td>
        <td className="px-4 py-3 text-right text-sm tabular-nums text-foreground-muted">
          {submission.comment_count?.toLocaleString() ?? "\u2014"}
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-foreground-muted">
            {new Date(submission.created_at).toLocaleDateString()}
          </span>
        </td>
        <td className="px-4 py-3">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-foreground-muted transition-transform",
              isExpanded && "rotate-180",
            )}
            aria-hidden="true"
          />
        </td>
      </tr>

      {isExpanded ? (
        <tr>
          <td
            colSpan={7}
            className="border-b border-border-subtle bg-surface-elevated px-4 py-4"
          >
            <div className="flex gap-6">
              {/* Video embed */}
              {videoId ? (
                <YouTubeEmbed
                  videoId={videoId}
                  className="w-full max-w-md shrink-0"
                />
              ) : (
                <div className="flex w-full max-w-md shrink-0 items-center justify-center rounded-lg bg-surface py-12">
                  <a
                    href={submission.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    Open video on YouTube
                    <ExternalLink
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              )}

              {/* Details */}
              <div className="flex flex-col gap-3 py-1">
                {/* Stats */}
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-foreground-muted">
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    {submission.view_count?.toLocaleString() ?? "0"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-foreground-muted">
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {submission.like_count?.toLocaleString() ?? "0"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-foreground-muted">
                    <MessageSquare
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    {submission.comment_count?.toLocaleString() ?? "0"}
                  </span>
                </div>

                {/* Feedback */}
                {submission.feedback ? (
                  <div>
                    <p className="text-xs font-medium text-foreground-muted">
                      Feedback
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      {submission.feedback}
                    </p>
                  </div>
                ) : null}

                {/* Stats freshness */}
                {submission.stats_fetched_at ? (
                  <p className="text-xs text-foreground-muted">
                    Stats updated{" "}
                    {new Date(submission.stats_fetched_at).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function SubmissionsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded bg-surface" />
      ))}
    </div>
  );
}

export default function MySubmissionsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<SubmissionsSkeleton />}>
        <SubmissionsContent />
      </Suspense>
    </div>
  );
}
