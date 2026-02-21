// Client
export { apiClient, setApiBaseUrl } from "./client";
export { queryClient } from "./query-client";

// Endpoints
export { authApi } from "./endpoints/auth";
export { organisationsApi } from "./endpoints/organisations";
export { campaignsApi } from "./endpoints/campaigns";
export { tracksApi } from "./endpoints/tracks";
export { submissionsApi } from "./endpoints/submissions";
export { mediaApi } from "./endpoints/media";

// Query options factories
export { authOptions } from "./hooks/use-auth";
export { campaignOptions } from "./hooks/use-campaigns";
export { trackOptions } from "./hooks/use-tracks";
export { submissionOptions } from "./hooks/use-submissions";
export { mediaOptions } from "./hooks/use-media";
export { organisationOptions } from "./hooks/use-organisations";

// Auth hooks
export {
  useMe,
  useLogin,
  useLogout,
  useRegister,
  useRegisterOrg,
  useConfirmEmail,
  useResendConfirmation,
  useAcceptInvitation,
  getErrorMessage,
} from "./hooks/use-auth";

// Campaign hooks
export {
  useCampaigns,
  useCampaign,
  useCreateCampaign,
} from "./hooks/use-campaigns";

// Track hooks
export { useTracks, useTrack, useCreateTrack } from "./hooks/use-tracks";

// Submission hooks
export {
  useMySubmissions,
  useCampaignSubmissions,
  useCreateSubmission,
  useReviewSubmission,
} from "./hooks/use-submissions";

// Media hooks
export { useDownloadUrl, useMediaUpload } from "./hooks/use-media";

// Organisation hooks
export {
  useInvitations,
  useSendInvitation,
  useRevokeInvitation,
} from "./hooks/use-organisations";
