import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '#/lib/admin-guard'
import { prisma } from '#/db'

export const Route = createFileRoute('/api/admin/orders/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireAdmin(request)
        const orders = await prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          include: { document: { select: { title: true, category: true } } },
        })
        return Response.json(orders)
      },
    },
  },
})
