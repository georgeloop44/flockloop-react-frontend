import { Suspense, useMemo } from "react";
import { useMySubmissions, useCampaigns } from "@flockloop/api-client";
import type { SubmissionRead } from "@flockloop/shared-types";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, XCircle, Inbox } from "lucide-react";

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

function SubmissionsContent() {
  const { data: submissions } = useMySubmissions();
  const { data: campaigns } = useCampaigns();

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
            <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
              Feedback
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className="border-b border-border-subtle transition-colors hover:bg-surface-hover"
            >
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-foreground">
                  {campaignNames.get(submission.campaign_id) ?? submission.campaign_id}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={submission.status} />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-foreground-muted">
                  {submission.feedback ?? "\u2014"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
