import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { submissionsApi } from "../endpoints/submissions";
import type {
  SubmissionCreate,
  SubmissionReview,
} from "@flockloop/shared-types";

export const submissionOptions = {
  mine: () =>
    queryOptions({
      queryKey: ["submissions", "mine"],
      queryFn: submissionsApi.list,
    }),
  byCampaign: (campaignId: string) =>
    queryOptions({
      queryKey: ["submissions", "campaign", campaignId],
      queryFn: () => submissionsApi.listByCampaign(campaignId),
      enabled: !!campaignId,
    }),
};

export function useMySubmissions() {
  return useSuspenseQuery(submissionOptions.mine());
}

export function useCampaignSubmissions(campaignId: string) {
  return useSuspenseQuery(submissionOptions.byCampaign(campaignId));
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmissionCreate) => submissionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string;
      data: SubmissionReview;
    }) => submissionsApi.review(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
