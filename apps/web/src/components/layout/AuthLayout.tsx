import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated } from "@flockloop/auth-store";

export function AuthLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);

  // If already logged in, redirect to dashboard
  if (isAuthenticated && user) {
    const redirectTo =
      user.type === "content_creator" ? "/discover" : "/overview";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground" style={{ textWrap: "balance" }}>
            flockloop
          </h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
