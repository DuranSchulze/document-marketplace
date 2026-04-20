import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { checkDriveConnection } from '@/lib/drive'
import { checkSheetsConnection } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const [drive, sheets] = await Promise.all([checkDriveConnection(), checkSheetsConnection()])
  return Response.json(
    { drive, sheets, checkedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
