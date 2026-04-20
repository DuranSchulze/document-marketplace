import { type NextRequest } from 'next/server'
import { prisma } from '@/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) return Response.json({ error: 'Not found' }, { status: 404 })

  return Response.json({
    id: order.id,
    status: order.status,
    downloadUrl: order.status === 'paid' ? order.downloadUrl : null,
    documentTitle: order.documentTitle,
  })
}
