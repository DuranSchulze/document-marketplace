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
