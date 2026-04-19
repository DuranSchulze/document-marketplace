import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useState } from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'

const getAdminDocuments = createServerFn().handler(async () => {
  const { requireAdmin } = await import('#/lib/admin-guard')
  await requireAdmin(getRequest())
  const { prisma } = await import('#/db')
  return prisma.document.findMany({ orderBy: { createdAt: 'desc' } })
})

export const Route = createFileRoute('/_admin/admin/dashboard')({
  loader: () => getAdminDocuments(),
  component: AdminDashboard,
})

function AdminDashboard() {
  const documents = Route.useLoaderData()
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Archive "${title}"? It will be hidden from the storefront.`)) return
    setDeleting(id)
    await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' })
    setDeleting(null)
    router.invalidate()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="island-kicker mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Documents</h1>
        </div>
        <Link
          to="/admin/documents/new"
          className="rounded-full bg-[var(--lagoon-deep)] px-5 py-2 text-sm font-semibold text-white no-underline transition hover:opacity-90"
        >
          + New Document
        </Link>
      </div>

      <div className="island-shell rounded-2xl overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-[var(--sea-ink-soft)]">No documents yet. Add your first one above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[rgba(23,58,64,0.08)] bg-[rgba(23,58,64,0.03)]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Title</th>
                <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Category</th>
                <th className="px-6 py-3 text-right font-semibold text-[var(--sea-ink-soft)]">Price</th>
                <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Status</th>
                <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(23,58,64,0.06)]">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[rgba(23,58,64,0.02)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--sea-ink)]">{doc.title}</td>
                  <td className="px-6 py-4 text-[var(--sea-ink-soft)]">{doc.category}</td>
                  <td className="px-6 py-4 text-right text-[var(--sea-ink)]">
                    ₱{doc.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={doc.isActive ? 'default' : 'secondary'}>
                      {doc.isActive ? 'Active' : 'Archived'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <Link
                      to="/admin/documents/$id/edit"
                      params={{ id: doc.id }}
                      className="text-xs text-[var(--lagoon-deep)] hover:underline"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500 hover:text-red-700 h-auto p-0"
                      disabled={deleting === doc.id}
                      onClick={() => handleDelete(doc.id, doc.title)}
                    >
                      {deleting === doc.id ? 'Archiving…' : 'Archive'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
