import { type NextRequest } from 'next/server'
import { verifyDownloadToken } from '@/lib/download-token'
import { streamDriveFile } from '@/lib/drive'
import { prisma } from '@/db'

// Streaming a Drive file through our route requires the Node runtime (the
// Edge runtime can't run googleapis).
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function asciiSafe(name: string): string {
  // RFC 6266: filename= must be ASCII; non-ASCII goes in filename* with UTF-8.
  return name.replace(/[^\x20-\x7E]/g, '_')
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  let payload
  try {
    payload = verifyDownloadToken(token)
  } catch {
    return new Response('Invalid or expired download link', { status: 410 })
  }

  // We need the Drive file ID, not just the public URL — `alt=media` requires
  // the ID and is what lets us stream the bytes through our origin (and thus
  // attach Content-Disposition). The ID lives on the Document row.
  const document = await prisma.document.findUnique({
    where: { id: payload.documentId },
    select: { driveFileId: true, driveFileName: true, title: true },
  })

  if (!document) {
    return new Response('Document not found', { status: 404 })
  }

  try {
    const { stream, fileName, mimeType, size } = await streamDriveFile(
      document.driveFileId,
    )

    const downloadName = document.driveFileName || fileName || document.title
    const safeName = asciiSafe(downloadName)
    const encodedName = encodeURIComponent(downloadName)

    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      // `attachment` is the magic word — it tells the browser to save the
      // file to disk instead of opening it inline in a viewer.
      'Content-Disposition': `attachment; filename="${safeName}"; filename*=UTF-8''${encodedName}`,
      'Cache-Control': 'private, no-store',
    }
    if (size) headers['Content-Length'] = String(size)

    return new Response(stream, { headers })
  } catch (error) {
    console.error('[download] Failed to stream Drive file', {
      orderId: payload.orderId,
      documentId: payload.documentId,
      error,
    })
    return new Response('Failed to fetch file', { status: 502 })
  }
}
