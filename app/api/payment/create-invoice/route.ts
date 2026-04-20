import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { BuyerFormSchema } from '@/lib/schemas'
import { createXenditInvoice } from '@/lib/xendit'
import { prisma } from '@/db'
import { env } from '@/env'

const BodySchema = BuyerFormSchema.extend({ documentId: z.string().min(1) })

export async function POST(request: NextRequest) {
  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(await request.json())
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const document = await prisma.document.findUnique({ where: { id: body.documentId } })
  if (!document || !document.isActive) {
    return Response.json({ error: 'Document not found' }, { status: 404 })
  }

  const orderId = crypto.randomUUID()
  const baseUrl = env.SERVER_URL ?? new URL(request.url).origin

  const invoice = await createXenditInvoice({
    externalId: orderId,
    amount: document.price,
    payerEmail: body.email,
    description: `Purchase: ${document.title}`,
    successRedirectUrl: `${baseUrl}/payment/success?orderId=${orderId}`,
    failureRedirectUrl: `${baseUrl}/payment/failed?orderId=${orderId}&documentId=${document.id}`,
  })

  await prisma.order.create({
    data: {
      id: orderId,
      documentId: document.id,
      documentTitle: document.title,
      buyerName: body.name,
      buyerEmail: body.email,
      buyerPhone: body.phone,
      buyerAddress: body.address,
      amount: document.price,
      status: 'pending',
      xenditInvoiceId: invoice.id,
      xenditPaymentUrl: invoice.invoice_url,
    },
  })

  return Response.json({ paymentUrl: invoice.invoice_url })
}
