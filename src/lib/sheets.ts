import { google } from 'googleapis'
import { env } from '#/env'

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
