import { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useConfirmEmail } from "@flockloop/api-client";

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const confirmEmail = useConfirmEmail();
  const calledRef = useRef(false);

  useEffect(() => {
    if (token && !calledRef.current) {
      calledRef.current = true;
      confirmEmail.mutate(token);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-foreground">Invalid Link</h2>
        <p className="text-sm text-foreground-muted">
          This confirmation link is missing a token.
        </p>
        <Link to="/login" className="text-sm text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  if (confirmEmail.isPending) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-foreground">Confirming Your Email\u2026</h2>
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (confirmEmail.isError) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-destructive">Confirmation Failed</h2>
        <p className="text-sm text-foreground-muted">
          This link may have expired. Try requesting a new confirmation email.
        </p>
        <Link to="/login" className="text-sm text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-lg font-semibold text-accent">Email Confirmed</h2>
      <p className="text-sm text-foreground-muted">
        Your email has been verified. You can now sign in.
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
