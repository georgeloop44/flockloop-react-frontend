import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { organisationsApi } from "../endpoints/organisations";
import type { InvitationSendRequest } from "@flockloop/shared-types";

export const organisationOptions = {
  invitations: () =>
    queryOptions({
      queryKey: ["organisations", "invitations"],
      queryFn: organisationsApi.listInvitations,
    }),
};

export function useInvitations() {
  return useSuspenseQuery(organisationOptions.invitations());
}

export function useSendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvitationSendRequest) =>
      organisationsApi.sendInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organisations", "invitations"],
      });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      organisationsApi.revokeInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organisations", "invitations"],
      });
    },
  });
}
