import { type NextRequest } from 'next/server'
import { verifyXenditWebhookToken } from '@/lib/xendit'
import { prisma } from '@/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const callbackToken = request.headers.get('x-callback-token') ?? ''
  if (!verifyXenditWebhookToken(callbackToken)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let payload: { event?: string; data?: { reference_id?: string; status?: string; id?: string } }
  try {
    payload = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const event = payload.event ?? ''
  const data = payload.data ?? {}
  const referenceId = data.reference_id
  const xenditId = data.id

  if (event === 'recurring.plan.activated' || event === 'recurring.plan.payment.succeeded') {
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
    if (referenceId) {
      await prisma.subscription.updateMany({
        where: { id: referenceId },
        data: { status: event.includes('deactivated') ? 'cancelled' : 'failed' },
      })
    }
  } else if (event === 'recurring.plan.created' && xenditId) {
    await prisma.subscription.updateMany({
      where: { xenditSubscriptionId: xenditId },
      data: { status: 'pending' },
    })
  }

  return new Response('OK', { status: 200 })
}
