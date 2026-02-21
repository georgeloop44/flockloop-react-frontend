import { Target, Info } from "lucide-react";

interface CampaignBudgetCardProps {
  activeCampaigns: number;
  budgetAvailable: number;
}

export function CampaignBudgetCard({
  activeCampaigns,
  budgetAvailable,
}: CampaignBudgetCardProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Target className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Campaigns and Budget</span>
        </div>
        <button
          type="button"
          className="rounded p-0.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Info about campaigns and budget"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-baseline gap-8">
        <div>
          <p className="text-3xl font-semibold tabular-nums text-foreground">
            {activeCampaigns}
          </p>
          <p className="text-xs text-foreground-muted">Active campaigns</p>
        </div>
        <div>
          <p className="text-3xl font-semibold tabular-nums text-foreground">
            ${budgetAvailable}
          </p>
          <p className="text-xs text-foreground-muted">Budget Available</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-border-subtle px-4 py-2.5">
        <p className="text-sm text-foreground-secondary">
          Add funds to keep momentum and boost exposure
        </p>
        <button
          type="button"
          className="shrink-0 rounded-md border border-border bg-surface-elevated px-3 py-1 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          Refill
        </button>
      </div>
    </div>
  );
}
