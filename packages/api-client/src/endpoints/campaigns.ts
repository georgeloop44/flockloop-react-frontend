import { apiClient, fixThumbnailUrl } from "../client";
import type { CampaignRead, CampaignCreate } from "@flockloop/shared-types";

function fixCampaignUrls(campaign: CampaignRead): CampaignRead {
  return { ...campaign, track: fixThumbnailUrl(campaign.track) };
}

export const campaignsApi = {
  list: () =>
    apiClient
      .get<CampaignRead[]>("/campaigns/")
      .then((r) => r.data.map(fixCampaignUrls)),

  get: (id: string) =>
    apiClient
      .get<CampaignRead>(`/campaigns/${id}`)
      .then((r) => fixCampaignUrls(r.data)),

  create: (data: CampaignCreate) =>
    apiClient
      .post<CampaignRead>("/campaigns/", data)
      .then((r) => fixCampaignUrls(r.data)),
};
