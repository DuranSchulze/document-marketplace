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

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('63')) return `+${digits}`
  if (digits.startsWith('0')) return `+63${digits.slice(1)}`
  return `+63${digits}`
}

// Step 1: Create a Xendit customer
export async function createXenditCustomer(params: {
  referenceId: string
  givenNames: string
  email: string
  mobileNumber: string
}): Promise<{ id: string }> {
  const res = await xenditFetch('/customers', {
    method: 'POST',
    body: JSON.stringify({
      reference_id: params.referenceId,
      type: 'INDIVIDUAL',
      email: params.email,
      mobile_number: normalizePhone(params.mobileNumber),
      individual_detail: {
        given_names: params.givenNames,
      },
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Xendit customer error ${res.status}: ${text}`)
  }
  const data = await res.json() as { id: string }
  return { id: data.id }
}

// Step 2: Create a reusable e-wallet payment method and get the auth URL
export async function createXenditPaymentMethod(params: {
  customerId: string
  channelCode: 'GCASH' | 'PAYMAYA'
  successReturnUrl: string
  failureReturnUrl: string
  cancelReturnUrl: string
}): Promise<{ id: string; authUrl: string }> {
  const res = await xenditFetch('/v2/payment_methods', {
    method: 'POST',
    body: JSON.stringify({
      type: 'EWALLET',
      reusability: 'MULTIPLE_USE',
      customer_id: params.customerId,
      ewallet: {
        channel_code: params.channelCode,
        channel_properties: {
          success_return_url: params.successReturnUrl,
          failure_return_url: params.failureReturnUrl,
          cancel_return_url: params.cancelReturnUrl,
        },
      },
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Xendit payment method error ${res.status}: ${text}`)
  }
  const data = await res.json() as {
    id: string
    actions?: Array<{ action: string; url: string; url_type: string }>
  }
  const action = data.actions?.find((a) => a.action === 'AUTH')
  if (!action?.url) throw new Error('No auth URL returned from Xendit payment method')
  return { id: data.id, authUrl: action.url }
}

// Step 3: Create the recurring plan (called after payment_method.activated webhook)
export async function createXenditRecurringPlan(params: {
  referenceId: string
  customerId: string
  paymentMethodId: string
  amount: number
  intervalCount: number
  description: string
  successReturnUrl: string
  failureReturnUrl: string
}): Promise<{ id: string }> {
  const res = await xenditFetch('/recurring/plans', {
    method: 'POST',
    body: JSON.stringify({
      reference_id: params.referenceId,
      customer_id: params.customerId,
      recurring_action: 'PAYMENT',
      currency: 'PHP',
      amount: params.amount,
      payment_methods: [{ payment_method_id: params.paymentMethodId, rank: 1 }],
      schedule: {
        reference_id: `sched_${params.referenceId}`,
        interval: 'MONTH',
        interval_count: params.intervalCount,
        anchor_date: new Date().toISOString(),
      },
      immediate_action_type: 'FULL_AMOUNT',
      notification_config: {
        recurring_created: ['EMAIL'],
        recurring_succeeded: ['EMAIL'],
        recurring_failed: ['EMAIL'],
      },
      success_return_url: params.successReturnUrl,
      failure_return_url: params.failureReturnUrl,
      description: params.description,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Xendit recurring plan error ${res.status}: ${text}`)
  }
  const data = await res.json() as { id: string }
  return { id: data.id }
}
