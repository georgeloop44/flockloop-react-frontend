import { Suspense, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useCampaign,
  useCampaignSubmissions,
  useReviewSubmission,
  getErrorMessage,
} from "@flockloop/api-client";
import type { SubmissionRead, SubmissionDecision } from "@flockloop/shared-types";
import { cn } from "@/lib/utils";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Inbox,
  ExternalLink,
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

function SubmissionCard({ submission }: { submission: SubmissionRead }) {
  const reviewSubmission = useReviewSubmission();
  const [feedback, setFeedback] = useState("");
  const isPending = reviewSubmission.isPending;

  const videoId =
    submission.youtube_video_id ??
    extractYouTubeVideoId(submission.youtube_url);

  const handleReview = (decision: SubmissionDecision) => {
    reviewSubmission.mutate(
      {
        submissionId: submission.id,
        data: { decision, feedback: feedback.trim() || undefined },
      },
      {
        onSuccess: () => {
          toast.success(
            `Submission ${decision === "accepted" ? "accepted" : "rejected"}`,
          );
          setFeedback("");
        },
        onError: (err) => {
          toast.error(`Review failed: ${getErrorMessage(err)}`);
        },
      },
    );
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex gap-6">
        {/* Video */}
        {videoId ? (
          <YouTubeEmbed
            videoId={videoId}
            className="w-full max-w-lg shrink-0"
          />
        ) : (
          <div className="flex w-full max-w-lg shrink-0 items-center justify-center rounded-lg bg-surface-elevated py-16">
            <a
              href={submission.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Open video on YouTube
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}

        {/* Info + review */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Status + date */}
          <div className="flex items-center gap-3">
            <StatusBadge status={submission.status} />
            <span className="text-xs text-foreground-muted">
              {new Date(submission.created_at).toLocaleDateString()}
            </span>
          </div>

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
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              {submission.comment_count?.toLocaleString() ?? "0"}
            </span>
          </div>

          {/* Existing feedback (for already-reviewed submissions) */}
          {submission.feedback && submission.status !== "pending" ? (
            <div>
              <p className="text-xs font-medium text-foreground-muted">
                Feedback
              </p>
              <p className="mt-0.5 text-sm text-foreground">
                {submission.feedback}
              </p>
            </div>
          ) : null}

          {/* Review controls (only for pending) */}
          {submission.status === "pending" ? (
            <div className="mt-auto space-y-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Feedback (optional)"
                rows={2}
                disabled={isPending}
                className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleReview("accepted")}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-status-accepted px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleReview("rejected")}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-status-rejected px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Reject
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CampaignSubmissionsContent() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign } = useCampaign(id!);
  const { data: submissions } = useCampaignSubmissions(id!);

  const sorted = useMemo(
    () =>
      [...submissions].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0;
      }),
    [submissions],
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <Link
          to="/campaigns"
          className="mt-1 rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Back to campaigns"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {campaign.name}
          </h2>
          <p className="text-sm text-foreground-muted">
            {campaign.track.title} &mdash; {campaign.track.artist}
          </p>
        </div>
      </div>

      {/* Submissions */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface py-16 text-center">
          <Inbox
            className="h-12 w-12 text-foreground-muted"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-sm font-medium text-foreground">
            No submissions yet
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">
            Submissions from creators will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-4">
        <div className="h-5 w-5 animate-pulse rounded bg-surface" />
        <div className="space-y-1">
          <div className="h-5 w-48 animate-pulse rounded bg-surface" />
          <div className="h-4 w-32 animate-pulse rounded bg-surface" />
        </div>
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}

export default function CampaignSubmissionsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CampaignSubmissionsContent />
    </Suspense>
  );
}
