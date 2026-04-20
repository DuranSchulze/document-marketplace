import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { prisma } from '@/db'

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: 'desc' },
    include: { plan: { select: { name: true, amount: true } } },
  })
  return Response.json(subscriptions)
}
