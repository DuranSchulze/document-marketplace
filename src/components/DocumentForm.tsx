import { useState, useRef, useCallback } from 'react'
import { DocumentCreateSchema, type DocumentCreateInput } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const CATEGORIES = ['Legal', 'Business', 'Finance', 'HR', 'Academic', 'Government', 'Other']

interface Props {
  defaultValues?: Partial<DocumentCreateInput>
  onSubmit: (data: DocumentCreateInput) => Promise<void>
  submitLabel?: string
}

export function DocumentForm({ defaultValues, onSubmit, submitLabel = 'Save' }: Props) {
  const [form, setForm] = useState<DocumentCreateInput>({
    title: defaultValues?.title ?? '',
    description: defaultValues?.description ?? '',
    price: defaultValues?.price ?? 0,
    category: defaultValues?.category ?? '',
    driveFileId: defaultValues?.driveFileId ?? '',
    driveFileName: defaultValues?.driveFileName ?? '',
    driveFileUrl: defaultValues?.driveFileUrl ?? '',
    thumbnailUrl: defaultValues?.thumbnailUrl ?? '',
    isActive: defaultValues?.isActive ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [uploadError, setUploadError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (file: File) => {
    const category = form.category.trim()
    if (!category) {
      setUploadError('Select a category first before uploading a file.')
      return
    }

    setUploadState('uploading')
    setUploadError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('category', category)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Upload failed')
      }

      const { driveFileId, driveFileName, driveFileUrl } = await res.json()
      setForm((f) => ({ ...f, driveFileId, driveFileName, driveFileUrl }))
      setUploadState('done')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
      setUploadState('error')
    }
  }, [form.category])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setSubmitError('')

    const result = DocumentCreateSchema.safeParse(form)
    if (!result.success) {
      const errs: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errs[issue.path[0] as string] = issue.message
      }
      setErrors(errs)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(result.data)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="island-shell rounded-2xl p-6 space-y-5">
      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-sm font-medium text-[var(--sea-ink)]">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="e.g. Business Proposal Template"
          className="mt-1"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-[var(--sea-ink)]">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Describe what this document contains and who it's for…"
          rows={4}
          className="mt-1"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Price + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-sm font-medium text-[var(--sea-ink)]">Price (PHP)</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            placeholder="0"
            className="mt-1"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-medium text-[var(--sea-ink)]">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>
      </div>

      {/* File upload */}
      <div>
        <Label className="text-sm font-medium text-[var(--sea-ink)] mb-1 block">
          Document File
        </Label>

        {form.driveFileId ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-800 truncate">{form.driveFileName}</p>
              <p className="text-xs text-emerald-600">Uploaded to Google Drive</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm((f) => ({ ...f, driveFileId: '', driveFileName: '', driveFileUrl: '' }))
                setUploadState('idle')
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline shrink-0"
            >
              Replace
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${
              isDragOver
                ? 'border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.08)]'
                : 'border-[rgba(23,58,64,0.2)] hover:border-[var(--lagoon-deep)] hover:bg-[rgba(79,184,178,0.04)]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={handleFileChange}
              className="sr-only"
            />
            {uploadState === 'uploading' ? (
              <>
                <svg className="w-8 h-8 text-[var(--lagoon-deep)] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-[var(--sea-ink-soft)]">Uploading to Google Drive…</p>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 text-[var(--lagoon-deep)] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-[var(--sea-ink)]">Drop file here or click to browse</p>
                <p className="text-xs text-[var(--sea-ink-soft)]">PDF, Word, Excel, PowerPoint</p>
              </>
            )}
          </div>
        )}

        {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
        {errors.driveFileId && <p className="text-red-500 text-xs mt-1">File is required — please upload a document.</p>}
      </div>

      {/* Thumbnail URL */}
      <div>
        <Label htmlFor="thumbnailUrl" className="text-sm font-medium text-[var(--sea-ink)]">Thumbnail URL (optional)</Label>
        <Input
          id="thumbnailUrl"
          type="url"
          value={form.thumbnailUrl ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
          placeholder="https://…"
          className="mt-1"
        />
        {errors.thumbnailUrl && <p className="text-red-500 text-xs mt-1">{errors.thumbnailUrl}</p>}
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="isActive"
          checked={form.isActive}
          onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
        />
        <Label htmlFor="isActive" className="text-sm font-medium text-[var(--sea-ink)] cursor-pointer">
          Active (visible on storefront)
        </Label>
      </div>

      {submitError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || uploadState === 'uploading'}
          className="rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
