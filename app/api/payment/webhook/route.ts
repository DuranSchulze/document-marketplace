import { type NextRequest } from 'next/server'
import { generateDownloadToken } from '@/lib/download-token'
import { verifyXenditWebhookToken } from '@/lib/xendit'
import { appendCustomerRecord } from '@/lib/sheets'
import { sendDownloadEmail } from '@/lib/mailer'
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
      include: { document: true },
    })
    if (!order) {
      console.error('[payment-webhook] Order not found for paid invoice', {
        xenditInvoiceId,
        xenditExternalId,
      })
      return new Response('Order not found', { status: 404 })
    }
    if (order.status === 'paid') {
      console.info('[payment-webhook] Duplicate paid webhook ignored', {
        orderId: order.id,
        xenditInvoiceId,
      })
      return new Response('OK', { status: 200 })
    }

    console.info('[payment-webhook] Marking order as paid', {
      orderId: order.id,
      buyerEmail: order.buyerEmail,
      documentId: order.documentId,
      documentTitle: order.documentTitle,
      amount: order.amount,
      xenditInvoiceId,
      xenditExternalId,
    })

    const driveFileUrl = order.document.driveFileUrl
    const baseUrl = env.SERVER_URL ?? new URL(request.url).origin

    const token = generateDownloadToken({
      orderId: order.id,
      documentId: order.documentId,
      driveFileUrl,
      buyerEmail: order.buyerEmail,
    })

    const downloadUrl = `${baseUrl}/api/download/${token}`
    const paidAt = new Date()

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'paid', downloadToken: token, downloadUrl, paidAt },
    })

    console.info('[payment-webhook] Order updated successfully', {
      orderId: order.id,
      paidAt: paidAt.toISOString(),
      downloadUrl,
    })

    try {
      await appendCustomerRecord({
        orderId: order.id,
        documentTitle: order.documentTitle,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        buyerPhone: order.buyerPhone,
        buyerAddress: order.buyerAddress ?? '',
        amount: order.amount,
        purchasedAt: paidAt.toISOString(),
        xenditInvoiceId,
        xenditInvoiceUrl: order.xenditPaymentUrl ?? '',
        xenditExternalId,
      })

      console.info('[payment-webhook] Customer record appended to Google Sheets', {
        orderId: order.id,
        xenditInvoiceId,
      })
    } catch (error) {
      console.error('[payment-webhook] Failed to append customer record to Google Sheets', {
        orderId: order.id,
        xenditInvoiceId,
        error,
      })
    }

    try {
      await sendDownloadEmail({
        to: order.buyerEmail,
        name: order.buyerName,
        documentTitle: order.documentTitle,
        downloadUrl,
      })

      console.info('[payment-webhook] Download email flow completed', {
        orderId: order.id,
        buyerEmail: order.buyerEmail,
      })
    } catch (error) {
      console.error('[payment-webhook] Download email flow failed', {
        orderId: order.id,
        buyerEmail: order.buyerEmail,
        error,
      })
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
