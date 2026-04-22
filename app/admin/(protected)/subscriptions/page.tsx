'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Plan {
  id: string
  name: string
  description: string
  amount: number
  intervalCount: number
  isActive: boolean
}

interface Enrollment {
  id: string
  nomineeName: string
  nomineeEmail: string
  nomineePhone: string
  status: string
  createdAt: string
  plan: { name: string; amount: number }
}

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', amount: '', intervalCount: '1' })
  const [tab, setTab] = useState<'plans' | 'enrollments'>('plans')

  useEffect(() => {
    fetch('/api/admin/subscriptions').then(r => r.json()).then(setPlans)
    fetch('/api/admin/subscriptions/enrollments').then(r => r.json()).then(setEnrollments)
  }, [])

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          amount: Number(form.amount),
          intervalCount: Number(form.intervalCount),
        }),
      })
      if (res.ok) {
        const plan = await res.json()
        setPlans(prev => [plan, ...prev])
        setForm({ name: '', description: '', amount: '', intervalCount: '1' })
        setShowForm(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate(id: string) {
    setDeleting(id)
    await fetch(`/api/admin/subscriptions/${id}`, { method: 'DELETE' })
    setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: false } : p))
    setDeleting(null)
  }

  const statusColor: Record<string, string> = {
    active: 'default',
    pending: 'secondary',
    failed: 'destructive',
    cancelled: 'outline',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="island-kicker mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Subscriptions</h1>
        </div>
        {tab === 'plans' && (
          <Button
            onClick={() => setShowForm(v => !v)}
            className="rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90"
          >
            {showForm ? 'Cancel' : '+ New Plan'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[rgba(23,58,64,0.08)]">
        {(['plans', 'enrollments'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-[var(--lagoon-deep)] text-[var(--lagoon-deep)]'
                : 'border-transparent text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Create plan form */}
      {showForm && tab === 'plans' && (
        <div className="island-shell rounded-2xl p-6 mb-6 max-w-lg">
          <p className="text-sm font-semibold text-[var(--sea-ink)] mb-4">New Subscription Plan</p>
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm text-[var(--sea-ink)]">Plan Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Basic Monthly" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="desc" className="text-sm text-[var(--sea-ink)]">Description</Label>
              <Input id="desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What subscribers get" required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amount" className="text-sm text-[var(--sea-ink)]">Monthly Amount (₱)</Label>
                <Input id="amount" type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="299" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="interval" className="text-sm text-[var(--sea-ink)]">Billing Every (months)</Label>
                <Input id="interval" type="number" min="1" max="12" value={form.intervalCount} onChange={e => setForm(f => ({ ...f, intervalCount: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <Button type="submit" disabled={saving} className="w-full rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90">
              {saving ? 'Creating…' : 'Create Plan'}
            </Button>
          </form>
        </div>
      )}

      {/* Plans list */}
      {tab === 'plans' && (
        <div className="island-shell rounded-2xl overflow-hidden">
          {plans.length === 0 ? (
            <div className="p-12 text-center text-[var(--sea-ink-soft)]">No plans yet. Create your first one above.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-[rgba(23,58,64,0.08)] bg-[rgba(23,58,64,0.03)]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Plan</th>
                  <th className="px-6 py-3 text-right font-semibold text-[var(--sea-ink-soft)]">Amount</th>
                  <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Interval</th>
                  <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(23,58,64,0.06)]">
                {plans.map(plan => (
                  <tr key={plan.id} className="hover:bg-[rgba(23,58,64,0.02)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--sea-ink)]">{plan.name}</p>
                      <p className="text-xs text-[var(--sea-ink-soft)]">{plan.description}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[var(--sea-ink)]">
                      ₱{plan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--sea-ink-soft)]">
                      Every {plan.intervalCount} month{plan.intervalCount > 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {plan.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-red-500 hover:text-red-700 h-auto p-0"
                          disabled={deleting === plan.id}
                          onClick={() => handleDeactivate(plan.id)}
                        >
                          {deleting === plan.id ? 'Deactivating…' : 'Deactivate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Enrollments list */}
      {tab === 'enrollments' && (
        <div className="island-shell rounded-2xl overflow-hidden">
          {enrollments.length === 0 ? (
            <div className="p-12 text-center text-[var(--sea-ink-soft)]">No enrollments yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-[rgba(23,58,64,0.08)] bg-[rgba(23,58,64,0.03)]">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Nominee</th>
                  <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Plan</th>
                  <th className="px-6 py-3 text-right font-semibold text-[var(--sea-ink-soft)]">Amount/mo</th>
                  <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(23,58,64,0.06)]">
                {enrollments.map(sub => (
                  <tr key={sub.id} className="hover:bg-[rgba(23,58,64,0.02)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--sea-ink)]">{sub.nomineeName}</p>
                      <p className="text-xs text-[var(--sea-ink-soft)]">{sub.nomineeEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-[var(--sea-ink)]">{sub.plan.name}</td>
                    <td className="px-6 py-4 text-right font-medium text-[var(--sea-ink)]">
                      ₱{sub.plan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={(statusColor[sub.status] ?? 'secondary') as 'default' | 'secondary' | 'destructive' | 'outline'}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[var(--sea-ink-soft)] whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('en-PH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
