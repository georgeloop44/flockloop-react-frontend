export interface YouTubeAuthorizeResponse {
  authorize_url: string;
}

export interface YouTubeStatus {
  connected: boolean;
  channel_id: string | null;
  channel_title: string | null;
  connected_at: string | null;
}
