import { Award, Info } from "lucide-react";

interface CreatorSubmission {
  id: string;
  name: string;
  avatarUrl: string | null;
  trackTitle: string;
  reach: number;
}

function formatReach(n: number): string {
  return n.toLocaleString("en-US");
}

function CreatorRow({ creator }: { creator: CreatorSubmission }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      {creator.avatarUrl ? (
        <img
          src={creator.avatarUrl}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          width={36}
          height={36}
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-medium text-foreground">
          {creator.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {creator.name}
        </p>
        <p className="truncate text-xs text-foreground-muted">
          Track: {creator.trackTitle} \u2022 Reach: {formatReach(creator.reach)}
        </p>
      </div>
    </div>
  );
}

interface TopCreatorSubmissionsProps {
  creators: CreatorSubmission[];
}

export function TopCreatorSubmissions({ creators }: TopCreatorSubmissionsProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Top Creator Submissions</span>
        </div>
        <button
          type="button"
          className="rounded p-0.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Info about top creator submissions"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-border-subtle">
        {creators.map((creator) => (
          <CreatorRow key={creator.id} creator={creator} />
        ))}
      </div>

      {creators.length === 0 ? (
        <p className="py-6 text-center text-sm text-foreground-muted">
          No submissions yet
        </p>
      ) : null}
    </div>
  );
}

export type { CreatorSubmission };
