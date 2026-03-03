import { apiClient } from "../client";
import type {
  YouTubeAuthorizeResponse,
  YouTubeStatus,
} from "@flockloop/shared-types";

export const youtubeApi = {
  authorize: () =>
    apiClient
      .get<YouTubeAuthorizeResponse>("/youtube/authorize")
      .then((r) => r.data),

  status: () =>
    apiClient.get<YouTubeStatus>("/youtube/status").then((r) => r.data),

  disconnect: () =>
    apiClient.delete("/youtube/disconnect").then(() => undefined),
};
