'use client'

import { useRouter } from 'next/navigation'
import { DocumentForm } from '@/components/DocumentForm'
import type { DocumentCreateInput } from '@/lib/schemas'

export default function NewDocumentPage() {
  const router = useRouter()

  async function handleSubmit(data: DocumentCreateInput) {
    const res = await fetch('/api/admin/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create document')
    router.push('/admin/dashboard')
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 text-center">
        <p className="island-kicker mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Add Document</h1>
      </div>
      <DocumentForm onSubmit={handleSubmit} submitLabel="Add Document" />
    </div>
  )
}
