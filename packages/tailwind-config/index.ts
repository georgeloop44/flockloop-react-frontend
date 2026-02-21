/** Shared FlockLoop dark theme tokens — used by both web and mobile Tailwind configs */
export const flockloopTheme = {
  colors: {
    background: "#0d0d12",
    surface: "#16161e",
    "surface-elevated": "#1e1e28",
    "surface-hover": "#252530",
    border: "#2a2a36",
    "border-subtle": "#1f1f2a",

    primary: "#8b5cf6",
    "primary-hover": "#7c3aed",
    "primary-foreground": "#ffffff",

    accent: "#22c55e",
    "accent-foreground": "#ffffff",

    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",

    muted: "#6b7280",
    "muted-foreground": "#9ca3af",

    foreground: "#f9fafb",
    "foreground-secondary": "#d1d5db",
    "foreground-muted": "#9ca3af",

    // Status colors
    "status-pending": "#f59e0b",
    "status-accepted": "#22c55e",
    "status-rejected": "#ef4444",

    // Platform brand colors
    tiktok: "#ff0050",
    instagram: "#e1306c",
    youtube: "#ff0000",
    spotify: "#1db954",
    soundcloud: "#ff5500",
  },
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "monospace"],
  },
} as const;
