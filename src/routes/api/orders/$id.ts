import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'

// Public endpoint — returns only non-sensitive order fields needed for the success page
export const Route = createFileRoute('/api/orders/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const order = await prisma.order.findUnique({ where: { id: params.id } })
        if (!order) return Response.json({ error: 'Not found' }, { status: 404 })

        return Response.json({
          id: order.id,
          status: order.status,
          downloadUrl: order.status === 'paid' ? order.downloadUrl : null,
          documentTitle: order.documentTitle,
        })
      },
    },
  },
})
