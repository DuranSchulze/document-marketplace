import { auth } from '@/lib/auth'

/**
 * For API route handlers — returns a 401/403 Response when the caller is
 * not an authenticated admin, or `null` when access is granted.
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
