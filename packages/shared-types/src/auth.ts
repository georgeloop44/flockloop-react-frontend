export type UserType = "content_creator" | "campaign_manager";

export interface UserRead {
  id: string;
  email: string;
  name: string;
  type: UserType;
  is_verified: boolean;
  organisation_id: string | null;
  is_admin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface MessageResponse {
  message: string;
}

export interface ResendConfirmationRequest {
  email: string;
}
