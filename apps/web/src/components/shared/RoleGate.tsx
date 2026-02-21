import { Navigate } from "react-router-dom";
import { useAuthStore } from "@flockloop/auth-store";
import type { UserType } from "@flockloop/shared-types";
import type { ReactNode } from "react";

interface RoleGateProps {
  allowedRole: UserType;
  children: ReactNode;
}

export function RoleGate({ allowedRole, children }: RoleGateProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.type !== allowedRole) {
    // Redirect to the correct dashboard for their role
    const redirectTo =
      user.type === "content_creator" ? "/discover" : "/overview";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
