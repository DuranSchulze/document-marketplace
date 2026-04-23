import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <div>
          <p className="island-kicker mb-1">Admin</p>
          <h1 className="admin-text text-2xl font-bold">Dashboard</h1>
        </div>
      </div>

      <div className="admin-panel rounded-2xl p-8">
        <p className="admin-text text-lg font-semibold">Dashboard coming soon</p>
        <p className="admin-muted mt-2 max-w-2xl text-sm">
          This page will become the admin overview. For now, use the shortcuts below to manage documents, orders, and subscriptions.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Link href="/admin/documents" className="admin-panel rounded-xl p-4 no-underline">
            <p className="admin-text text-sm font-semibold">Documents</p>
            <p className="admin-muted mt-1 text-xs">Manage document listings.</p>
          </Link>
          <Link href="/admin/orders" className="admin-panel rounded-xl p-4 no-underline">
            <p className="admin-text text-sm font-semibold">Orders</p>
            <p className="admin-muted mt-1 text-xs">Review purchases and downloads.</p>
          </Link>
          <Link href="/admin/subscriptions" className="admin-panel rounded-xl p-4 no-underline">
            <p className="admin-text text-sm font-semibold">Subscriptions</p>
            <p className="admin-muted mt-1 text-xs">Manage plans and enrollments.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
