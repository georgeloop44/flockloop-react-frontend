import { Navigate, useLocation } from "react-router-dom";
import {
  useAuthStore,
  selectIsAuthenticated,
} from "@flockloop/auth-store";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
