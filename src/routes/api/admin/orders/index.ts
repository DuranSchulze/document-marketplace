import { createFileRoute } from '@tanstack/react-router'
import { requireAdminApi } from '#/lib/admin-guard'
import { prisma } from '#/db'

export const Route = createFileRoute('/api/admin/orders/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await requireAdminApi(request)
        if (unauthorized) return unauthorized
        const orders = await prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          include: { document: { select: { title: true, category: true } } },
        })
        return Response.json(orders)
      },
    },
  },
})
