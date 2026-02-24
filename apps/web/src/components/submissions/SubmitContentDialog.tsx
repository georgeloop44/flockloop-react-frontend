import { useState, useRef } from "react";
import { useMediaUpload, useCreateSubmission } from "@flockloop/api-client";
import { toast } from "sonner";
import { Upload, X, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/Dialog";

interface SubmitContentDialogProps {
  campaignId: string;
  campaignName: string;
  open: boolean;
  onClose: () => void;
}

export function SubmitContentDialog({
  campaignId,
  campaignName,
  open,
  onClose,
}: SubmitContentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaUpload = useMediaUpload();
  const createSubmission = useCreateSubmission();

  const isUploading = mediaUpload.isPending;
  const isSubmitting = createSubmission.isPending;
  const isPending = isUploading || isSubmitting;

  const handleClose = () => {
    if (isPending) return;
    setFile(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const media = await mediaUpload.mutateAsync({
        file,
        mediaType: "video",
      });

      await createSubmission.mutateAsync({
        campaign_id: campaignId,
        media_id: media.id,
      });

      toast.success("Submission created successfully");
      setFile(null);
      onClose();
    } catch {
      toast.error("Failed to submit content. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      ariaLabel={`Submit content for ${campaignName}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Submit Content
        </h2>
        <button
          type="button"
          onClick={handleClose}
          className="rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="mb-4 text-sm text-foreground-muted">
        Upload a video for <span className="text-foreground">{campaignName}</span>
      </p>

      {/* File picker */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          file
            ? "border-primary/50 bg-primary/5"
            : "border-border hover:border-foreground-muted",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select video file"
        />
        {file ? (
          <>
            <FileVideo className="h-8 w-8 text-primary" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-foreground-muted">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-foreground-muted" aria-hidden="true" />
            <p className="mt-2 text-sm text-foreground-muted">
              Click to select a video file
            </p>
          </>
        )}
      </div>

      {/* Upload progress */}
      {isUploading ? (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${mediaUpload.progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-foreground-muted">Uploading\u2026</p>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          disabled={isPending}
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:opacity-50"
        >
          {isPending ? "Submitting\u2026" : "Submit"}
        </button>
      </div>
    </Dialog>
  );
}
