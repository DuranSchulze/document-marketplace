import { AdminSidebar } from '@/components/AdminSidebar'
import { GoogleStatusBanner } from '@/components/GoogleStatusBanner'
import { IdleTimeoutWatcher } from '@/components/IdleTimeoutWatcher'
import { requireAdminPage } from '@/lib/admin-guard'

// Force dynamic so the auth check runs on every request — never cached.
export const dynamic = 'force-dynamic'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SECURITY: This is the real auth gate. middleware.ts only does a cheap
  // cookie-presence pre-filter. This call:
  //   1. Validates the session cookie against the DB
  //   2. Verifies user.role === "admin"
  //   3. Redirects to /admin/login on failure
  // Forged cookies and non-admin users never see the admin shell.
  await requireAdminPage()

  return (
    <div className="flex min-h-screen bg-[var(--foam)]">
      <IdleTimeoutWatcher />
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        <GoogleStatusBanner />
        {children}
      </main>
    </div>
  )
}
