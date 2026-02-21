import {
  createBrowserRouter,
  Navigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
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
    <div className="flex h-full items-center justify-center" role="status">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="sr-only">Loading\u2026</span>
    </div>
  );
}

/** Catches errors from lazy imports, useSuspenseQuery failures, etc. */
function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    message =
      error.status === 404
        ? "The page you\u2019re looking for doesn\u2019t exist."
        : error.statusText || message;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="max-w-md text-sm text-foreground-muted">{message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        Reload page
      </button>
    </div>
  );
}

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
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
        errorElement: <RouteErrorBoundary />,
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
        errorElement: <RouteErrorBoundary />,
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
        errorElement: <RouteErrorBoundary />,
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
        errorElement: <RouteErrorBoundary />,
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
        errorElement: <RouteErrorBoundary />,
      },
      // Default redirect based on role
      {
        index: true,
        element: <RoleRedirect />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "confirm-email", element: <ConfirmEmailPage /> },
      { path: "accept-invitation", element: <AcceptInvitationPage /> },
    ],
  },
]);
