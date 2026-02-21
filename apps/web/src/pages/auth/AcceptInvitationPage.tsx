import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, Link } from "react-router-dom";
import { useAcceptInvitation } from "@flockloop/api-client";
import { toast } from "sonner";

const invitationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type InvitationForm = z.infer<typeof invitationSchema>;

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const acceptInvitation = useAcceptInvitation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvitationForm>({
    resolver: zodResolver(invitationSchema),
  });

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-foreground">Invalid Invitation</h2>
        <p className="text-sm text-foreground-muted">
          This invitation link is missing a token.
        </p>
        <Link to="/login" className="text-sm text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-accent">Invitation Accepted</h2>
        <p className="text-sm text-foreground-muted">
          Your account has been created. You can now sign in.
        </p>
        <Link
          to="/login"
          className="inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const onSubmit = (data: InvitationForm) => {
    acceptInvitation.mutate(
      { token, ...data },
      {
        onSuccess: () => setSuccess(true),
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to accept invitation";
          toast.error(message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground" style={{ textWrap: "balance" }}>
        Accept Invitation
      </h2>
      <p className="text-sm text-foreground-muted">
        Set up your account to join the organisation.
      </p>

      <div>
        <label htmlFor="inv-name" className="mb-1.5 block text-sm text-foreground-secondary">
          Full Name
        </label>
        <input
          id="inv-name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          placeholder="Your name"
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="inv-password" className="mb-1.5 block text-sm text-foreground-secondary">
          Password
        </label>
        <input
          id="inv-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          placeholder="At least 8 characters"
        />
        {errors.password ? (
          <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={acceptInvitation.isPending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-50"
      >
        {acceptInvitation.isPending ? "Setting up\u2026" : "Accept & Create Account"}
      </button>
    </form>
  );
}
