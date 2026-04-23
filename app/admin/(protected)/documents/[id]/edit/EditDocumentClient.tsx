'use client'

import { useRouter } from 'next/navigation'
import { DocumentForm } from '@/components/DocumentForm'
import type { DocumentCreateInput } from '@/lib/schemas'

interface DocumentLike {
  id: string
  title: string
  description: string
  price: number
  category: string
  driveFileId: string
  driveFileName: string
  driveFileUrl: string
  thumbnailUrl: string | null
  isActive: boolean
}

export function EditDocumentClient({ document }: { document: DocumentLike }) {
  const router = useRouter()

  async function handleSubmit(data: DocumentCreateInput) {
    const res = await fetch(`/api/admin/documents/${document.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update document')
    router.push('/admin/documents')
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 text-center">
        <p className="island-kicker mb-1">Admin</p>
        <h1 className="admin-text text-2xl font-bold">Edit Document</h1>
      </div>
      <DocumentForm
        defaultValues={{
          title: document.title,
          description: document.description,
          price: document.price,
          category: document.category,
          driveFileId: document.driveFileId,
          driveFileName: document.driveFileName,
          driveFileUrl: document.driveFileUrl,
          thumbnailUrl: document.thumbnailUrl ?? '',
          isActive: document.isActive,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  )
}
