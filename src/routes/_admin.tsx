import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { AdminSidebar } from "#/components/AdminSidebar";
import { GoogleStatusBanner } from "#/components/GoogleStatusBanner";
import { IdleTimeoutWatcher } from "#/components/IdleTimeoutWatcher";

const checkAdminSession = createServerFn().handler(async () => {
  const { auth } = await import("#/lib/auth");
  const req = getRequest();
  const session = await auth.api.getSession({ headers: req.headers });
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "admin") {
    throw redirect({ to: "/admin/login" });
  }
  return null;
});

export const Route = createFileRoute("/_admin")({
  beforeLoad: () => checkAdminSession(),
  component: AdminLayout,
});

function AdminLayout() {
  // Auth is enforced server-side in `beforeLoad` above — the route will
  // never render unless the caller is an admin. No client-side recheck
  // needed; that only introduced a loading flash.
  return (
    <div className="flex min-h-screen bg-[var(--foam)]">
      <IdleTimeoutWatcher />
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        <GoogleStatusBanner />
        <Outlet />
      </main>
    </div>
  );
}
