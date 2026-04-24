import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/db'
import { env } from '@/env'
import { createXenditSubscriptionSession } from '@/lib/xendit-recurring'
import { appendSubscriptionRecord } from '@/lib/sheets'
import { resolveXenditReturnBaseUrl } from '@/lib/xendit-return-url'

const BodySchema = z.object({
  planId: z.string().min(1),
  subscriberName: z.string().min(1),
  subscriberEmail: z.string().email(),
  subscriberPhone: z.string().min(1),
  subscriberAddress: z.string().optional(),
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

  if (plan.durationMonths % plan.intervalCount !== 0) {
    return Response.json(
      { error: 'Plan duration must be divisible by its billing interval' },
      { status: 400 },
    )
  }

  const subscriptionId = crypto.randomUUID()
  const baseUrl = resolveXenditReturnBaseUrl({ serverUrl: env.SERVER_URL, requestUrl: request.url })
  if (!baseUrl) {
    console.error('[subscription-create] Invalid Xendit return URL configuration', {
      planId: body.planId,
      subscriptionId,
      serverUrl: env.SERVER_URL,
      requestOrigin: new URL(request.url).origin,
    })
    return Response.json(
      { error: 'Subscription checkout requires SERVER_URL to be a public HTTPS URL' },
      { status: 500 },
    )
  }
  const totalRecurrence = plan.durationMonths / plan.intervalCount

  let session: Awaited<ReturnType<typeof createXenditSubscriptionSession>>
  try {
    session = await createXenditSubscriptionSession({
      referenceId: subscriptionId,
      subscriberName: body.subscriberName,
      subscriberEmail: body.subscriberEmail,
      subscriberPhone: body.subscriberPhone,
      amount: plan.amount,
      intervalCount: plan.intervalCount,
      totalRecurrence,
      description: `${plan.name} - PHP ${plan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })} every ${plan.intervalCount} month${plan.intervalCount > 1 ? 's' : ''} for ${plan.durationMonths} month${plan.durationMonths > 1 ? 's' : ''}`,
      successReturnUrl: `${baseUrl}/subscribe/success?subscriptionId=${subscriptionId}`,
      cancelReturnUrl: `${baseUrl}/subscribe/${body.planId}?cancelled=1`,
    })
  } catch (err) {
    console.error('[subscription-create] Xendit subscription session failed', {
      planId: body.planId,
      subscriptionId,
      error: err instanceof Error ? err.message : err,
    })
    return Response.json({ error: 'Unable to start subscription checkout' }, { status: 502 })
  }

  // Save before redirect so webhooks can resolve this subscription by reference/session ID.
  await prisma.subscription.create({
    data: {
      id: subscriptionId,
      planId: body.planId,
      nomineeName: body.subscriberName,
      nomineeEmail: body.subscriberEmail,
      nomineePhone: body.subscriberPhone,
      nomineeAddress: body.subscriberAddress,
      paymentChannel: 'XENDIT_HOSTED_CHECKOUT',
      xenditPaymentSessionId: session.id,
      authUrl: session.paymentLinkUrl,
      status: 'pending',
    },
  })

  // Audit log: record every enrollment attempt (even those that never finish auth)
  const sheetsResult = await appendSubscriptionRecord({
    subscriptionId,
    planName: plan.name,
    nomineeName: body.subscriberName,
    nomineeEmail: body.subscriberEmail,
    nomineePhone: body.subscriberPhone,
    nomineeAddress: body.subscriberAddress ?? '',
    paymentChannel: 'Xendit Hosted Checkout',
    amount: plan.amount,
    status: 'pending',
    event: 'created',
    recordedAt: new Date().toISOString(),
    xenditCustomerId: '',
    xenditPaymentMethodId: '',
    xenditSubscriptionId: '',
  })
  if (sheetsResult.ok && sheetsResult.appended) {
    console.info('[subscription-create] Subscription record appended to Sheets', {
      subscriptionId,
      key: sheetsResult.key,
    })
  } else if (sheetsResult.ok && sheetsResult.skipped) {
    console.info('[subscription-create] Subscription Sheets append skipped', {
      subscriptionId,
      key: sheetsResult.key,
      reason: sheetsResult.reason,
    })
  } else {
    console.error('[subscription-create] Subscription Sheets append failed', {
      subscriptionId,
      key: sheetsResult.key,
      error: sheetsResult.error,
    })
  }

  return Response.json({ paymentUrl: session.paymentLinkUrl, authUrl: session.paymentLinkUrl, subscriptionId })
}
