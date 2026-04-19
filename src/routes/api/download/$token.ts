import { createFileRoute } from '@tanstack/react-router'
import { verifyDownloadToken } from '#/lib/download-token'

export const Route = createFileRoute('/api/download/$token')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const payload = verifyDownloadToken(params.token)
          return Response.redirect(payload.driveFileUrl, 302)
        } catch {
          return new Response('Invalid or expired download link', { status: 410 })
        }
      },
    },
  },
})
