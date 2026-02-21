import { Suspense } from "react";
import { useCampaigns } from "@flockloop/api-client";
import { StatsCardRow } from "@/components/dashboard/StatsCardRow";
import { TopPerformingTrack } from "@/components/dashboard/TopPerformingTrack";
import { CampaignBudgetCard } from "@/components/dashboard/CampaignBudgetCard";
import {
  TopCreatorSubmissions,
  type CreatorSubmission,
} from "@/components/dashboard/TopCreatorSubmissions";

// Placeholder data — will be replaced with real API data when backend supports it
const placeholderCreators: CreatorSubmission[] = [
  {
    id: "1",
    name: "user_frenzy_34",
    avatarUrl: null,
    trackTitle: "The Clouds in Camarillo",
    reach: 23_543_567_543,
  },
  {
    id: "2",
    name: "Erika Sanchez",
    avatarUrl: null,
    trackTitle: "The Clouds in Camarillo",
    reach: 1_345_323,
  },
  {
    id: "3",
    name: "Someone98",
    avatarUrl: null,
    trackTitle: "The Clouds in Camarillo",
    reach: 4_653,
  },
  {
    id: "4",
    name: "Manolo",
    avatarUrl: null,
    trackTitle: "The Clouds in Camarillo",
    reach: 1_200,
  },
];

function OverviewContent() {
  const { data: campaigns } = useCampaigns();

  // Derive the "top performing track" from the first campaign
  const topTrack = campaigns[0]?.track ?? null;

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Stats row */}
      <StatsCardRow
        totalReach={1_654_765}
        tiktokReach={3_564}
        instagramReach={2_645}
        youtubeReach={2_645}
        totalTrend={20}
        tiktokTrend={20}
        instagramTrend={20}
        youtubeTrend={-20}
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Top Performing Track */}
        <TopPerformingTrack
          title={topTrack?.title ?? "No tracks yet"}
          artist={topTrack?.artist ?? "\u2014"}
          genres={campaigns[0]?.genres ?? []}
          thumbnailUrl={topTrack?.thumbnail_url ?? null}
          totalViews={1_345_654}
          creatorCount={145}
        />

        {/* Right: Budget + Creators */}
        <div className="flex flex-col gap-4">
          <CampaignBudgetCard
            activeCampaigns={campaigns.length}
            budgetAvailable={40}
          />
          <TopCreatorSubmissions creators={placeholderCreators} />
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
