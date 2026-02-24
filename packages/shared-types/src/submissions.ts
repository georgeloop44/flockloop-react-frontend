export type SubmissionStatus = "pending" | "accepted" | "rejected";
export type SubmissionDecision = "accepted" | "rejected";

export interface SubmissionRead {
  id: string;
  status: SubmissionStatus;
  campaign_id: string;
  media_id: string | null;
  thumbnail_id: string | null;
  content_creator_id: string;
  feedback: string | null;
  reviewed_by_id: string | null;
  reviewed_at: string | null;
}

export interface SubmissionCreate {
  campaign_id: string;
  media_id: string;
  thumbnail_id?: string;
}

export interface SubmissionReview {
  decision: SubmissionDecision;
  feedback?: string;
}
