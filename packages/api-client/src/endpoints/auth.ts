import { apiClient } from "../client";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  MessageResponse,
  ResendConfirmationRequest,
  UserRead,
} from "@flockloop/shared-types";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>("/auth/login", data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<TokenResponse>("/auth/refresh", { refresh_token: refreshToken })
      .then((r) => r.data),

  logout: () =>
    apiClient.post<MessageResponse>("/auth/logout").then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<MessageResponse>("/auth/register", data).then((r) => r.data),

  confirmEmail: (token: string) =>
    apiClient
      .get<MessageResponse>("/auth/confirm", { params: { token } })
      .then((r) => r.data),

  resendConfirmation: (data: ResendConfirmationRequest) =>
    apiClient
      .post<MessageResponse>("/auth/resend-confirmation", data)
      .then((r) => r.data),

  me: () => apiClient.get<UserRead>("/auth/me").then((r) => r.data),
};
