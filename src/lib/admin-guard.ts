import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth, getAdminFromSession, type AdminUser } from '@/lib/auth'

/**
 * For API route handlers — returns a 401/403 Response when the caller is not
 * an authenticated admin, or `null` when access is granted.
 *
 * Usage:
 *   const unauthorized = await requireAdminApi(request)
 *   if (unauthorized) return unauthorized
 */
export async function requireAdminApi(request: Request): Promise<Response | null> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = await getAdminFromSession(session)
  if (!admin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

/**
 * For server components / layouts — verifies the caller is an authenticated
 * admin. Redirects to /admin/login if not. Returns the admin user otherwise,
 * so callers can render personalized content.
 *
 * Usage (in an async server component):
 *   const admin = await requireAdminPage()
 *
 * Note: this MUST be called before any client component renders. Do not rely
 * on `middleware.ts` cookie-presence checks alone — those don't verify the
 * cookie is real or that the user actually has the admin role.
 */
export async function requireAdminPage(): Promise<AdminUser> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/admin/login?reason=expired')
  }

  const admin = await getAdminFromSession(session)
  if (!admin) {
    // Authenticated but not an admin. Sign them out at the next request by
    // sending them to login with a clear reason. The session cookie remains,
    // but the role check will keep failing — they cannot reach /admin/*.
    redirect('/admin/login?reason=forbidden')
  }

  return admin
}

/**
 * Read-only variant for server components that want to render different
 * content based on auth state without forcing a redirect.
 */
export async function getAdminOrNull(): Promise<AdminUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return getAdminFromSession(session)
}
