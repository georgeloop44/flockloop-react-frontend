export interface TrackRead {
  id: string;
  title: string;
  artist: string;
  organisation_id: string;
  media_id: string;
  thumbnail_id: string | null;
  thumbnail_url: string | null;
}

export interface TrackCreate {
  title: string;
  artist: string;
  media_id: string;
  thumbnail_id?: string;
}
