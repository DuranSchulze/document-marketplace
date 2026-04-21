import { type NextRequest } from 'next/server'
import { verifyXenditWebhookToken } from '@/lib/xendit'
import { prisma } from '@/db'
import { env } from '@/env'
import { createXenditRecurringPlan } from '@/lib/xendit-recurring'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const callbackToken = request.headers.get('x-callback-token') ?? ''
  if (!verifyXenditWebhookToken(callbackToken)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let payload: {
    event?: string
    data?: {
      id?: string
      customer_id?: string
      reference_id?: string
      status?: string
    }
  }
  try {
    payload = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const event = payload.event ?? ''
  const data = payload.data ?? {}

  // Payment method authorized by user — now we can create the recurring plan
  if (event === 'payment_method.activated') {
    const paymentMethodId = data.id
    if (!paymentMethodId) return new Response('OK', { status: 200 })

    const subscription = await prisma.subscription.findUnique({
      where: { xenditPaymentMethodId: paymentMethodId },
      include: { plan: true },
    })
    if (!subscription || !subscription.xenditCustomerId) return new Response('OK', { status: 200 })

    const baseUrl = env.SERVER_URL ?? 'https://localhost:3000'

    try {
      const plan = await createXenditRecurringPlan({
        referenceId: subscription.id,
        customerId: subscription.xenditCustomerId,
        paymentMethodId,
        amount: subscription.plan.amount,
        intervalCount: subscription.plan.intervalCount,
        description: `${subscription.plan.name} — ₱${subscription.plan.amount}/month`,
        successReturnUrl: `${baseUrl}/nominees/success?subscriptionId=${subscription.id}`,
        failureReturnUrl: `${baseUrl}/nominees/failed?subscriptionId=${subscription.id}`,
      })

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { xenditSubscriptionId: plan.id, status: 'active', activatedAt: new Date() },
      })
    } catch (err) {
      console.error('Failed to create recurring plan after payment_method.activated:', err)
    }

    return new Response('OK', { status: 200 })
  }

  if (event === 'recurring.plan.activated' || event === 'recurring.plan.payment.succeeded') {
    const referenceId = data.reference_id
    if (referenceId) {
      await prisma.subscription.updateMany({
        where: { id: referenceId },
        data: { status: 'active', activatedAt: new Date() },
      })
    }
  } else if (
    event === 'recurring.plan.deactivated' ||
    event === 'recurring.plan.payment.failed'
  ) {
    const referenceId = data.reference_id
    if (referenceId) {
      await prisma.subscription.updateMany({
        where: { id: referenceId },
        data: { status: event.includes('deactivated') ? 'cancelled' : 'failed' },
      })
    }
  }

  return new Response('OK', { status: 200 })
}
