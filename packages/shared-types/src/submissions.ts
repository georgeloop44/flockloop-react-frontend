export type SubmissionStatus = "pending" | "accepted" | "rejected";
export type SubmissionDecision = "accepted" | "rejected";

export interface SubmissionRead {
  id: string;
  status: SubmissionStatus;
  campaign_id: string;
  youtube_url: string;
  content_creator_id: string;
  created_at: string;
  feedback: string | null;
  reviewed_by_id: string | null;
  reviewed_at: string | null;
  youtube_video_id: string | null;
  view_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  stats_fetched_at: string | null;
}

export interface SubmissionCreate {
  campaign_id: string;
  youtube_url: string;
}

export interface SubmissionReview {
  decision: SubmissionDecision;
  feedback?: string;
}
