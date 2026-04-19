import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DocumentForm } from '#/components/DocumentForm'
import type { DocumentCreateInput } from '#/lib/schemas'

export const Route = createFileRoute('/_admin/admin/documents/new')({
  component: NewDocumentPage,
})

function NewDocumentPage() {
  const navigate = useNavigate()

  async function handleSubmit(data: DocumentCreateInput) {
    const res = await fetch('/api/admin/documents/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Failed to create document')
    navigate({ to: '/admin/dashboard' })
  }

  return (
    <div>
      <div className="mb-8">
        <p className="island-kicker mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Add Document</h1>
      </div>
      <div className="max-w-2xl">
        <DocumentForm onSubmit={handleSubmit} submitLabel="Add Document" />
      </div>
    </div>
  )
}
