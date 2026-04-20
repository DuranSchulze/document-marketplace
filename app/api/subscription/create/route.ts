import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/db'
import { env } from '@/env'
import { createXenditRecurringPlan, getCheckoutUrl } from '@/lib/xendit-recurring'

const BodySchema = z.object({
  planId: z.string().min(1),
  nomineeName: z.string().min(1),
  nomineeEmail: z.string().email(),
  nomineePhone: z.string().min(1),
  nomineeAddress: z.string().optional(),
})

export async function POST(request: NextRequest) {
  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(await request.json())
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: body.planId } })
  if (!plan || !plan.isActive) {
    return Response.json({ error: 'Plan not found' }, { status: 404 })
  }

  const subscriptionId = crypto.randomUUID()
  const baseUrl = env.SERVER_URL ?? new URL(request.url).origin

  const xenditPlan = await createXenditRecurringPlan({
    referenceId: subscriptionId,
    amount: plan.amount,
    intervalCount: plan.intervalCount,
    description: `${plan.name} — ₱${plan.amount}/month`,
    customerName: body.nomineeName,
    customerEmail: body.nomineeEmail,
    customerPhone: body.nomineePhone,
    successReturnUrl: `${baseUrl}/nominees/success?subscriptionId=${subscriptionId}`,
    failureReturnUrl: `${baseUrl}/nominees/failed?subscriptionId=${subscriptionId}`,
  })

  const checkoutUrl = getCheckoutUrl(xenditPlan)

  await prisma.subscription.create({
    data: {
      id: subscriptionId,
      planId: body.planId,
      nomineeName: body.nomineeName,
      nomineeEmail: body.nomineeEmail,
      nomineePhone: body.nomineePhone,
      nomineeAddress: body.nomineeAddress,
      xenditSubscriptionId: xenditPlan.id,
      checkoutUrl,
      status: 'pending',
    },
  })

  return Response.json({ checkoutUrl, subscriptionId })
}
