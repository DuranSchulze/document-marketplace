import { type NextRequest } from 'next/server'
import { finalizePaidOrder } from '@/lib/order-finalize'
import { prisma } from '@/db'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

// DEV-ONLY: simulates a Xendit "PAID" webhook for a given orderId.
// Blocked in production.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  let orderId = searchParams.get('orderId') ?? ''
  if (!orderId) {
    try {
      const body = (await request.json()) as { orderId?: string }
      orderId = body.orderId ?? ''
    } catch {
      /* ignore */
    }
  }

  if (!orderId) {
    return Response.json({ error: 'orderId required' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 })

  const baseUrl = env.SERVER_URL ?? new URL(request.url).origin

  try {
    const result = await finalizePaidOrder({
      orderId: order.id,
      baseUrl,
      xenditInvoiceId: order.xenditInvoiceId ?? 'dev-simulated',
      xenditExternalId: order.id,
      source: 'dev-simulate',
    })
    return Response.json(result)
  } catch (error) {
    console.error('[dev-simulate-paid] finalize failed', { error })
    return Response.json({ error: 'Finalize failed' }, { status: 500 })
  }
}
