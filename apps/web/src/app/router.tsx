import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "@flockloop/auth-store";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { RoleGate } from "@/components/shared/RoleGate";
import { AppShell } from "@/components/layout/AppShell";
import { AuthLayout } from "@/components/layout/AuthLayout";

// Auth pages — lightweight, load eagerly
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ConfirmEmailPage } from "@/pages/auth/ConfirmEmailPage";
import { AcceptInvitationPage } from "@/pages/auth/AcceptInvitationPage";

// Dashboard pages — lazy load for bundle splitting
const DiscoverCampaignsPage = lazy(
  () => import("@/pages/creator/DiscoverCampaignsPage"),
);
const MySubmissionsPage = lazy(
  () => import("@/pages/creator/MySubmissionsPage"),
);
const OverviewPage = lazy(() => import("@/pages/manager/OverviewPage"));
const MyCampaignsPage = lazy(
  () => import("@/pages/manager/MyCampaignsPage"),
);
const MyTracksPage = lazy(() => import("@/pages/manager/MyTracksPage"));

function PageSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      // Creator routes
      {
        path: "discover",
        element: (
          <RoleGate allowedRole="content_creator">
            <Suspense fallback={<PageSkeleton />}>
              <DiscoverCampaignsPage />
            </Suspense>
          </RoleGate>
        ),
      },
      {
        path: "my-submissions",
        element: (
          <RoleGate allowedRole="content_creator">
            <Suspense fallback={<PageSkeleton />}>
              <MySubmissionsPage />
            </Suspense>
          </RoleGate>
        ),
      },
      // Manager routes
      {
        path: "overview",
        element: (
          <RoleGate allowedRole="campaign_manager">
            <Suspense fallback={<PageSkeleton />}>
              <OverviewPage />
            </Suspense>
          </RoleGate>
        ),
      },
      {
        path: "campaigns",
        element: (
          <RoleGate allowedRole="campaign_manager">
            <Suspense fallback={<PageSkeleton />}>
              <MyCampaignsPage />
            </Suspense>
          </RoleGate>
        ),
      },
      {
        path: "tracks",
        element: (
          <RoleGate allowedRole="campaign_manager">
            <Suspense fallback={<PageSkeleton />}>
              <MyTracksPage />
            </Suspense>
          </RoleGate>
        ),
      },
      // Default redirect based on role is handled in AppShell
      {
        index: true,
        element: <RoleRedirect />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "confirm-email", element: <ConfirmEmailPage /> },
      { path: "accept-invitation", element: <AcceptInvitationPage /> },
    ],
  },
]);

/** Redirects "/" to the appropriate dashboard based on user role */
function RoleRedirect() {
  const user = useAuthStore((s) => s.user);

  if (user?.type === "content_creator") {
    return <Navigate to="/discover" replace />;
  }
  if (user?.type === "campaign_manager") {
    return <Navigate to="/overview" replace />;
  }
  return <Navigate to="/login" replace />;
}
