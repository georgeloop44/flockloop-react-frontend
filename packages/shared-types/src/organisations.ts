export interface OrgRegistrationRequest {
  org_name: string;
  email: string;
  name: string;
  password: string;
}

export interface OrgRegistrationResponse {
  message: string;
  organisation_id: string;
}

export interface InvitationSendRequest {
  email: string;
}

export interface InvitationAcceptRequest {
  token: string;
  name: string;
  password: string;
}

export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export interface InvitationRead {
  id: string;
  email: string;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
}
