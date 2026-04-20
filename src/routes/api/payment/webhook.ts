import { createFileRoute } from '@tanstack/react-router'
import { generateDownloadToken } from '#/lib/download-token'
import { verifyXenditWebhookToken } from '#/lib/xendit'
import { appendCustomerRecord } from '#/lib/sheets'
import { sendDownloadEmail } from '#/lib/mailer'
import { prisma } from '#/db'
import { env } from '#/env'

export const Route = createFileRoute('/api/payment/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const callbackToken = request.headers.get('x-callback-token') ?? ''
        if (!verifyXenditWebhookToken(callbackToken)) {
          return new Response('Unauthorized', { status: 401 })
        }

        let payload: { external_id: string; status: string; id: string }
        try {
          payload = await request.json()
        } catch {
          return new Response('Invalid JSON', { status: 400 })
        }

        const { status, id: xenditInvoiceId } = payload

        if (status === 'PAID') {
          const order = await prisma.order.findFirst({
            where: { xenditInvoiceId },
            include: { document: true },
          })
          if (!order) return new Response('Order not found', { status: 404 })
          if (order.status === 'paid') return new Response('OK', { status: 200 })

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

          await appendCustomerRecord({
            orderId: order.id,
            documentTitle: order.documentTitle,
            buyerName: order.buyerName,
            buyerEmail: order.buyerEmail,
            buyerPhone: order.buyerPhone,
            buyerAddress: order.buyerAddress ?? '',
            amount: order.amount,
            purchasedAt: paidAt.toISOString(),
          })

          await sendDownloadEmail({
            to: order.buyerEmail,
            name: order.buyerName,
            documentTitle: order.documentTitle,
            downloadUrl,
          })
        } else if (status === 'EXPIRED' || status === 'FAILED') {
          await prisma.order.updateMany({
            where: { xenditInvoiceId },
            data: { status: 'failed' },
          })
        }

        return new Response('OK', { status: 200 })
      },
    },
  },
})
