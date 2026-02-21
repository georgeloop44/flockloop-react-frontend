import { TrendingUp, TrendingDown, BarChart3, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function StatCard({ label, value, trend, icon }: StatCard) {
  const isPositive = trend >= 0;

  return (
    <div className="flex-1 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          {icon}
          <span>{label}</span>
        </div>
        <button
          type="button"
          className="rounded p-0.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label={`Info about ${label}`}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
      <div className="mt-1 flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-accent" aria-hidden="true" />
        ) : (
          <TrendingDown className="h-3 w-3 text-destructive" aria-hidden="true" />
        )}
        <span
          className={cn(
            "text-xs tabular-nums",
            isPositive ? "text-accent" : "text-destructive",
          )}
        >
          {isPositive ? "\u2197" : "\u2198"} {Math.abs(trend)}%
        </span>
      </div>
    </div>
  );
}

// Platform SVG icons (small inline, avoids extra dependency)
function TikTokSmall() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-tiktok" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.65a8.35 8.35 0 0 0 4.76 1.49V6.69h-1z" />
    </svg>
  );
}

function InstagramSmall() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-instagram" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6.01 4.85.07 1.17.05 1.97.24 2.44.41a4.07 4.07 0 0 1 1.52.99c.46.46.77.94.99 1.52.17.47.36 1.27.41 2.44.06 1.25.07 1.65.07 4.85s-.01 3.6-.07 4.85c-.05 1.17-.24 1.97-.41 2.44a4.07 4.07 0 0 1-.99 1.52 4.07 4.07 0 0 1-1.52.99c-.47.17-1.27.36-2.44.41-1.25.06-1.65.07-4.85.07s-3.6-.01-4.85-.07c-1.17-.05-1.97-.24-2.44-.41a4.07 4.07 0 0 1-1.52-.99A4.07 4.07 0 0 1 2.2 18.3c-.17-.47-.36-1.27-.41-2.44C1.73 14.61 1.72 14.21 1.72 11s.01-3.6.07-4.85c.05-1.17.24-1.97.41-2.44a4.07 4.07 0 0 1 .99-1.52A4.07 4.07 0 0 1 4.71 1.2c.47-.17 1.27-.36 2.44-.41C8.4 2.73 8.8 2.72 12 2.72M12 1a10.89 10.89 0 0 0-4.95.07C5.83 1.13 5 1.34 4.36 1.63a5.27 5.27 0 0 0-1.96 1.28A5.27 5.27 0 0 0 1.13 4.87c-.29.64-.5 1.47-.56 2.69C.5 8.78.5 9.23.5 12s0 3.22.07 4.44c.06 1.22.27 2.05.56 2.69a5.27 5.27 0 0 0 1.27 1.96 5.27 5.27 0 0 0 1.96 1.28c.64.29 1.47.5 2.69.56C8.27 23 8.72 23 12 23s3.73 0 4.95-.07c1.22-.06 2.05-.27 2.69-.56a5.27 5.27 0 0 0 1.96-1.28 5.27 5.27 0 0 0 1.28-1.96c.29-.64.5-1.47.56-2.69.07-1.22.07-1.67.07-4.44s0-3.22-.07-4.44c-.06-1.22-.27-2.05-.56-2.69a5.27 5.27 0 0 0-1.28-1.96A5.27 5.27 0 0 0 19.64.63c-.64-.29-1.47-.5-2.69-.56A10.89 10.89 0 0 0 12 0zM12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

function YouTubeSmall() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-youtube" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

interface StatsCardRowProps {
  totalReach: number;
  tiktokReach: number;
  instagramReach: number;
  youtubeReach: number;
  totalTrend?: number;
  tiktokTrend?: number;
  instagramTrend?: number;
  youtubeTrend?: number;
}

export function StatsCardRow({
  totalReach,
  tiktokReach,
  instagramReach,
  youtubeReach,
  totalTrend = 20,
  tiktokTrend = 20,
  instagramTrend = 20,
  youtubeTrend = -20,
}: StatsCardRowProps) {
  return (
    <div className="flex gap-4">
      <StatCard
        label="Estimated Total Reach"
        value={formatNumber(totalReach)}
        trend={totalTrend}
        icon={<BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />}
      />
      <StatCard
        label="TikTok"
        value={formatNumber(tiktokReach)}
        trend={tiktokTrend}
        icon={<TikTokSmall />}
      />
      <StatCard
        label="Instagram"
        value={formatNumber(instagramReach)}
        trend={instagramTrend}
        icon={<InstagramSmall />}
      />
      <StatCard
        label="Youtube"
        value={formatNumber(youtubeReach)}
        trend={youtubeTrend}
        icon={<YouTubeSmall />}
      />
    </div>
  );
}
