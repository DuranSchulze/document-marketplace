'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SubscribeFormProps {
  planId: string
}

export function SubscribeForm({ planId }: SubscribeFormProps) {
  const [form, setForm] = useState({
    subscriberName: '',
    subscriberEmail: '',
    subscriberPhone: '',
    subscriberAddress: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          ...form,
        }),
      })
      const data = await res.json().catch(() => null) as { paymentUrl?: string; authUrl?: string; error?: string } | null

      if (!res.ok || (!data?.paymentUrl && !data?.authUrl)) {
        setError(data?.error ?? 'Unable to start checkout. Please try again.')
        return
      }

      window.location.href = data.paymentUrl ?? data.authUrl ?? '/'
    } catch {
      setError('Unable to start checkout. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="island-shell space-y-5 rounded-2xl p-6 sm:p-8">
      {error && (
        <div className="admin-alert-error rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="subscriberName" className="text-sm text-[var(--sea-ink)]">Full Name</Label>
        <Input
          id="subscriberName"
          value={form.subscriberName}
          onChange={e => setForm(f => ({ ...f, subscriberName: e.target.value }))}
          placeholder="Juan Dela Cruz"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="subscriberEmail" className="text-sm text-[var(--sea-ink)]">Email</Label>
        <Input
          id="subscriberEmail"
          type="email"
          value={form.subscriberEmail}
          onChange={e => setForm(f => ({ ...f, subscriberEmail: e.target.value }))}
          placeholder="you@example.com"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="subscriberPhone" className="text-sm text-[var(--sea-ink)]">Mobile Number</Label>
        <Input
          id="subscriberPhone"
          value={form.subscriberPhone}
          onChange={e => setForm(f => ({ ...f, subscriberPhone: e.target.value }))}
          placeholder="09171234567"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="subscriberAddress" className="text-sm text-[var(--sea-ink)]">Address Optional</Label>
        <Input
          id="subscriberAddress"
          value={form.subscriberAddress}
          onChange={e => setForm(f => ({ ...f, subscriberAddress: e.target.value }))}
          placeholder="City, Province"
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--lagoon-deep)] py-6 text-white hover:opacity-90"
      >
        {loading ? 'Opening Xendit checkout...' : 'Continue to Xendit Checkout'}
      </Button>

      <p className="text-center text-xs text-[var(--sea-ink-soft)]">
        Xendit will show the payment methods available for this business.
      </p>
    </form>
  )
}
