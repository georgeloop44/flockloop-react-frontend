import { apiClient } from "../client";
import type {
  OrgRegistrationRequest,
  OrgRegistrationResponse,
  InvitationSendRequest,
  InvitationAcceptRequest,
  InvitationRead,
  MessageResponse,
} from "@flockloop/shared-types";

export const organisationsApi = {
  register: (data: OrgRegistrationRequest) =>
    apiClient
      .post<OrgRegistrationResponse>("/organisations/register", data)
      .then((r) => r.data),

  sendInvitation: (data: InvitationSendRequest) =>
    apiClient
      .post<MessageResponse>("/organisations/invitations", data)
      .then((r) => r.data),

  acceptInvitation: (data: InvitationAcceptRequest) =>
    apiClient
      .post<MessageResponse>("/organisations/invitations/accept", data)
      .then((r) => r.data),

  listInvitations: () =>
    apiClient
      .get<InvitationRead[]>("/organisations/invitations")
      .then((r) => r.data),

  revokeInvitation: (invitationId: string) =>
    apiClient
      .post<MessageResponse>(
        `/organisations/invitations/${invitationId}/revoke`,
      )
      .then((r) => r.data),
};
