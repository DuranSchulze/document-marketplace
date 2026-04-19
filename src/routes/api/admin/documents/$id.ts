import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '#/lib/admin-guard'
import { DocumentUpdateSchema } from '#/lib/schemas'
import { prisma } from '#/db'

export const Route = createFileRoute('/api/admin/documents/$id')({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        await requireAdmin(request)
        let body
        try {
          body = DocumentUpdateSchema.parse(await request.json())
        } catch {
          return Response.json({ error: 'Invalid body' }, { status: 400 })
        }
        const doc = await prisma.document.update({
          where: { id: params.id },
          data: body,
        })
        return Response.json(doc)
      },
      DELETE: async ({ request, params }) => {
        await requireAdmin(request)
        await prisma.document.update({
          where: { id: params.id },
          data: { isActive: false },
        })
        return Response.json({ ok: true })
      },
    },
  },
})
