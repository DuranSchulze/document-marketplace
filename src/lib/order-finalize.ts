import { generateDownloadToken } from '@/lib/download-token'
import { appendCustomerRecord } from '@/lib/sheets'
import { sendDownloadEmail } from '@/lib/mailer'
import { prisma } from '@/db'
import { env } from '@/env'

export interface FinalizeResult {
  orderId: string
  status: 'paid'
  downloadUrl: string
  alreadyPaid: boolean
}

/**
 * Marks an order as paid, issues a download token, writes to Google Sheets,
 * and sends the download email. Idempotent — calling this twice for the same
 * order is a no-op after the first successful call.
 *
 * Used by:
 *   - Xendit webhook (primary, authoritative)
 *   - Success page finalize endpoint (fallback if webhook is delayed)
 *   - Dev simulate-paid endpoint (local testing without webhook)
 */
export async function finalizePaidOrder({
  orderId,
  baseUrl,
  xenditInvoiceId,
  xenditExternalId,
  source,
}: {
  orderId: string
  baseUrl: string
  xenditInvoiceId?: string
  xenditExternalId?: string
  source: 'webhook' | 'success-page' | 'dev-simulate'
}): Promise<FinalizeResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { document: true },
  })
  if (!order) {
    throw new Error(`Order ${orderId} not found`)
  }

  if (order.status === 'paid' && order.downloadUrl) {
    return {
      orderId: order.id,
      status: 'paid',
      downloadUrl: order.downloadUrl,
      alreadyPaid: true,
    }
  }

  const token = generateDownloadToken({
    orderId: order.id,
    documentId: order.documentId,
    driveFileUrl: order.document.driveFileUrl,
    buyerEmail: order.buyerEmail,
  })
  const downloadUrl = `${baseUrl}/api/download/${token}`
  const paidAt = new Date()

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'paid', downloadToken: token, downloadUrl, paidAt },
  })

  console.info(`[order-finalize:${source}] Order marked as paid`, {
    orderId: order.id,
    paidAt: paidAt.toISOString(),
    downloadUrl,
  })

  try {
    const sheetsResult = await appendCustomerRecord({
      orderId: order.id,
      documentTitle: order.documentTitle,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      buyerPhone: order.buyerPhone,
      buyerAddress: order.buyerAddress ?? '',
      amount: order.amount,
      purchasedAt: paidAt.toISOString(),
      xenditInvoiceId: xenditInvoiceId ?? order.xenditInvoiceId ?? '',
      xenditInvoiceUrl: order.xenditPaymentUrl ?? '',
      xenditExternalId: xenditExternalId ?? order.id,
      downloadUrl,
    })
    if (sheetsResult.ok && sheetsResult.appended) {
      console.info(`[order-finalize:${source}] Customer record appended to Sheets`, {
        orderId: order.id,
        key: sheetsResult.key,
      })
    } else if (sheetsResult.ok && sheetsResult.skipped) {
      console.info(`[order-finalize:${source}] Customer Sheets append skipped`, {
        orderId: order.id,
        key: sheetsResult.key,
        reason: sheetsResult.reason,
      })
    } else {
      console.error(`[order-finalize:${source}] Customer Sheets append failed`, {
        orderId: order.id,
        key: sheetsResult.key,
        error: sheetsResult.error,
      })
    }
  } catch (error) {
    console.error(`[order-finalize:${source}] Sheets append failed`, {
      orderId: order.id,
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
    console.info(`[order-finalize:${source}] Download email sent`, {
      orderId: order.id,
      buyerEmail: order.buyerEmail,
    })
  } catch (error) {
    console.error(`[order-finalize:${source}] Download email failed`, {
      orderId: order.id,
      buyerEmail: order.buyerEmail,
      error,
    })
  }

  void env.SERVER_URL // keep env import stable

  return {
    orderId: order.id,
    status: 'paid',
    downloadUrl,
    alreadyPaid: false,
  }
}
