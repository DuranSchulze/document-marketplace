import { notFound } from 'next/navigation'
import { prisma } from '@/db'
import { EditDocumentClient } from './EditDocumentClient'

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const document = await prisma.document.findUnique({ where: { id } })
  if (!document) notFound()

  return <EditDocumentClient document={document} />
}
