import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { youtubeApi } from "../endpoints/youtube";

export const youtubeOptions = {
  status: () =>
    queryOptions({
      queryKey: ["youtube", "status"],
      queryFn: youtubeApi.status,
    }),
};

export function useYouTubeStatus() {
  return useSuspenseQuery(youtubeOptions.status());
}

export function useYouTubeAuthorize() {
  return useMutation({
    mutationFn: () => youtubeApi.authorize(),
  });
}

export function useYouTubeDisconnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => youtubeApi.disconnect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube", "status"] });
    },
  });
}
