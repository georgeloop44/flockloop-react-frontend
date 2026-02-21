import { useLocation } from "react-router-dom";
import { Coins } from "lucide-react";

// Hoist static map outside component
const pageTitles: Record<string, string> = {
  "/discover": "Discover Campaigns",
  "/my-submissions": "My Submissions",
  "/overview": "Overview",
  "/campaigns": "My Campaigns",
};

export function TopBar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "FlockLoop";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-subtle px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm tabular-nums text-foreground-secondary">100</span>
        <Coins className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
      </div>
    </header>
  );
}
