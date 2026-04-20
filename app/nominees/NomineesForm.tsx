'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Plan {
  id: string
  name: string
  description: string
  amount: number
  intervalCount: number
}

export function NomineesForm({ plans }: { plans: Plan[] }) {
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0]?.id ?? '')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          nomineeName: form.name,
          nomineeEmail: form.email,
          nomineePhone: form.phone,
          nomineeAddress: form.address,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      const { checkoutUrl } = await res.json()
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        setError('Could not get payment URL. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (plans.length === 0) {
    return (
      <div className="island-shell rounded-2xl p-8 text-center text-[var(--sea-ink-soft)]">
        No subscription plans are available at the moment. Please check back soon.
      </div>
    )
  }

  const activePlan = plans.find(p => p.id === selectedPlan)

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Plan selector */}
      <div className="lg:col-span-2 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">Choose a Plan</p>
        {plans.map(plan => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlan(plan.id)}
            className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
              selectedPlan === plan.id
                ? 'border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.08)]'
                : 'border-[rgba(23,58,64,0.1)] hover:border-[rgba(79,184,178,0.4)]'
            }`}
          >
            <p className="font-semibold text-[var(--sea-ink)] text-sm">{plan.name}</p>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">{plan.description}</p>
            <p className="font-bold text-[var(--lagoon-deep)] mt-2">
              ₱{plan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              <span className="text-xs font-normal text-[var(--sea-ink-soft)]">
                {' '}/ {plan.intervalCount === 1 ? 'month' : `${plan.intervalCount} months`}
              </span>
            </p>
          </button>
        ))}

        {activePlan && (
          <div className="island-shell rounded-xl p-4 mt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)] mb-2">Summary</p>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--sea-ink-soft)]">{activePlan.name}</span>
              <span className="font-bold text-[var(--sea-ink)]">
                ₱{activePlan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}/mo
              </span>
            </div>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-2">
              Auto-renews every {activePlan.intervalCount === 1 ? 'month' : `${activePlan.intervalCount} months`}. Cancel anytime.
            </p>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="island-shell rounded-2xl p-6 lg:col-span-3 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">Your Details</p>

        <div>
          <Label htmlFor="name" className="text-sm font-medium text-[var(--sea-ink)]">Full Name</Label>
          <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Juan dela Cruz" required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-[var(--sea-ink)]">Email Address</Label>
          <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="juan@example.com" required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-[var(--sea-ink)]">Phone Number</Label>
          <Input id="phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="09171234567" required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium text-[var(--sea-ink)]">Address</Label>
          <Input id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St, Quezon City" className="mt-1" />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <Button type="submit" disabled={isSubmitting || !selectedPlan} className="w-full rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90">
          {isSubmitting ? 'Redirecting to payment…' : 'Proceed to Payment'}
        </Button>

        <p className="text-xs text-center text-[var(--sea-ink-soft)]">Secure recurring payment powered by Xendit</p>
      </form>
    </div>
  )
}
