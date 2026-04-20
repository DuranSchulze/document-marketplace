import { google } from 'googleapis'
import { env } from '@/env'

function getSheetsClient() {
  const privateKey = (env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
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
    const message = err instanceof Error ? err.message : 'Unknown Sheets error'
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
}

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
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_ID!,
      range: 'Customers!A:H',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  } catch (err) {
    console.error('Google Sheets error (appendCustomerRecord):', err)
  }
}
