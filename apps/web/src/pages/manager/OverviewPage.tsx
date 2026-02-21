import { Suspense } from "react";
import { useCampaigns } from "@flockloop/api-client";
import { StatsCardRow } from "@/components/dashboard/StatsCardRow";
import { TopPerformingTrack } from "@/components/dashboard/TopPerformingTrack";
import { CampaignBudgetCard } from "@/components/dashboard/CampaignBudgetCard";
import { TopCreatorSubmissions } from "@/components/dashboard/TopCreatorSubmissions";

function OverviewContent() {
  const { data: campaigns } = useCampaigns();

  // Derive the "top performing track" from the first campaign
  const topTrack = campaigns[0]?.track ?? null;

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Stats row — zeroed out until backend analytics API is available */}
      <StatsCardRow
        totalReach={0}
        tiktokReach={0}
        instagramReach={0}
        youtubeReach={0}
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Top Performing Track */}
        <TopPerformingTrack
          title={topTrack?.title ?? "No tracks yet"}
          artist={topTrack?.artist ?? "\u2014"}
          genres={campaigns[0]?.genres ?? []}
          thumbnailUrl={topTrack?.thumbnail_url ?? null}
          totalViews={0}
          creatorCount={0}
        />

        {/* Right: Budget + Creators */}
        <div className="flex flex-col gap-4">
          <CampaignBudgetCard
            activeCampaigns={campaigns.length}
            budgetAvailable={0}
          />
          <TopCreatorSubmissions creators={[]} />
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 flex-1 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-80 animate-pulse rounded-xl bg-surface" />
        <div className="flex flex-col gap-4">
          <div className="h-36 animate-pulse rounded-xl bg-surface" />
          <div className="h-40 animate-pulse rounded-xl bg-surface" />
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewContent />
    </Suspense>
  );
}
