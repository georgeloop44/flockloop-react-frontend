import {
  queryOptions,
  skipToken,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { campaignsApi } from "../endpoints/campaigns";
import type { CampaignCreate } from "@flockloop/shared-types";

export const campaignOptions = {
  all: () =>
    queryOptions({
      queryKey: ["campaigns"],
      queryFn: campaignsApi.list,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["campaigns", id],
      queryFn: id ? () => campaignsApi.get(id) : skipToken,
    }),
};

export function useCampaigns() {
  return useSuspenseQuery(campaignOptions.all());
}

export function useCampaign(id: string) {
  return useSuspenseQuery(campaignOptions.detail(id));
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CampaignCreate) => campaignsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
