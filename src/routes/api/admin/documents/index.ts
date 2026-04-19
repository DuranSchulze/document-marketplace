import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '#/lib/admin-guard'
import { DocumentCreateSchema } from '#/lib/schemas'
import { prisma } from '#/db'

export const Route = createFileRoute('/api/admin/documents/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireAdmin(request)
        const docs = await prisma.document.findMany({
          orderBy: { createdAt: 'desc' },
        })
        return Response.json(docs)
      },
      POST: async ({ request }) => {
        await requireAdmin(request)
        let body
        try {
          body = DocumentCreateSchema.parse(await request.json())
        } catch {
          return Response.json({ error: 'Invalid body' }, { status: 400 })
        }
        const doc = await prisma.document.create({ data: body })
        return Response.json(doc, { status: 201 })
      },
    },
  },
})
