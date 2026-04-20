import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { testSheetsWrite } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const result = await testSheetsWrite()
  return Response.json(result, {
    status: result.ok ? 200 : 500,
    headers: { 'Cache-Control': 'no-store' },
  })
}
