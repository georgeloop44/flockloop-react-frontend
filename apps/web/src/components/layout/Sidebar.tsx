import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore, selectIsCreator, selectIsManager } from "@flockloop/auth-store";
import { useLogout } from "@flockloop/api-client";
import { Music, Eye, Send, LayoutDashboard, LogOut, Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Hoist static data outside component (React best practice)
const creatorLinks = [
  { to: "/discover", label: "Discover", icon: Music },
  { to: "/my-submissions", label: "My Submissions", icon: Send },
] as const;

const managerLinks = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/campaigns", label: "My Campaigns", icon: Eye },
  { to: "/tracks", label: "Tracks", icon: Disc3 },
] as const;

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const isCreator = useAuthStore(selectIsCreator);
  const isManager = useAuthStore(selectIsManager);
  const navigate = useNavigate();
  const logout = useLogout();

  const links = isCreator ? creatorLinks : isManager ? managerLinks : [];

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <aside className="flex w-[189px] shrink-0 flex-col border-r border-border-subtle bg-surface">
      {/* Logo */}
      <div className="px-4 pt-6">
        <span className="text-lg font-bold text-foreground">flockloop</span>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col gap-1 px-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                isActive
                  ? "bg-surface-elevated text-foreground"
                  : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout at bottom */}
      <div className="mt-auto border-t border-border-subtle p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-medium text-foreground">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.name}
            </p>
            <p className="truncate text-xs text-foreground-muted">
              {isCreator ? "Content Creator" : "Music Owner"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="shrink-0 rounded p-1.5 text-foreground-muted transition-colors hover:text-destructive focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
