import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, getErrorMessage } from "@flockloop/api-client";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data, {
      onSuccess: ({ user }) => {
        const from =
          (location.state as { from?: { pathname: string } })?.from
            ?.pathname ??
          (user.type === "content_creator" ? "/discover" : "/overview");
        navigate(from, { replace: true });
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground" style={{ textWrap: "balance" }}>
        Sign In
      </h2>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-foreground-secondary">
          Email
        </label>
        <input
          id="email"
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
        <label htmlFor="password" className="mb-1.5 block text-sm text-foreground-secondary">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          placeholder="Enter your password"
        />
        {errors.password ? (
          <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-50"
      >
        {login.isPending ? "Signing in\u2026" : "Sign In"}
      </button>

      <p className="text-center text-sm text-foreground-muted">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
