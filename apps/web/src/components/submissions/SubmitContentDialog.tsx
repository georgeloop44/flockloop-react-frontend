import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSubmission, getErrorMessage } from "@flockloop/api-client";
import { toast } from "sonner";
import { X, Link } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { youtubeUrlSchema } from "@/lib/youtube";

const submitFormSchema = z.object({
  youtube_url: youtubeUrlSchema,
});

type SubmitFormValues = z.infer<typeof submitFormSchema>;

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
  const createSubmission = useCreateSubmission();
  const isPending = createSubmission.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<SubmitFormValues>({
    resolver: zodResolver(submitFormSchema),
  });

  const handleClose = () => {
    if (isPending) return;
    resetForm();
    onClose();
  };

  const onSubmit = async (formData: SubmitFormValues) => {
    try {
      await createSubmission.mutateAsync({
        campaign_id: campaignId,
        youtube_url: formData.youtube_url,
      });
      toast.success("Submission created successfully");
      resetForm();
      onClose();
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 403) {
        toast.error(
          "Connect your YouTube account in Settings before submitting.",
        );
      } else {
        toast.error(`Submission failed: ${getErrorMessage(err)}`);
      }
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
        Submit a YouTube video for{" "}
        <span className="text-foreground">{campaignName}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* YouTube URL */}
        <div>
          <label
            htmlFor="submit-youtube-url"
            className="mb-1.5 block text-sm text-foreground-secondary"
          >
            YouTube URL
          </label>
          <div className="relative">
            <Link
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground-muted"
              aria-hidden="true"
            />
            <input
              id="submit-youtube-url"
              type="url"
              {...register("youtube_url")}
              className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          {errors.youtube_url ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.youtube_url.message}
            </p>
          ) : null}
        </div>

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
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:opacity-50"
          >
            {isPending ? "Submitting\u2026" : "Submit"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
