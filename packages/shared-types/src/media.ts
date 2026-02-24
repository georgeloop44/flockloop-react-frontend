export type MediaType = "song" | "video" | "thumbnail";
export type MediaStatus = "pending" | "ready" | "rejected";

export interface UploadRequest {
  filename: string;
  content_type: string;
  media_type: MediaType;
}

export interface UploadResponse {
  media_id: string;
  upload_url: string;
  s3_key: string;
}

export interface MediaRead {
  id: string;
  filename: string;
  content_type: string;
  media_type: MediaType;
  s3_key: string;
  size_bytes: number | null;
  status: MediaStatus;
  uploaded_by_id: string;
  created_at: string;
  auto_thumbnail_id: string | null;
}

export interface DownloadResponse {
  media_id: string;
  download_url: string;
}
