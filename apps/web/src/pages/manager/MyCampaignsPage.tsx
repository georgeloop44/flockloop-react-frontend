import { Suspense, useState } from "react";
import { useCampaigns, useCreateCampaign, useTracks } from "@flockloop/api-client";
import type { CampaignRead } from "@flockloop/shared-types";
import { Plus, X, Inbox } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const createCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  track_id: z.string().min(1, "Select a track"),
});

type CreateCampaignForm = z.infer<typeof createCampaignSchema>;

function CampaignRow({ campaign }: { campaign: CampaignRead }) {
  const subsLeft =
    campaign.max_submissions !== undefined
      ? campaign.max_submissions - (campaign.submissions_count ?? 0)
      : null;

  return (
    <tr className="border-b border-border-subtle transition-colors hover:bg-surface-hover">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {campaign.track.thumbnail_url ? (
            <img
              src={campaign.track.thumbnail_url}
              alt=""
              className="h-8 w-8 rounded object-cover"
              width={32}
              height={32}
            />
          ) : (
            <div className="h-8 w-8 rounded bg-surface-elevated" />
          )}
          <span className="text-sm font-medium text-foreground">
            {campaign.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground-secondary">
        {campaign.track.title}
      </td>
      <td className="px-4 py-3 text-sm text-foreground-secondary">
        {campaign.track.artist}
      </td>
      <td className="px-4 py-3 text-sm tabular-nums text-foreground-secondary">
        {subsLeft !== null ? subsLeft : "\u2014"}
      </td>
    </tr>
  );
}

function CreateCampaignDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: tracks } = useTracks();
  const createCampaign = useCreateCampaign();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCampaignForm>({
    resolver: zodResolver(createCampaignSchema),
  });

  if (!open) return null;

  const onSubmit = (data: CreateCampaignForm) => {
    createCampaign.mutate(data, {
      onSuccess: () => {
        toast.success("Campaign created");
        reset();
        onClose();
      },
      onError: () => {
        toast.error("Failed to create campaign");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create campaign"
        className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Create Campaign
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="campaign-name"
              className="mb-1.5 block text-sm text-foreground-secondary"
            >
              Campaign Name
            </label>
            <input
              id="campaign-name"
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              placeholder="My New Campaign"
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="campaign-track"
              className="mb-1.5 block text-sm text-foreground-secondary"
            >
              Track
            </label>
            <select
              id="campaign-track"
              {...register("track_id")}
              className="w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <option value="">Select a track</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} \u2014 {track.artist}
                </option>
              ))}
            </select>
            {errors.track_id ? (
              <p className="mt-1 text-xs text-destructive">
                {errors.track_id.message}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCampaign.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:opacity-50"
            >
              {createCampaign.isPending ? "Creating\u2026" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MyCampaignsContent() {
  const { data: campaigns } = useCampaigns();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">My Campaigns</h2>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface py-16 text-center">
          <Inbox className="h-12 w-12 text-foreground-muted" aria-hidden="true" />
          <h3 className="mt-4 text-sm font-medium text-foreground">
            No campaigns yet
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">
            Create your first campaign to start reaching creators.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
                  Campaign
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
                  Track
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
                  Artist
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted">
                  Subs Left
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Suspense fallback={null}>
        <CreateCampaignDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </Suspense>
    </div>
  );
}

function CampaignsSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded bg-surface" />
        <div className="h-9 w-36 animate-pulse rounded-lg bg-surface" />
      </div>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded bg-surface" />
      ))}
    </div>
  );
}

export default function MyCampaignsPage() {
  return (
    <Suspense fallback={<CampaignsSkeleton />}>
      <MyCampaignsContent />
    </Suspense>
  );
}
