import { type NextRequest } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { DocumentCreateSchema } from '@/lib/schemas'
import { prisma } from '@/db'
import { normalizeGoogleDriveFile } from '@/lib/google-drive'

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  const docs = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } })
  return Response.json(docs)
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized
  let body
  try {
    body = DocumentCreateSchema.parse(await request.json())
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }
  const file = normalizeGoogleDriveFile({
    driveFileId: body.driveFileId,
    driveFileUrl: body.driveFileUrl,
    driveFileName: body.driveFileName,
    fallbackFileName: body.title,
  })

  if (!file.driveFileId || !file.driveFileUrl || !file.driveFileName) {
    return Response.json({ error: 'A valid Google Drive file ID or link is required' }, { status: 400 })
  }

  const doc = await prisma.document.create({
    data: {
      ...body,
      ...file,
    },
  })
  return Response.json(doc, { status: 201 })
}
