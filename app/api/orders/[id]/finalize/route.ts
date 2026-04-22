import { type NextRequest } from 'next/server'
import { getXenditInvoice } from '@/lib/xendit'
import { finalizePaidOrder } from '@/lib/order-finalize'
import { prisma } from '@/db'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

/**
 * Called from the payment success page once the buyer lands back on the site.
 *
 * Acts as a fallback for the Xendit webhook: if the webhook hasn't arrived yet
 * (local dev, network hiccup, Xendit outage), we verify the invoice status
 * directly with Xendit and finalize the order ourselves.
 *
 * The webhook remains the authoritative path. `finalizePaidOrder` is
 * idempotent, so a webhook arriving after this call is safely a no-op.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 })
  }

  // Already paid — just return current state.
  if (order.status === 'paid' && order.downloadUrl) {
    return Response.json(
      {
        orderId: order.id,
        status: 'paid',
        downloadUrl: order.downloadUrl,
        source: 'already-paid',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }

  if (!order.xenditInvoiceId) {
    return Response.json(
      {
        orderId: order.id,
        status: order.status,
        downloadUrl: null,
        error: 'No Xendit invoice linked to this order',
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  // Verify with Xendit directly so the client can't cause us to mark
  // unpaid orders as paid.
  let xenditStatus: string
  try {
    const invoice = await getXenditInvoice(order.xenditInvoiceId)
    xenditStatus = invoice.status
  } catch (error) {
    console.error('[order-finalize:success-page] Xendit lookup failed', {
      orderId: order.id,
      xenditInvoiceId: order.xenditInvoiceId,
      error,
    })
    return Response.json(
      {
        orderId: order.id,
        status: order.status,
        downloadUrl: null,
        error: 'Unable to verify payment with Xendit',
      },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  if (xenditStatus !== 'PAID' && xenditStatus !== 'SETTLED') {
    return Response.json(
      {
        orderId: order.id,
        status: order.status,
        downloadUrl: null,
        xenditStatus,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const baseUrl = env.SERVER_URL ?? new URL(request.url).origin
  try {
    const result = await finalizePaidOrder({
      orderId: order.id,
      baseUrl,
      xenditInvoiceId: order.xenditInvoiceId,
      xenditExternalId: order.id,
      source: 'success-page',
    })
    return Response.json(
      {
        orderId: result.orderId,
        status: result.status,
        downloadUrl: result.downloadUrl,
        source: result.alreadyPaid ? 'already-paid' : 'finalized',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('[order-finalize:success-page] finalize failed', {
      orderId: order.id,
      error,
    })
    return Response.json(
      { error: 'Failed to finalize order' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
