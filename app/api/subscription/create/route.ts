import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/db'
import { env } from '@/env'
import {
  createXenditCustomer,
  createXenditPaymentMethod,
} from '@/lib/xendit-recurring'
import { appendSubscriptionRecord } from '@/lib/sheets'

const BodySchema = z.object({
  planId: z.string().min(1),
  nomineeName: z.string().min(1),
  nomineeEmail: z.string().email(),
  nomineePhone: z.string().min(1),
  nomineeAddress: z.string().optional(),
  paymentChannel: z.enum(['GCASH', 'PAYMAYA']).default('GCASH'),
})

export async function POST(request: NextRequest) {
  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(await request.json())
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: body.planId } })
  if (!plan || !plan.isActive) {
    return Response.json({ error: 'Plan not found' }, { status: 404 })
  }

  const subscriptionId = crypto.randomUUID()
  const baseUrl = env.SERVER_URL ?? new URL(request.url).origin

  // Step 1: Create Xendit customer
  const customer = await createXenditCustomer({
    referenceId: `cust_${subscriptionId}`,
    givenNames: body.nomineeName,
    email: body.nomineeEmail,
    mobileNumber: body.nomineePhone,
  })

  // Step 2: Create payment method — returns auth URL for user to authorize their e-wallet
  const pm = await createXenditPaymentMethod({
    customerId: customer.id,
    channelCode: body.paymentChannel,
    successReturnUrl: `${baseUrl}/nominees/success?subscriptionId=${subscriptionId}`,
    failureReturnUrl: `${baseUrl}/nominees/failed?subscriptionId=${subscriptionId}`,
    cancelReturnUrl: `${baseUrl}/nominees?cancelled=1`,
  })

  // Save subscription before redirect so webhook can find it by payment method ID
  await prisma.subscription.create({
    data: {
      id: subscriptionId,
      planId: body.planId,
      nomineeName: body.nomineeName,
      nomineeEmail: body.nomineeEmail,
      nomineePhone: body.nomineePhone,
      nomineeAddress: body.nomineeAddress,
      paymentChannel: body.paymentChannel,
      xenditCustomerId: customer.id,
      xenditPaymentMethodId: pm.id,
      authUrl: pm.authUrl,
      status: 'pending',
    },
  })

  // Audit log: record every enrollment attempt (even those that never finish auth)
  await appendSubscriptionRecord({
    subscriptionId,
    planName: plan.name,
    nomineeName: body.nomineeName,
    nomineeEmail: body.nomineeEmail,
    nomineePhone: body.nomineePhone,
    nomineeAddress: body.nomineeAddress ?? '',
    paymentChannel: body.paymentChannel,
    amount: plan.amount,
    status: 'pending',
    event: 'created',
    recordedAt: new Date().toISOString(),
    xenditCustomerId: customer.id,
    xenditPaymentMethodId: pm.id,
    xenditSubscriptionId: '',
  })

  return Response.json({ authUrl: pm.authUrl, subscriptionId })
}
