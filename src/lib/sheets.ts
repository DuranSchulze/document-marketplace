import { google } from 'googleapis'
import { env } from '@/env'

function parsePrivateKey(raw: string): string {
  // Strip surrounding quotes if the env value was pasted with them.
  let key = raw.trim().replace(/^['"]|['"]$/g, '')

  // If it doesn't already look like a PEM, assume it's base64-encoded and
  // decode it first. (Vercel-friendly storage format because raw PEM has
  // newlines the dashboard sometimes mangles.)
  if (!key.includes('-----BEGIN')) {
    key = Buffer.from(key, 'base64').toString('utf-8')
  }

  // Always normalize escaped newlines to real ones — applies whether the key
  // came in as raw PEM with literal `\n` or as a base64-decoded
  // JSON-escaped string. Without this, OpenSSL throws
  // `error:1E08010C:DECODER unsupported` because BEGIN/END aren't on their
  // own lines.
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').trim()

  if (!key.includes('-----BEGIN') || !key.includes('-----END')) {
    throw new Error(
      'Parsed GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY does not look like a PEM. ' +
        'Expected either a raw PEM (with literal newlines or escaped \\n) or a base64-encoded PEM.',
    )
  }

  return key
}

function getSheetsClient() {
  const privateKey = parsePrivateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '')
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

export type SheetAppendResult =
  | { ok: true; appended: true; skipped: false; key: string; range: string }
  | { ok: true; appended: false; skipped: true; key: string; range: string; reason: 'duplicate' | 'not_configured' }
  | { ok: false; appended: false; skipped: false; key: string; range: string; error: string }

function toSheetError(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown Sheets error'
}

function subscriptionEventKey(record: SubscriptionRecord): string {
  const traceId =
    record.xenditSubscriptionId ||
    record.xenditPaymentMethodId ||
    record.xenditCustomerId ||
    'no-xendit-id'
  const dateBucket = record.recordedAt.slice(0, 10) || 'no-date'
  return `${record.subscriptionId}:${record.event}:${traceId}:${dateBucket}`
}

async function hasExistingKey({
  range,
  key,
}: {
  range: string
  key: string
}): Promise<boolean> {
  const sheets = getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GOOGLE_SHEETS_ID!,
    range,
  })

  return (res.data.values ?? [])
    .flat()
    .some((value) => String(value).trim() === key)
}

export function isSheetsConfigured(): boolean {
  return !!(
    env.GOOGLE_SHEETS_ID &&
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  )
}

export async function checkSheetsConnection(): Promise<{ ok: boolean; error?: string; title?: string }> {
  if (!isSheetsConfigured()) {
    return { ok: false, error: 'Missing env vars (GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)' }
  }
  try {
    const sheets = getSheetsClient()
    const res = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEETS_ID!,
      fields: 'properties.title',
    })
    return { ok: true, title: res.data.properties?.title ?? undefined }
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : 'Unknown Sheets error'
    const message = raw.includes('401') || raw.toLowerCase().includes('invalid authentication')
      ? '401 — Share the sheet with your service account email, or check GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in Vercel env vars'
      : raw
    return { ok: false, error: message }
  }
}

export async function testSheetsWrite(): Promise<{ ok: boolean; error?: string; cell?: string; value?: string }> {
  if (!isSheetsConfigured()) {
    return { ok: false, error: 'Sheets not configured' }
  }
  try {
    const sheets = getSheetsClient()
    const cell = 'Customers!Z1'
    const value = `health-check ${new Date().toISOString()}`
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.GOOGLE_SHEETS_ID!,
      range: cell,
      valueInputOption: 'RAW',
      requestBody: { values: [[value]] },
    })
    return { ok: true, cell, value }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown Sheets write error'
    return { ok: false, error: message }
  }
}

export interface CustomerRecord {
  orderId: string
  documentTitle: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerAddress: string
  amount: number
  purchasedAt: string
  // Xendit traceability — paste these into the Xendit dashboard search to
  // jump straight to the matching invoice.
  xenditInvoiceId: string
  xenditInvoiceUrl: string
  xenditExternalId: string
  downloadUrl: string
}

const CUSTOMERS_RANGE = 'Customers!A:L'
const CUSTOMERS_KEY_RANGE = 'Customers!A:A'

export async function appendCustomerRecord(record: CustomerRecord): Promise<SheetAppendResult> {
  const key = record.orderId
  if (!isSheetsConfigured()) {
    return { ok: true, appended: false, skipped: true, key, range: CUSTOMERS_RANGE, reason: 'not_configured' }
  }

  try {
    if (await hasExistingKey({ range: CUSTOMERS_KEY_RANGE, key })) {
      return { ok: true, appended: false, skipped: true, key, range: CUSTOMERS_RANGE, reason: 'duplicate' }
    }

    const sheets = getSheetsClient()
    const row = [
      record.orderId,
      record.documentTitle,
      record.buyerName,
      record.buyerEmail,
      record.buyerPhone,
      record.buyerAddress,
      String(record.amount),
      record.purchasedAt,
      record.xenditInvoiceId,
      record.xenditInvoiceUrl,
      record.xenditExternalId,
      record.downloadUrl,
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_ID!,
      range: CUSTOMERS_RANGE,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
    return { ok: true, appended: true, skipped: false, key, range: CUSTOMERS_RANGE }
  } catch (err) {
    const error = toSheetError(err)
    console.error('Google Sheets error (appendCustomerRecord):', error)
    return { ok: false, appended: false, skipped: false, key, range: CUSTOMERS_RANGE, error }
  }
}

export interface SubscriptionRecord {
  subscriptionId: string
  planName: string
  nomineeName: string
  nomineeEmail: string
  nomineePhone: string
  nomineeAddress: string
  paymentChannel: string
  amount: number
  status: string // pending | active | failed | cancelled
  event: string  // e.g. created | activated | payment_succeeded | payment_failed | cancelled
  recordedAt: string
  // Xendit traceability — searchable directly in the Xendit dashboard.
  xenditCustomerId: string
  xenditPaymentMethodId: string
  xenditSubscriptionId: string
}

const SUBSCRIPTIONS_RANGE = 'Subscriptions!A:O'
const SUBSCRIPTIONS_KEY_RANGE = 'Subscriptions!A:A'

export async function appendSubscriptionRecord(record: SubscriptionRecord): Promise<SheetAppendResult> {
  const key = subscriptionEventKey(record)
  if (!isSheetsConfigured()) {
    return { ok: true, appended: false, skipped: true, key, range: SUBSCRIPTIONS_RANGE, reason: 'not_configured' }
  }

  try {
    if (await hasExistingKey({ range: SUBSCRIPTIONS_KEY_RANGE, key })) {
      return { ok: true, appended: false, skipped: true, key, range: SUBSCRIPTIONS_RANGE, reason: 'duplicate' }
    }

    const sheets = getSheetsClient()
    const row = [
      key,
      record.subscriptionId,
      record.planName,
      record.nomineeName,
      record.nomineeEmail,
      record.nomineePhone,
      record.nomineeAddress,
      record.paymentChannel,
      String(record.amount),
      record.status,
      record.event,
      record.recordedAt,
      record.xenditCustomerId,
      record.xenditPaymentMethodId,
      record.xenditSubscriptionId,
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_ID!,
      range: SUBSCRIPTIONS_RANGE,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
    return { ok: true, appended: true, skipped: false, key, range: SUBSCRIPTIONS_RANGE }
  } catch (err) {
    const error = toSheetError(err)
    console.error('Google Sheets error (appendSubscriptionRecord):', error)
    return { ok: false, appended: false, skipped: false, key, range: SUBSCRIPTIONS_RANGE, error }
  }
}
