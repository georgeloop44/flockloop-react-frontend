import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMediaUpload, useCreateTrack, getErrorMessage } from "@flockloop/api-client";
import { toast } from "sonner";
import { X, Upload, Music, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const trackFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
});

type TrackFormValues = z.infer<typeof trackFormSchema>;

interface UploadTrackDialogProps {
  open: boolean;
  onClose: () => void;
}

export function UploadTrackDialog({ open, onClose }: UploadTrackDialogProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const audioUpload = useMediaUpload();
  const coverUpload = useMediaUpload();
  const createTrack = useCreateTrack();

  const isPending = audioUpload.isPending || coverUpload.isPending || createTrack.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<TrackFormValues>({
    resolver: zodResolver(trackFormSchema),
  });

  if (!open) return null;

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setAudioFile(selected);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setCoverFile(selected);
      const url = URL.createObjectURL(selected);
      setCoverPreview(url);
    }
  };

  const handleClose = () => {
    if (isPending) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setAudioFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    resetForm();
    onClose();
  };

  const onSubmit = async (formData: TrackFormValues) => {
    if (!audioFile) return;

    let audioMediaId: string;
    try {
      const audioMedia = await audioUpload.mutateAsync({
        file: audioFile,
        mediaType: "song",
      });
      audioMediaId = audioMedia.id;
    } catch (err) {
      toast.error(`Audio upload failed: ${getErrorMessage(err)}`);
      return;
    }

    let thumbnailId: string | undefined;
    if (coverFile) {
      try {
        const coverMedia = await coverUpload.mutateAsync({
          file: coverFile,
          mediaType: "thumbnail",
        });
        thumbnailId = coverMedia.id;
      } catch (err) {
        toast.error(`Cover art upload failed: ${getErrorMessage(err)}`);
        return;
      }
    }

    try {
      await createTrack.mutateAsync({
        title: formData.title,
        artist: formData.artist,
        media_id: audioMediaId,
        thumbnail_id: thumbnailId,
      });
      toast.success("Track uploaded successfully");
      handleClose();
    } catch (err) {
      toast.error(`Track creation failed: ${getErrorMessage(err)}`);
    }
  };

  const currentStep = audioUpload.isPending
    ? "Uploading audio\u2026"
    : coverUpload.isPending
      ? "Uploading cover art\u2026"
      : createTrack.isPending
        ? "Creating track\u2026"
        : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Upload track"
        className="relative w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Upload Track</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Audio file picker */}
          <div>
            <label className="mb-1.5 block text-sm text-foreground-secondary">
              Audio File
            </label>
            <div
              onClick={() => !isPending && audioInputRef.current?.click()}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors",
                audioFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-foreground-muted",
                isPending && "pointer-events-none opacity-50",
              )}
            >
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/mpeg,audio/wav,audio/flac,audio/aac,audio/ogg"
                onChange={handleAudioChange}
                className="hidden"
                aria-label="Select audio file"
              />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
                <Music
                  className={cn("h-5 w-5", audioFile ? "text-primary" : "text-foreground-muted")}
                  aria-hidden="true"
                />
              </div>
              {audioFile ? (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{audioFile.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {(audioFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <p className="text-sm text-foreground-muted">Click to select an audio file</p>
              )}
            </div>
            {audioUpload.isPending ? (
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${audioUpload.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs tabular-nums text-foreground-muted">
                  {audioUpload.progress}%
                </p>
              </div>
            ) : null}
          </div>

          {/* Cover art picker */}
          <div>
            <label className="mb-1.5 block text-sm text-foreground-secondary">
              Cover Art <span className="text-foreground-muted">(optional)</span>
            </label>
            <div className="flex items-start gap-3">
              <div
                onClick={() => !isPending && coverInputRef.current?.click()}
                className={cn(
                  "flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
                  coverPreview
                    ? "border-primary/50"
                    : "border-border hover:border-foreground-muted",
                  isPending && "pointer-events-none opacity-50",
                )}
              >
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                  aria-label="Select cover art"
                />
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus className="h-6 w-6 text-foreground-muted" aria-hidden="true" />
                )}
              </div>
              <div className="pt-1">
                {coverFile ? (
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{coverFile.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        if (coverPreview) URL.revokeObjectURL(coverPreview);
                        setCoverPreview(null);
                      }}
                      disabled={isPending}
                      className="mt-0.5 text-xs text-destructive hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-foreground-muted">
                    JPEG, PNG, or WebP
                  </p>
                )}
              </div>
            </div>
            {coverUpload.isPending ? (
              <div className="mt-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${coverUpload.progress}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="track-title" className="mb-1.5 block text-sm text-foreground-secondary">
              Title
            </label>
            <input
              id="track-title"
              type="text"
              {...register("title")}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              placeholder="Track title"
            />
            {errors.title ? (
              <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          {/* Artist */}
          <div>
            <label htmlFor="track-artist" className="mb-1.5 block text-sm text-foreground-secondary">
              Artist
            </label>
            <input
              id="track-artist"
              type="text"
              {...register("artist")}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              placeholder="Artist name"
            />
            {errors.artist ? (
              <p className="mt-1 text-xs text-destructive">{errors.artist.message}</p>
            ) : null}
          </div>

          {/* Status message */}
          {currentStep ? (
            <p className="text-sm text-foreground-muted">{currentStep}</p>
          ) : null}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!audioFile || isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:opacity-50"
            >
              {isPending ? (
                currentStep
              ) : (
                <>
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
