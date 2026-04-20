import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { prisma } from '@/db'
import { z } from 'zod'

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  intervalCount: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const { id } = await params
  let body
  try {
    body = UpdateSchema.parse(await request.json())
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }
  const plan = await prisma.subscriptionPlan.update({ where: { id }, data: body })
  return Response.json(plan)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const { id } = await params
  await prisma.subscriptionPlan.update({ where: { id }, data: { isActive: false } })
  return Response.json({ ok: true })
}
