import { type NextRequest } from 'next/server'
import { verifyXenditWebhookToken } from '@/lib/xendit'
import { finalizePaidOrder } from '@/lib/order-finalize'
import { prisma } from '@/db'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const callbackToken = request.headers.get('x-callback-token') ?? ''
  if (!verifyXenditWebhookToken(callbackToken)) {
    console.warn('[payment-webhook] Unauthorized callback received')
    return new Response('Unauthorized', { status: 401 })
  }

  let payload: { external_id: string; status: string; id: string }
  try {
    payload = await request.json()
  } catch {
    console.warn('[payment-webhook] Invalid JSON payload received')
    return new Response('Invalid JSON', { status: 400 })
  }

  const { status, id: xenditInvoiceId, external_id: xenditExternalId } = payload

  console.info('[payment-webhook] Event received', {
    status,
    xenditInvoiceId,
    xenditExternalId,
  })

  if (status === 'PAID') {
    const order = await prisma.order.findFirst({
      where: { xenditInvoiceId },
      select: { id: true },
    })
    if (!order) {
      console.error('[payment-webhook] Order not found for paid invoice', {
        xenditInvoiceId,
        xenditExternalId,
      })
      return new Response('Order not found', { status: 404 })
    }

    const baseUrl = env.SERVER_URL ?? new URL(request.url).origin
    try {
      await finalizePaidOrder({
        orderId: order.id,
        baseUrl,
        xenditInvoiceId,
        xenditExternalId,
        source: 'webhook',
      })
    } catch (error) {
      console.error('[payment-webhook] finalizePaidOrder failed', {
        orderId: order.id,
        xenditInvoiceId,
        error,
      })
      return new Response('Internal error', { status: 500 })
    }
  } else if (status === 'EXPIRED' || status === 'FAILED') {
    await prisma.order.updateMany({
      where: { xenditInvoiceId },
      data: { status: 'failed' },
    })

    console.info('[payment-webhook] Order marked as failed', {
      status,
      xenditInvoiceId,
      xenditExternalId,
    })
  } else {
    console.info('[payment-webhook] Event ignored', {
      status,
      xenditInvoiceId,
      xenditExternalId,
    })
  }

  return new Response('OK', { status: 200 })
}
