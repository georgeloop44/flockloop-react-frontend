import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useAuthStore } from "@flockloop/auth-store";
import { authApi } from "../endpoints/auth";
import { organisationsApi } from "../endpoints/organisations";
import type {
  LoginRequest,
  RegisterRequest,
  ResendConfirmationRequest,
  OrgRegistrationRequest,
  InvitationAcceptRequest,
} from "@flockloop/shared-types";

export const authOptions = {
  me: () =>
    queryOptions({
      queryKey: ["auth", "me"],
      queryFn: authApi.me,
    }),
};

export function useMe() {
  return useSuspenseQuery(authOptions.me());
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const tokenResponse = await authApi.login(data);
      // Store tokens before fetching profile so the request interceptor can attach it
      useAuthStore
        .getState()
        .setAuth(tokenResponse.access_token, tokenResponse.refresh_token, null);
      const user = await authApi.me();
      return {
        token: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        user,
      };
    },
    onSuccess: ({ token, refreshToken, user }) => {
      setAuth(token, refreshToken, user);
    },
  });
}

/** Extract a human-readable error message from an Axios error or generic Error */
export function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const resp = (error as { response?: { data?: { detail?: string } } }).response;
    if (resp?.data?.detail) return resp.data.detail;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // Ignore errors — clear local state regardless
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useRegisterOrg() {
  return useMutation({
    mutationFn: (data: OrgRegistrationRequest) =>
      organisationsApi.register(data),
  });
}

export function useConfirmEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.confirmEmail(token),
  });
}

export function useResendConfirmation() {
  return useMutation({
    mutationFn: (data: ResendConfirmationRequest) =>
      authApi.resendConfirmation(data),
  });
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (data: InvitationAcceptRequest) =>
      organisationsApi.acceptInvitation(data),
  });
}
