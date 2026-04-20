import { redirect } from '@tanstack/react-router'
import { auth } from '#/lib/auth'

/**
 * For route loaders/server functions — throws a redirect to /admin/login
 * when the caller is not an authenticated admin.
 */
export async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') {
    throw redirect({ to: '/admin/login' })
  }
  return session
}

/**
 * For API handlers — returns a 401 JSON Response when the caller is not
 * an authenticated admin, or `null` when access is granted.
 *
 * Usage:
 *   const unauthorized = await requireAdminApi(request)
 *   if (unauthorized) return unauthorized
 */
export async function requireAdminApi(request: Request): Promise<Response | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
