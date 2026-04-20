import { createFileRoute } from '@tanstack/react-router'
import { requireAdminApi } from '#/lib/admin-guard'
import { checkDriveConnection } from '#/lib/drive'
import { checkSheetsConnection } from '#/lib/sheets'

export const Route = createFileRoute('/api/admin/google-status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const unauthorized = await requireAdminApi(request)
        if (unauthorized) return unauthorized
        const [drive, sheets] = await Promise.all([
          checkDriveConnection(),
          checkSheetsConnection(),
        ])
        return Response.json(
          { drive, sheets, checkedAt: new Date().toISOString() },
          { headers: { 'Cache-Control': 'no-store' } },
        )
      },
    },
  },
})
