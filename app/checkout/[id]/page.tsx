import { notFound } from 'next/navigation'
import { prisma } from '@/db'
import { CheckoutForm } from './CheckoutForm'

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const document = await prisma.document.findUnique({ where: { id } })
  if (!document || !document.isActive) notFound()

  return <CheckoutForm document={document} />
}
