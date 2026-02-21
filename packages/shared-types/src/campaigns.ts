export interface TrackSummary {
  id: string;
  title: string;
  artist: string;
  thumbnail_url: string | null;
}

export interface CampaignRead {
  id: string;
  name: string;
  organisation_id: string;
  track_id: string;
  created_by_id: string;
  track: TrackSummary;
  // Extended fields (may not be present in current backend)
  genres?: string[];
  styles?: string[];
  platforms?: string[];
  link?: string | null;
  link_type?: "spotify" | "soundcloud" | null;
  max_submissions?: number;
  submissions_count?: number;
}

export interface CampaignCreate {
  name: string;
  track_id: string;
}
