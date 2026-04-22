import { env } from '@/env'

const XENDIT_BASE = 'https://api.xendit.co'

function xenditFetch(path: string, init: RequestInit = {}) {
  const token = Buffer.from(`${env.XENDIT_SECRET_KEY ?? ''}:`).toString('base64')
  return fetch(`${XENDIT_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    },
  })
}

export interface CreateInvoiceParams {
  externalId: string
  amount: number
  payerEmail: string
  description: string
  successRedirectUrl: string
  failureRedirectUrl: string
  // Optional buyer profile — when provided, Xendit can send the buyer its
  // own branded receipt email on `invoice.paid` in addition to our SMTP one.
  customerName?: string
  customerPhone?: string
}

export interface XenditInvoice {
  id: string
  invoice_url: string
  status: string
  external_id: string
  amount: number
}

export async function createXenditInvoice(params: CreateInvoiceParams): Promise<XenditInvoice> {
  const res = await xenditFetch('/v2/invoices', {
    method: 'POST',
    body: JSON.stringify({
      external_id: params.externalId,
      amount: params.amount,
      payer_email: params.payerEmail,
      description: params.description,
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      currency: 'PHP',
      // Belt-and-suspenders email delivery: Xendit will send a branded
      // payment receipt directly to the buyer when the invoice transitions
      // to PAID, in addition to the download-link email we send via SMTP.
      // `customer` is required for notifications to fire.
      customer: {
        given_names: params.customerName ?? params.payerEmail,
        email: params.payerEmail,
        ...(params.customerPhone ? { mobile_number: params.customerPhone } : {}),
      },
      customer_notification_preference: {
        invoice_created: ['email'],
        invoice_reminder: ['email'],
        invoice_paid: ['email'],
        invoice_expired: ['email'],
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Xendit error ${res.status}: ${text}`)
  }

  return res.json() as Promise<XenditInvoice>
}

export function verifyXenditWebhookToken(token: string): boolean {
  return !!env.XENDIT_WEBHOOK_TOKEN && token === env.XENDIT_WEBHOOK_TOKEN
}

export async function getXenditInvoice(invoiceId: string): Promise<XenditInvoice> {
  const res = await xenditFetch(`/v2/invoices/${invoiceId}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Xendit error ${res.status}: ${text}`)
  }
  return res.json() as Promise<XenditInvoice>
}
