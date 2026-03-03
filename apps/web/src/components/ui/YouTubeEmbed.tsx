import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, className }: YouTubeEmbedProps) {
  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-lg",
        className,
      )}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
