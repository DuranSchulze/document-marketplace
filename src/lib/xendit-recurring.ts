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

export interface CreateRecurringPlanParams {
  referenceId: string
  amount: number
  intervalCount: number
  description: string
  successReturnUrl: string
  failureReturnUrl: string
  customerName: string
  customerEmail: string
  customerPhone?: string
}

export interface XenditRecurringPlan {
  id: string
  reference_id: string
  status: string
  actions: Array<{ url: string; url_type: string; method: string }>
  amount: number
}

// Creates a recurring plan + immediately triggers the first payment authorization.
// Returns the plan with an 'actions' array that contains the checkout_url.
export async function createXenditRecurringPlan(
  params: CreateRecurringPlanParams,
): Promise<XenditRecurringPlan> {
  const res = await xenditFetch('/recurring/plans', {
    method: 'POST',
    body: JSON.stringify({
      reference_id: params.referenceId,
      customer_id: null,
      recurring_action: 'PAYMENT',
      currency: 'PHP',
      amount: params.amount,
      payment_methods: [{ rank: 1 }],
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
      metadata: {
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone ?? '',
      },
      success_return_url: params.successReturnUrl,
      failure_return_url: params.failureReturnUrl,
      description: params.description,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Xendit recurring error ${res.status}: ${text}`)
  }

  return res.json() as Promise<XenditRecurringPlan>
}

export function getCheckoutUrl(plan: XenditRecurringPlan): string | null {
  const action = plan.actions?.find(
    (a) => a.url_type === 'WEB' || a.url_type === 'MOBILE' || a.url,
  )
  return action?.url ?? null
}
