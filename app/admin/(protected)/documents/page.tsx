'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Document {
  id: string
  title: string
  category: string
  price: number
  isActive: boolean
}

interface DeleteDocumentResponse {
  ok: boolean
  deleted?: boolean
  deactivated?: boolean
  reason?: 'has_orders'
  error?: string
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/admin/documents').then(r => r.json()).then(setDocuments)
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? If it has order history, it will be archived instead to preserve records.`)) return
    setDeleting(id)
    setNotice('')
    try {
      const res = await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' })
      const result = (await res.json()) as DeleteDocumentResponse

      if (!res.ok || !result.ok) {
        setNotice(result.error ?? 'Could not delete document. Please try again.')
        return
      }

      if (result.deleted) {
        setDocuments(prev => prev.filter(d => d.id !== id))
        setNotice(`"${title}" was deleted.`)
        return
      }

      setDocuments(prev => prev.map(d => d.id === id ? { ...d, isActive: false } : d))
      setNotice(`"${title}" has order history, so it was archived instead of deleted.`)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="island-kicker mb-1">Admin</p>
          <h1 className="admin-text text-2xl font-bold">Documents</h1>
        </div>
        <Link
          href="/admin/documents/new"
          className="rounded-full bg-[var(--lagoon-deep)] px-5 py-2 text-sm font-semibold text-white no-underline transition hover:opacity-90"
        >
          + New Document
        </Link>
      </div>

      {notice && (
        <div className="admin-alert-warning mb-4 rounded-lg px-4 py-3 text-sm">
          {notice}
        </div>
      )}

      <div className="admin-panel rounded-2xl overflow-hidden">
        {documents.length === 0 ? (
          <div className="admin-empty p-12 text-center">No documents yet. Add your first one above.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table w-full text-sm">
              <thead className="admin-table-head">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-right font-semibold">Price</th>
                  <th className="px-6 py-3 text-center font-semibold">Status</th>
                  <th className="px-6 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="admin-table-body divide-y">
                {documents.map((doc) => (
                  <tr key={doc.id} className="admin-table-row transition-colors">
                    <td className="admin-text px-6 py-4 font-medium">{doc.title}</td>
                    <td className="admin-muted px-6 py-4">{doc.category}</td>
                    <td className="admin-text px-6 py-4 text-right">
                      ₱{doc.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={doc.isActive ? 'admin-status-active' : 'admin-status-inactive'}>
                        {doc.isActive ? 'Active' : 'Archived'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Link
                        href={`/admin/documents/${doc.id}/edit`}
                        className="admin-link text-xs"
                      >
                        Edit
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="admin-danger-action text-xs h-auto p-0"
                        disabled={deleting === doc.id}
                        onClick={() => handleDelete(doc.id, doc.title)}
                      >
                        {deleting === doc.id ? 'Deleting…' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
