import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { tracksApi } from "../endpoints/tracks";
import type { TrackCreate } from "@flockloop/shared-types";

export const trackOptions = {
  all: () =>
    queryOptions({
      queryKey: ["tracks"],
      queryFn: tracksApi.list,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ["tracks", id],
      queryFn: () => tracksApi.get(id),
      enabled: !!id,
    }),
};

export function useTracks() {
  return useSuspenseQuery(trackOptions.all());
}

export function useTrack(id: string) {
  return useSuspenseQuery(trackOptions.detail(id));
}

export function useCreateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TrackCreate) => tracksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
}
