import { createFileRoute } from '@tanstack/react-router'
import { requireAdminApi } from '#/lib/admin-guard'
import { uploadFileToDrive, isDriveConfigured } from '#/lib/drive'

export const Route = createFileRoute('/api/admin/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await requireAdminApi(request)
        if (unauthorized) return unauthorized

        if (!isDriveConfigured()) {
          return Response.json({ error: 'Google Drive is not configured' }, { status: 503 })
        }

        let formData: FormData
        try {
          formData = await request.formData()
        } catch {
          return Response.json({ error: 'Invalid form data' }, { status: 400 })
        }

        const file = formData.get('file')
        const category = formData.get('category')

        if (!(file instanceof File)) {
          return Response.json({ error: 'No file provided' }, { status: 400 })
        }
        if (typeof category !== 'string' || !category.trim()) {
          return Response.json({ error: 'Category is required' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const result = await uploadFileToDrive(buffer, file.name, file.type, category.trim())

        return Response.json({
          driveFileId: result.fileId,
          driveFileName: result.fileName,
          driveFileUrl: result.directUrl,
        })
      },
    },
  },
})
