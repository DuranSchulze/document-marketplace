import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useEffect } from 'react'
import { authClient } from '#/lib/auth-client'
import { AdminSidebar } from '#/components/AdminSidebar'

const checkAdminSession = createServerFn().handler(async () => {
  const { auth } = await import('#/lib/auth')
  const req = getRequest()
  const session = await auth.api.getSession({ headers: req.headers })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') {
    throw redirect({ to: '/admin/login' })
  }
  return null
})

export const Route = createFileRoute('/_admin')({
  beforeLoad: () => checkAdminSession(),
  component: AdminLayout,
})

function AdminLayout() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return
    const role = (session?.user as { role?: string } | undefined)?.role
    if (!session || role !== 'admin') {
      navigate({ to: '/admin/login' })
    }
  }, [session, isPending, navigate])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--foam)]">
        <div className="text-[var(--sea-ink-soft)] text-sm">Loading…</div>
      </div>
    )
  }

  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-[var(--foam)]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
