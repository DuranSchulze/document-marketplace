'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BuyerFormSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DocumentLike {
  id: string
  title: string
  price: number
  category: string
  thumbnailUrl?: string | null
}

export function CheckoutForm({ document }: { document: DocumentLike }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const result = BuyerFormSchema.safeParse(form)
    if (!result.success) {
      const errs: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errs[issue.path[0] as string] = issue.message
      }
      setFieldErrors(errs)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, documentId: document.id }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      const { paymentUrl } = await res.json()
      window.location.href = paymentUrl
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 pb-16 pt-14">
      <div className="max-w-2xl mx-auto">
        <Link href={`/documents/${document.id}`} className="text-sm text-[var(--lagoon-deep)] hover:underline mb-6 inline-block">
          ← Back to document
        </Link>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-8">Complete your purchase</h1>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="island-shell rounded-2xl p-5 lg:col-span-2 h-fit">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-3">Order Summary</p>
            {document.thumbnailUrl && (
              <img src={document.thumbnailUrl} alt={document.title} className="w-full rounded-xl h-28 object-cover mb-3" />
            )}
            <p className="font-semibold text-[var(--sea-ink)] text-sm mb-1">{document.title}</p>
            <p className="text-xs text-[var(--sea-ink-soft)] mb-4">{document.category}</p>
            <div className="border-t border-[rgba(23,58,64,0.1)] pt-3 flex justify-between">
              <span className="text-sm text-[var(--sea-ink-soft)]">Total</span>
              <span className="font-bold text-[var(--sea-ink)]">
                ₱{document.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="island-shell rounded-2xl p-6 lg:col-span-3 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-2">Your Details</p>

            <div>
              <Label htmlFor="name" className="text-sm font-medium text-[var(--sea-ink)]">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Juan dela Cruz" className="mt-1" />
              {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[var(--sea-ink)]">Email Address</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="juan@example.com" className="mt-1" />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-[var(--sea-ink)]">Phone Number</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="09171234567" className="mt-1" />
              {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-[var(--sea-ink)]">Address</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, Quezon City" className="mt-1" />
              {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90">
              {isSubmitting ? 'Redirecting to payment…' : `Pay ₱${document.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
            </Button>

            <p className="text-xs text-center text-[var(--sea-ink-soft)]">Secure payment powered by Xendit</p>
          </form>
        </div>
      </div>
    </main>
  )
}
