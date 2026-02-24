import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister, useRegisterOrg } from "@flockloop/api-client";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  org_name: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [mode, setMode] = useState<"creator" | "organisation">("creator");
  const [success, setSuccess] = useState(false);

  const registerCreator = useRegister();
  const registerOrg = useRegisterOrg();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const isPending = registerCreator.isPending || registerOrg.isPending;

  const onSubmit = (data: RegisterForm) => {
    const callbacks = {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Registration failed");
      },
    };

    if (mode === "organisation") {
      if (!data.org_name || data.org_name.length < 2) {
        setError("org_name", { message: "Organisation name is required" });
        return;
      }
      registerOrg.mutate(
        { email: data.email, name: data.name, password: data.password, org_name: data.org_name },
        callbacks,
      );
    } else {
      registerCreator.mutate(
        { email: data.email, name: data.name, password: data.password },
        callbacks,
      );
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-foreground">Check Your Email</h2>
        <p className="text-sm text-foreground-muted">
          We&apos;ve sent a confirmation link to your email. Please click it to verify your account.
        </p>
        <Link
          to="/login"
          className="inline-block text-sm text-primary hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground" style={{ textWrap: "balance" }}>
        Create Account
      </h2>

      {/* Mode toggle */}
      <div className="flex gap-2 rounded-lg bg-surface p-1">
        <button
          type="button"
          onClick={() => { setMode("creator"); reset(); }}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
            mode === "creator"
              ? "bg-surface-elevated text-foreground"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          Creator
        </button>
        <button
          type="button"
          onClick={() => { setMode("organisation"); reset(); }}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
            mode === "organisation"
              ? "bg-surface-elevated text-foreground"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          Organisation
        </button>
      </div>

      {mode === "organisation" ? (
        <div>
          <label htmlFor="org_name" className="mb-1.5 block text-sm text-foreground-secondary">
            Organisation Name
          </label>
          <input
            id="org_name"
            type="text"
            autoComplete="organization"
            {...register("org_name")}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            placeholder="Your company name"
          />
          {errors.org_name ? (
            <p className="mt-1 text-xs text-destructive">{errors.org_name.message}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-foreground-secondary">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          placeholder="John Doe"
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="reg-email" className="mb-1.5 block text-sm text-foreground-secondary">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="reg-password" className="mb-1.5 block text-sm text-foreground-secondary">
          Password
        </label>
        <input
          id="reg-password"
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
        disabled={isPending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-50"
      >
        {isPending ? "Creating account\u2026" : "Create Account"}
      </button>

      <p className="text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
