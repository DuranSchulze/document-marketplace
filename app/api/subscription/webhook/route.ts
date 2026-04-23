import { type NextRequest } from 'next/server'
import { verifyXenditWebhookToken } from '@/lib/xendit'
import { prisma } from '@/db'
import { env } from '@/env'
import { createXenditRecurringPlan } from '@/lib/xendit-recurring'
import { appendSubscriptionRecord } from '@/lib/sheets'

async function logSubscriptionEvent(subscriptionId: string, status: string, event: string) {
  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { plan: true },
  })
  if (!sub) return
  const sheetsResult = await appendSubscriptionRecord({
    subscriptionId: sub.id,
    planName: sub.plan.name,
    nomineeName: sub.nomineeName,
    nomineeEmail: sub.nomineeEmail,
    nomineePhone: sub.nomineePhone,
    nomineeAddress: sub.nomineeAddress ?? '',
    paymentChannel: sub.paymentChannel ?? '',
    amount: sub.plan.amount,
    status,
    event,
    recordedAt: new Date().toISOString(),
    xenditCustomerId: sub.xenditCustomerId ?? '',
    xenditPaymentMethodId: sub.xenditPaymentMethodId ?? '',
    xenditSubscriptionId: sub.xenditSubscriptionId ?? '',
  })
  if (sheetsResult.ok && sheetsResult.appended) {
    console.info('[subscription-webhook] Subscription event appended to Sheets', {
      subscriptionId: sub.id,
      event,
      key: sheetsResult.key,
    })
  } else if (sheetsResult.ok && sheetsResult.skipped) {
    console.info('[subscription-webhook] Subscription Sheets append skipped', {
      subscriptionId: sub.id,
      event,
      key: sheetsResult.key,
      reason: sheetsResult.reason,
    })
  } else {
    console.error('[subscription-webhook] Subscription Sheets append failed', {
      subscriptionId: sub.id,
      event,
      key: sheetsResult.key,
      error: sheetsResult.error,
    })
  }
}

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
      payment_session_id?: string
      payment_token_id?: string
      recurring_plan_id?: string
      reference_id?: string
      status?: string
      metadata?: {
        subscriptionId?: string
      }
    }
  }
  try {
    payload = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const event = payload.event ?? ''
  const data = payload.data ?? {}

  async function findSubscriptionId() {
    if (data.reference_id) {
      const byReference = await prisma.subscription.findUnique({ where: { id: data.reference_id } })
      if (byReference) return byReference.id
    }

    if (data.metadata?.subscriptionId) {
      const byMetadata = await prisma.subscription.findUnique({ where: { id: data.metadata.subscriptionId } })
      if (byMetadata) return byMetadata.id
    }

    if (data.payment_session_id) {
      const bySession = await prisma.subscription.findFirst({
        where: { xenditPaymentSessionId: data.payment_session_id },
      })
      if (bySession) return bySession.id
    }

    if (data.id && event.startsWith('payment_session.')) {
      const bySession = await prisma.subscription.findFirst({
        where: { xenditPaymentSessionId: data.id },
      })
      if (bySession) return bySession.id
    }

    if (data.payment_token_id) {
      const byToken = await prisma.subscription.findFirst({
        where: { xenditPaymentTokenId: data.payment_token_id },
        select: { id: true },
      })
      if (byToken) return byToken.id
    }

    if (data.recurring_plan_id || data.id) {
      const byPlan = await prisma.subscription.findFirst({
        where: { xenditSubscriptionId: data.recurring_plan_id ?? data.id },
        select: { id: true },
      })
      if (byPlan) return byPlan.id
    }

    return null
  }

  if (event === 'payment_session.completed') {
    const subscriptionId = await findSubscriptionId()
    if (subscriptionId) {
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'pending_activation',
          xenditPaymentSessionId: data.id,
          xenditCustomerId: data.customer_id,
        },
      })
      await logSubscriptionEvent(subscriptionId, 'pending_activation', 'payment_session_completed')
    }
    return new Response('OK', { status: 200 })
  }

  if (event === 'payment_token.activation') {
    const subscriptionId = await findSubscriptionId()
    if (subscriptionId) {
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'pending_activation',
          xenditPaymentTokenId: data.id ?? data.payment_token_id,
          xenditCustomerId: data.customer_id,
        },
      })
      await logSubscriptionEvent(subscriptionId, 'pending_activation', 'payment_token_activated')
    }
    return new Response('OK', { status: 200 })
  }

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
        totalRecurrence: subscription.plan.durationMonths / subscription.plan.intervalCount,
        description: `${subscription.plan.name} — ₱${subscription.plan.amount}/month`,
        successReturnUrl: `${baseUrl}/subscribe/success?subscriptionId=${subscription.id}`,
        failureReturnUrl: `${baseUrl}/subscribe/${subscription.planId}?failed=1`,
      })

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { xenditSubscriptionId: plan.id, status: 'active', activatedAt: new Date() },
      })

      await logSubscriptionEvent(subscription.id, 'active', 'payment_method_activated')
    } catch (err) {
      console.error('Failed to create recurring plan after payment_method.activated:', err)
      await logSubscriptionEvent(subscription.id, 'failed', 'recurring_plan_create_failed')
    }

    return new Response('OK', { status: 200 })
  }

  if (
    event === 'recurring.plan.activated' ||
    event === 'recurring_plan.activated' ||
    event === 'recurring.plan.payment.succeeded' ||
    event === 'recurring.cycle.succeeded' ||
    event === 'recurring_cycle.succeeded' ||
    event === 'payment.succeeded'
  ) {
    const referenceId = await findSubscriptionId()
    if (referenceId) {
      await prisma.subscription.update({
        where: { id: referenceId },
        data: {
          status: 'active',
          activatedAt: new Date(),
          ...(event.includes('activated') ? { xenditSubscriptionId: data.recurring_plan_id ?? data.id } : {}),
        },
      })
      await logSubscriptionEvent(
        referenceId,
        'active',
        event.includes('activated') ? 'plan_activated' : 'payment_succeeded',
      )
    }
  } else if (
    event === 'recurring.plan.deactivated' ||
    event === 'recurring_plan.deactivated' ||
    event === 'recurring.plan.payment.failed' ||
    event === 'recurring.cycle.failed' ||
    event === 'recurring_cycle.failed' ||
    event === 'payment.failed' ||
    event === 'payment.failure'
  ) {
    const referenceId = await findSubscriptionId()
    if (referenceId) {
      const newStatus = event.includes('deactivated') ? 'cancelled' : 'failed'
      await prisma.subscription.update({
        where: { id: referenceId },
        data: { status: newStatus },
      })
      await logSubscriptionEvent(
        referenceId,
        newStatus,
        event.includes('deactivated') ? 'plan_deactivated' : 'payment_failed',
      )
    }
  } else if (event === 'recurring.cycle.retrying' || event === 'recurring_cycle.retrying') {
    const referenceId = await findSubscriptionId()
    if (referenceId) {
      await prisma.subscription.update({
        where: { id: referenceId },
        data: { status: 'retrying' },
      })
      await logSubscriptionEvent(referenceId, 'retrying', 'payment_retrying')
    }
  }

  return new Response('OK', { status: 200 })
}
