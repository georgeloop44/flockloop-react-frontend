import { apiClient } from "../client";
import type {
  SubmissionRead,
  SubmissionCreate,
  SubmissionReview,
} from "@flockloop/shared-types";

export const submissionsApi = {
  list: () =>
    apiClient.get<SubmissionRead[]>("/submissions/").then((r) => r.data),

  listByCampaign: (campaignId: string) =>
    apiClient
      .get<SubmissionRead[]>(`/submissions/campaign/${campaignId}`)
      .then((r) => r.data),

  create: (data: SubmissionCreate) =>
    apiClient
      .post<SubmissionRead>("/submissions/", data)
      .then((r) => r.data),

  review: (submissionId: string, data: SubmissionReview) =>
    apiClient
      .patch<SubmissionRead>(`/submissions/${submissionId}/review`, data)
      .then((r) => r.data),
};
