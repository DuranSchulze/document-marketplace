import { AdminSidebar } from '@/components/AdminSidebar'
import { GoogleStatusBanner } from '@/components/GoogleStatusBanner'
import { IdleTimeoutWatcher } from '@/components/IdleTimeoutWatcher'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
