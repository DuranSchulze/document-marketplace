import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { prisma } from '@/db'
import { z } from 'zod'

const PlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().positive(),
  intervalCount: z.number().int().positive().default(1),
})

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const plans = await prisma.subscriptionPlan.findMany({ orderBy: { createdAt: 'desc' } })
  return Response.json(plans)
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  let body
  try {
    body = PlanSchema.parse(await request.json())
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }
  const plan = await prisma.subscriptionPlan.create({ data: body })
  return Response.json(plan, { status: 201 })
}
