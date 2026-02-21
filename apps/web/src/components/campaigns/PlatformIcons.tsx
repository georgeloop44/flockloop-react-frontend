import { cn } from "@/lib/utils";

const platformConfig = {
  tiktok: { label: "TikTok", color: "text-tiktok" },
  instagram: { label: "Instagram", color: "text-instagram" },
  youtube: { label: "YouTube", color: "text-youtube" },
} as const;

// Simple SVG icons for platforms (avoids extra icon library dependency)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.65a8.35 8.35 0 0 0 4.76 1.49V6.69h-1z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

const iconMap = {
  tiktok: TikTokIcon,
  instagram: TikTokIcon, // placeholder, uses same shape
  youtube: YouTubeIcon,
} as const;

export function PlatformIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase() as keyof typeof platformConfig;
  const config = platformConfig[key];
  const Icon = iconMap[key];

  if (!config || !Icon) return null;

  return (
    <Icon
      className={cn("h-4 w-4", config.color)}
    />
  );
}

export function PlatformIcons({ platforms }: { platforms: string[] }) {
  if (platforms.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {platforms.map((p) => (
        <PlatformIcon key={p} platform={p} />
      ))}
    </div>
  );
}

export function LinkBadge({ type }: { type: string | null | undefined }) {
  if (!type) return null;

  const color = type === "spotify" ? "text-spotify" : "text-soundcloud";
  const label = type === "spotify" ? "Spotify" : "SoundCloud";

  return (
    <span className={cn("text-xs font-medium", color)}>
      {label}
    </span>
  );
}
