import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { prisma } from '@/db'
import { z } from 'zod'

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  intervalCount: z.number().int().positive().optional(),
  durationMonths: z.number().int().positive().optional(),
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
  const existing = await prisma.subscriptionPlan.findUnique({
    where: { id },
    select: { intervalCount: true, durationMonths: true },
  })
  if (!existing) {
    return Response.json({ error: 'Plan not found' }, { status: 404 })
  }
  const intervalCount = body.intervalCount ?? existing.intervalCount
  const durationMonths = body.durationMonths ?? existing.durationMonths
  if (durationMonths % intervalCount !== 0) {
    return Response.json(
      { error: 'Duration must be divisible by the billing interval' },
      { status: 400 },
    )
  }
  const plan = await prisma.subscriptionPlan.update({ where: { id }, data: body })
  return Response.json(plan)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const { id } = await params
  const existing = await prisma.subscriptionPlan.findUnique({
    where: { id },
    select: { id: true, _count: { select: { subscriptions: true } } },
  })
  if (!existing) {
    return Response.json({ error: 'Plan not found' }, { status: 404 })
  }

  if (existing._count.subscriptions > 0) {
    await prisma.subscriptionPlan.update({ where: { id }, data: { isActive: false } })
    return Response.json({
      ok: true,
      deleted: false,
      deactivated: true,
      reason: 'has_subscriptions',
    })
  }

  await prisma.subscriptionPlan.delete({ where: { id } })
  return Response.json({ ok: true, deleted: true })
}
