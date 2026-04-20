import { createFileRoute } from '@tanstack/react-router'
import { requireAdminApi } from '#/lib/admin-guard'
import { DocumentCreateSchema } from '#/lib/schemas'
import { prisma } from '#/db'

export const Route = createFileRoute('/api/admin/documents/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await requireAdminApi(request)
        if (unauthorized) return unauthorized
        const docs = await prisma.document.findMany({
          orderBy: { createdAt: 'desc' },
        })
        return Response.json(docs)
      },
      POST: async ({ request }) => {
        const unauthorized = await requireAdminApi(request)
        if (unauthorized) return unauthorized
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
