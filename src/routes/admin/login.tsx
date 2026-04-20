import {
  createFileRoute,
  redirect,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

type LoginSearch = { reason?: "idle" | "expired" };

const redirectIfAuthenticated = createServerFn().handler(async () => {
  const { auth } = await import("#/lib/auth");
  const req = getRequest();
  const session = await auth.api.getSession({ headers: req.headers });
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (session && role === "admin") {
    throw redirect({ to: "/admin/dashboard" });
  }
  return null;
});

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    reason:
      search.reason === "idle" || search.reason === "expired"
        ? search.reason
        : undefined,
  }),
  beforeLoad: () => redirectIfAuthenticated(),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { reason } = useSearch({ from: "/admin/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const notice =
    reason === "idle"
      ? "You were signed out due to inactivity. Please sign in again."
      : reason === "expired"
        ? "Your session expired. Please sign in again."
        : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message ?? "Invalid credentials");
      setIsLoading(false);
      return;
    }

    navigate({ to: "/admin/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--foam)] px-4">
      <div className="w-full max-w-md">
        <div className="island-shell rounded-2xl p-8">
          <div className="mb-8 text-center">
            <p className="island-kicker mb-2">Admin Portal</p>
            <h1 className="text-2xl font-bold text-[var(--sea-ink)]">
              Sign In
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[var(--sea-ink)]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[var(--sea-ink)]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

            {notice && !error && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                {notice}
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90"
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
