import { z } from "zod";

/**
 * Matches:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtube.com/watch?v=VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 */
const YOUTUBE_URL_REGEX =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[\w-]+/;

export const youtubeUrlSchema = z
  .string()
  .min(1, "YouTube URL is required")
  .regex(
    YOUTUBE_URL_REGEX,
    "Enter a valid YouTube URL (youtube.com/watch, /shorts/, or youtu.be/)",
  );

/** Extract the video ID from a YouTube URL. Returns null if not parseable. */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/")[2] || null;
    }
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}
