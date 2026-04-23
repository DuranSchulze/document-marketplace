import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { DocumentUpdateSchema } from '@/lib/schemas'
import { prisma } from '@/db'
import { normalizeGoogleDriveFile } from '@/lib/google-drive'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const { id } = await params
  let body
  try {
    body = DocumentUpdateSchema.parse(await request.json())
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }
  const existing = await prisma.document.findUnique({ where: { id } })
  if (!existing) {
    return Response.json({ error: 'Document not found' }, { status: 404 })
  }

  const hasFileUpdate =
    body.driveFileId !== undefined ||
    body.driveFileUrl !== undefined ||
    body.driveFileName !== undefined

  const file = hasFileUpdate
    ? normalizeGoogleDriveFile({
        driveFileId: body.driveFileId ?? existing.driveFileId,
        driveFileUrl: body.driveFileUrl ?? existing.driveFileUrl,
        driveFileName: body.driveFileName ?? existing.driveFileName,
        fallbackFileName: body.title ?? existing.title,
      })
    : null

  if (file && (!file.driveFileId || !file.driveFileUrl || !file.driveFileName)) {
    return Response.json({ error: 'A valid Google Drive file ID or link is required' }, { status: 400 })
  }

  const doc = await prisma.document.update({
    where: { id },
    data: {
      ...body,
      ...(file ?? {}),
    },
  })
  return Response.json(doc)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const { id } = await params
  const existing = await prisma.document.findUnique({
    where: { id },
    select: { id: true, _count: { select: { orders: true } } },
  })
  if (!existing) {
    return Response.json({ error: 'Document not found' }, { status: 404 })
  }

  if (existing._count.orders > 0) {
    await prisma.document.update({ where: { id }, data: { isActive: false } })
    return Response.json({
      ok: true,
      deleted: false,
      deactivated: true,
      reason: 'has_orders',
    })
  }

  await prisma.document.delete({ where: { id } })
  return Response.json({ ok: true, deleted: true })
}
