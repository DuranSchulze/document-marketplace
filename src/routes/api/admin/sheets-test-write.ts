import { createFileRoute } from '@tanstack/react-router'
import { requireAdminApi } from '#/lib/admin-guard'
import { testSheetsWrite } from '#/lib/sheets'

export const Route = createFileRoute('/api/admin/sheets-test-write')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await requireAdminApi(request)
        if (unauthorized) return unauthorized
        const result = await testSheetsWrite()
        return Response.json(result, {
          status: result.ok ? 200 : 500,
          headers: { 'Cache-Control': 'no-store' },
        })
      },
    },
  },
})
