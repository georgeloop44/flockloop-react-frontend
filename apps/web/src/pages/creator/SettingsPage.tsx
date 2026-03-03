import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useYouTubeStatus,
  useYouTubeAuthorize,
  useYouTubeDisconnect,
  getErrorMessage,
} from "@flockloop/api-client";
import { toast } from "sonner";
import { Youtube } from "lucide-react";

function YouTubeConnectionCard() {
  const { data: ytStatus } = useYouTubeStatus();
  const authorize = useYouTubeAuthorize();
  const disconnect = useYouTubeDisconnect();

  const handleConnect = async () => {
    try {
      const { authorize_url } = await authorize.mutateAsync();
      window.location.href = authorize_url;
    } catch (err) {
      toast.error(
        `Failed to start YouTube connection: ${getErrorMessage(err)}`,
      );
    }
  };

  const handleDisconnect = () => {
    disconnect.mutate(undefined, {
      onSuccess: () => toast.success("YouTube account disconnected"),
      onError: (err) =>
        toast.error(`Failed to disconnect: ${getErrorMessage(err)}`),
    });
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
          <Youtube className="h-5 w-5 text-foreground-muted" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">
            YouTube Account
          </h3>
          <p className="text-xs text-foreground-muted">
            {ytStatus.connected
              ? "Connected"
              : "Connect to submit content to campaigns"}
          </p>
        </div>
      </div>

      {ytStatus.connected ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-surface-elevated px-4 py-3">
            <p className="text-sm font-medium text-foreground">
              {ytStatus.channel_title}
            </p>
            {ytStatus.connected_at ? (
              <p className="mt-0.5 text-xs text-foreground-muted">
                Connected{" "}
                {new Date(ytStatus.connected_at).toLocaleDateString()}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={disconnect.isPending}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:border-destructive hover:text-destructive focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
          >
            {disconnect.isPending ? "Disconnecting\u2026" : "Disconnect"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          disabled={authorize.isPending}
          className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:opacity-50"
        >
          <Youtube className="h-4 w-4" aria-hidden="true" />
          {authorize.isPending ? "Connecting\u2026" : "Connect YouTube"}
        </button>
      )}
    </div>
  );
}

function SettingsContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    const result = searchParams.get("youtube");
    if (result === "success") {
      calledRef.current = true;
      toast.success("YouTube account connected successfully");
      setSearchParams({}, { replace: true });
    } else if (result === "error") {
      calledRef.current = true;
      const reason = searchParams.get("reason");
      toast.error(
        reason
          ? `Failed to connect YouTube: ${reason.replaceAll("_", " ")}`
          : "Failed to connect YouTube account. Please try again.",
      );
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="space-y-6">
      <YouTubeConnectionCard />
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-xl bg-surface" />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
