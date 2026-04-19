import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { DocumentForm } from '#/components/DocumentForm'
import type { DocumentCreateInput } from '#/lib/schemas'

const getDocument = createServerFn()
  .handler(async ({ data }: { data: string }) => {
    const { prisma } = await import('#/db')
    const document = await prisma.document.findUnique({ where: { id: data } })
    if (!document) throw notFound()
    return document
  })

export const Route = createFileRoute('/_admin/admin/documents/$id/edit')({
  loader: ({ params }) => getDocument({ data: params.id }),
  component: EditDocumentPage,
})

function EditDocumentPage() {
  const document = Route.useLoaderData()
  const { id } = Route.useParams() as { id: string }
  const navigate = useNavigate()

  async function handleSubmit(data: DocumentCreateInput) {
    const res = await fetch(`/api/admin/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Failed to update document')
    navigate({ to: '/admin/dashboard' })
  }

  return (
    <div>
      <div className="mb-8">
        <p className="island-kicker mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Edit Document</h1>
      </div>
      <div className="max-w-2xl">
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
    </div>
  )
}
