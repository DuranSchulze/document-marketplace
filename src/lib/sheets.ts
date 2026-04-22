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
}

const CUSTOMERS_RANGE = 'Customers!A:K'

export async function appendCustomerRecord(record: CustomerRecord): Promise<void> {
  if (!isSheetsConfigured()) return

  try {
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
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_ID!,
      range: CUSTOMERS_RANGE,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  } catch (err) {
    console.error('Google Sheets error (appendCustomerRecord):', err)
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

const SUBSCRIPTIONS_RANGE = 'Subscriptions!A:N'

export async function appendSubscriptionRecord(record: SubscriptionRecord): Promise<void> {
  if (!isSheetsConfigured()) return

  try {
    const sheets = getSheetsClient()
    const row = [
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
  } catch (err) {
    console.error('Google Sheets error (appendSubscriptionRecord):', err)
  }
}
