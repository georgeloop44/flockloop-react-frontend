import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useCampaigns } from "@flockloop/api-client";
import { useAudioStore, setSkipCallbacks } from "@flockloop/audio-state";
import type { CampaignRead } from "@flockloop/shared-types";
import type { AudioTrack } from "@flockloop/audio-state";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { CampaignDetailPanel } from "@/components/campaigns/CampaignDetailPanel";
import { CampaignFilters } from "@/components/campaigns/CampaignFilters";
import { useAudioPlayer } from "@/hooks/use-audio-player";

function campaignToAudioTrack(campaign: CampaignRead): AudioTrack {
  return {
    trackId: campaign.track.id,
    title: campaign.track.title,
    artist: campaign.track.artist,
    thumbnailUrl: campaign.track.thumbnail_url,
    mediaId: campaign.track_id,
  };
}

function DiscoverContent() {
  const { data: campaigns } = useCampaigns();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  const { loadAndPlay } = useAudioPlayer();
  const currentTrackId = useAudioStore((s) => s.currentTrack?.trackId);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const pause = useAudioStore((s) => s.pause);
  const resume = useAudioStore((s) => s.resume);

  // Listen for seek events from the BottomAudioPlayer
  const audioPlayer = useAudioPlayer();
  useEffect(() => {
    function handleSeek(e: Event) {
      const time = (e as CustomEvent<number>).detail;
      audioPlayer.seek(time);
    }
    window.addEventListener("flockloop:seek", handleSeek);
    return () => window.removeEventListener("flockloop:seek", handleSeek);
  }, [audioPlayer]);

  const selectedCampaign = useMemo(
    () => campaigns.find((c) => c.id === selectedId) ?? null,
    [campaigns, selectedId],
  );

  // Extract unique genres and platforms for filter dropdowns
  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const c of campaigns) {
      for (const g of c.genres ?? []) set.add(g);
    }
    return [...set].toSorted();
  }, [campaigns]);

  const platforms = useMemo(() => {
    const set = new Set<string>();
    for (const c of campaigns) {
      for (const p of c.platforms ?? []) set.add(p);
    }
    return [...set].toSorted();
  }, [campaigns]);

  // Column filters for react-table
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (genreFilter) filters.push({ id: "genres", value: genreFilter });
    if (platformFilter) filters.push({ id: "platforms", value: platformFilter });
    return filters;
  }, [genreFilter, platformFilter]);

  // Skip next/previous callbacks for playlist navigation
  useEffect(() => {
    setSkipCallbacks(
      () => {
        if (!campaigns.length) return;
        const idx = campaigns.findIndex((c) => c.track.id === currentTrackId);
        const next = campaigns[(idx + 1) % campaigns.length];
        if (next) {
          setSelectedId(next.id);
          loadAndPlay(campaignToAudioTrack(next), "");
        }
      },
      () => {
        if (!campaigns.length) return;
        const idx = campaigns.findIndex((c) => c.track.id === currentTrackId);
        const prev = campaigns[(idx - 1 + campaigns.length) % campaigns.length];
        if (prev) {
          setSelectedId(prev.id);
          loadAndPlay(campaignToAudioTrack(prev), "");
        }
      },
    );
  }, [campaigns, currentTrackId, loadAndPlay]);

  const handleSelect = useCallback((campaign: CampaignRead) => {
    setSelectedId(campaign.id);
  }, []);

  const handlePlayToggle = useCallback(
    (campaign: CampaignRead) => {
      const isCurrentTrack = currentTrackId === campaign.track.id;
      if (isCurrentTrack && isPlaying) {
        pause();
      } else if (isCurrentTrack) {
        resume();
      } else {
        setSelectedId(campaign.id);
        // TODO: fetch presigned download URL for the track's media_id
        // For now, we just set the track in the audio store
        loadAndPlay(campaignToAudioTrack(campaign), "");
      }
    },
    [currentTrackId, isPlaying, pause, resume, loadAndPlay],
  );

  const handleCreateAndEarn = useCallback((_campaign: CampaignRead) => {
    // TODO: Open SubmitContentDialog
  }, []);

  const handleSkip = useCallback(() => {
    // Move to next campaign in the list
    if (!campaigns.length || !selectedId) return;
    const idx = campaigns.findIndex((c) => c.id === selectedId);
    const next = campaigns[(idx + 1) % campaigns.length];
    if (next) setSelectedId(next.id);
  }, [campaigns, selectedId]);

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Detail panel */}
      {selectedCampaign ? (
        <CampaignDetailPanel
          campaign={selectedCampaign}
          onPlayToggle={handlePlayToggle}
          onCreateAndEarn={handleCreateAndEarn}
          onSkip={handleSkip}
        />
      ) : null}

      {/* Filters */}
      <CampaignFilters
        genreFilter={genreFilter}
        platformFilter={platformFilter}
        onGenreChange={setGenreFilter}
        onPlatformChange={setPlatformFilter}
        genres={genres}
        platforms={platforms}
      />

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CampaignTable
          campaigns={campaigns}
          selectedId={selectedId}
          onSelect={handleSelect}
          onPlayToggle={handlePlayToggle}
          columnFilters={columnFilters}
        />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-6">
      <div className="h-32 animate-pulse rounded-xl bg-surface" />
      <div className="flex gap-2">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-surface" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-surface" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-surface" />
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-12 animate-pulse rounded bg-surface" />
      ))}
    </div>
  );
}

export default function DiscoverCampaignsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DiscoverContent />
    </Suspense>
  );
}
