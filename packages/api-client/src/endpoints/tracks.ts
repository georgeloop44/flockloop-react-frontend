import { apiClient, fixThumbnailUrl } from "../client";
import type { TrackRead, TrackCreate } from "@flockloop/shared-types";

export const tracksApi = {
  list: () =>
    apiClient
      .get<TrackRead[]>("/tracks/")
      .then((r) => r.data.map(fixThumbnailUrl)),

  get: (id: string) =>
    apiClient
      .get<TrackRead>(`/tracks/${id}`)
      .then((r) => fixThumbnailUrl(r.data)),

  create: (data: TrackCreate) =>
    apiClient
      .post<TrackRead>("/tracks/", data)
      .then((r) => fixThumbnailUrl(r.data)),
};
