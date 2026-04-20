import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { prisma } from '@/db'

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { document: { select: { title: true, category: true } } },
  })
  return Response.json(orders)
}
