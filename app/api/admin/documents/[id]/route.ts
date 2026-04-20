import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { DocumentUpdateSchema } from '@/lib/schemas'
import { prisma } from '@/db'

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
  const doc = await prisma.document.update({ where: { id }, data: body })
  return Response.json(doc)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const { id } = await params
  await prisma.document.update({ where: { id }, data: { isActive: false } })
  return Response.json({ ok: true })
}
