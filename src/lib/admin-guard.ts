import { redirect } from '@tanstack/react-router'
import { auth } from '#/lib/auth'

export async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') {
    throw redirect({ to: '/admin/login' })
  }
  return session
}
