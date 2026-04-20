import { type NextRequest } from 'next/server'
import { verifyDownloadToken } from '@/lib/download-token'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const payload = verifyDownloadToken(token)
    return Response.redirect(payload.driveFileUrl, 302)
  } catch {
    return new Response('Invalid or expired download link', { status: 410 })
  }
}
