'use client'

import { useEffect, useState } from 'react'
import { CopyIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Plan {
  id: string
  name: string
  description: string
  amount: number
  intervalCount: number
  durationMonths: number
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

interface DeletePlanResponse {
  ok: boolean
  deleted?: boolean
  deactivated?: boolean
  reason?: 'has_subscriptions'
  error?: string
}

const emptyForm = { name: '', description: '', amount: '', durationMonths: '12' }

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [tab, setTab] = useState<'plans' | 'enrollments'>('plans')

  useEffect(() => {
    fetch('/api/admin/subscriptions').then(r => r.json()).then(setPlans)
    fetch('/api/admin/subscriptions/enrollments').then(r => r.json()).then(setEnrollments)
  }, [])

  function getPlanLink(planId: string) {
    if (typeof window === 'undefined') return `/subscribe/${planId}`
    return `${window.location.origin}/subscribe/${planId}`
  }

  function resetForm() {
    setForm(emptyForm)
    setFormError('')
    setEditingPlan(null)
  }

  function openNewPlanDialog() {
    setEditingPlan(null)
    setForm(emptyForm)
    setFormError('')
    setDialogOpen(true)
  }

  function openEditPlanDialog(plan: Plan) {
    setEditingPlan(plan)
    setForm({
      name: plan.name,
      description: plan.description,
      amount: String(plan.amount),
      durationMonths: String(plan.durationMonths),
    })
    setFormError('')
    setDialogOpen(true)
  }

  async function handleSavePlan(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    const intervalCount = 1
    const durationMonths = Number(form.durationMonths)

    if (!Number.isFinite(durationMonths) || durationMonths <= 0) {
      setFormError('Auto-debit months must be a positive number.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(editingPlan ? `/api/admin/subscriptions/${editingPlan.id}` : '/api/admin/subscriptions', {
        method: editingPlan ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          amount: Number(form.amount),
          intervalCount,
          durationMonths,
        }),
      })
      if (res.ok) {
        const plan = await res.json()
        setPlans(prev => editingPlan
          ? prev.map(existing => existing.id === plan.id ? plan : existing)
          : [plan, ...prev],
        )
        resetForm()
        setDialogOpen(false)
        setNotice(editingPlan ? `"${plan.name}" was updated.` : `"${plan.name}" was created. Copy its subscription link from the plan row.`)
      } else {
        const result = await res.json().catch(() => null) as { error?: string } | null
        setFormError(result?.error ?? `Could not ${editingPlan ? 'update' : 'create'} plan. Please check the fields and try again.`)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleCopyLink(plan: Plan) {
    const link = getPlanLink(plan.id)
    await navigator.clipboard.writeText(link)
    setNotice(`Subscription link copied for "${plan.name}".`)
  }

  async function handleDeletePlan(id: string, name: string) {
    if (!confirm(`Delete "${name}"? If it has subscription history, it will be deactivated instead to preserve records.`)) return
    setDeleting(id)
    setNotice('')
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, { method: 'DELETE' })
      const result = (await res.json()) as DeletePlanResponse

      if (!res.ok || !result.ok) {
        setNotice(result.error ?? 'Could not delete plan. Please try again.')
        return
      }

      if (result.deleted) {
        setPlans(prev => prev.filter(p => p.id !== id))
        setNotice(`"${name}" was deleted.`)
        return
      }

      setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: false } : p))
      setNotice(`"${name}" has subscription history, so it was deactivated instead of deleted.`)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="island-kicker mb-1">Admin</p>
          <h1 className="admin-text text-2xl font-bold">Subscriptions</h1>
        </div>
        {tab === 'plans' && (
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button onClick={openNewPlanDialog} className="rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90">
                <PlusIcon className="size-4" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Edit Subscription Plan' : 'New Subscription Plan'}</DialogTitle>
                <DialogDescription>
                  {editingPlan
                    ? 'Update the monthly amount and how long future subscribers will be auto-debited.'
                    : 'Create a simple monthly auto-debit plan and share its signup link with subscribers.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSavePlan} className="space-y-4">
                {formError && (
                  <div className="admin-alert-error rounded-lg px-4 py-3 text-sm">
                    {formError}
                  </div>
                )}
                <div>
                  <Label htmlFor="name" className="admin-field text-sm">Plan Name</Label>
                  <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Premium Monthly" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="desc" className="admin-field text-sm">Description</Label>
                  <Input id="desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What subscribers get" required className="mt-1" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="amount" className="admin-field text-sm">Monthly Amount (PHP)</Label>
                    <Input id="amount" type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="299" required className="mt-1" />
                    <p className="admin-muted mt-1 text-xs">This is charged every month.</p>
                  </div>
                  <div>
                    <Label htmlFor="duration" className="admin-field text-sm">Auto-Debit For How Many Months?</Label>
                    <Input id="duration" type="number" min="1" max="120" value={form.durationMonths} onChange={e => setForm(f => ({ ...f, durationMonths: e.target.value }))} required className="mt-1" />
                    <p className="admin-muted mt-1 text-xs">Example: 12 means monthly charges for 12 months.</p>
                  </div>
                </div>
                <div className="admin-alert-warning rounded-lg px-4 py-3 text-xs">
                  Subscriber will pay ₱{Number(form.amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })} every month for {Number(form.durationMonths || 0)} month{Number(form.durationMonths) === 1 ? '' : 's'}.
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90">
                    {saving ? (editingPlan ? 'Saving...' : 'Creating...') : (editingPlan ? 'Save Changes' : 'Create Plan')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="admin-tab-list mb-6 flex gap-1 border-b">
        {(['plans', 'enrollments'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'admin-tab-active'
                : 'admin-tab-inactive'
            }`}
          >
            {t === 'enrollments' ? 'Subscribers' : 'Plans'}
          </button>
        ))}
      </div>

      {notice && (
        <div className="admin-alert-warning mb-4 rounded-lg px-4 py-3 text-sm">
          {notice}
        </div>
      )}

      {tab === 'plans' && (
        <div className="admin-panel overflow-hidden rounded-2xl">
          {plans.length === 0 ? (
            <div className="admin-empty p-12 text-center">No plans yet. Create your first one above.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table w-full text-sm">
                <thead className="admin-table-head">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Plan</th>
                    <th className="px-6 py-3 text-right font-semibold">Amount</th>
                    <th className="px-6 py-3 text-center font-semibold">Auto-Debit</th>
                    <th className="px-6 py-3 text-center font-semibold">Status</th>
                    <th className="px-6 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="admin-table-body divide-y">
                  {plans.map(plan => (
                    <tr key={plan.id} className="admin-table-row transition-colors">
                      <td className="px-6 py-4">
                        <p className="admin-text font-medium">{plan.name}</p>
                        <p className="admin-muted text-xs">{plan.description}</p>
                        {plan.isActive && (
                          <p className="admin-muted mt-1 max-w-xs truncate text-xs">{getPlanLink(plan.id)}</p>
                        )}
                      </td>
                      <td className="admin-text px-6 py-4 text-right font-medium">
                        ₱{plan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="admin-muted px-6 py-4 text-center">
                        Monthly<br />
                        {plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className={plan.isActive ? 'admin-status-active' : 'admin-status-inactive'}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="admin-link h-auto p-0 text-xs"
                            onClick={() => openEditPlanDialog(plan)}
                          >
                            <PencilIcon className="size-3.5" />
                            Edit
                          </Button>
                          {plan.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="admin-link h-auto p-0 text-xs"
                              onClick={() => handleCopyLink(plan)}
                            >
                              <CopyIcon className="size-3.5" />
                              Copy Link
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="admin-danger-action h-auto p-0 text-xs"
                            disabled={deleting === plan.id}
                            onClick={() => handleDeletePlan(plan.id, plan.name)}
                          >
                            {deleting === plan.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'enrollments' && (
        <div className="admin-panel overflow-hidden rounded-2xl">
          {enrollments.length === 0 ? (
            <div className="admin-empty p-12 text-center">No subscribers yet.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table w-full text-sm">
                <thead className="admin-table-head">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Subscriber</th>
                    <th className="px-6 py-3 text-left font-semibold">Plan</th>
                    <th className="px-6 py-3 text-right font-semibold">Amount</th>
                    <th className="px-6 py-3 text-center font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="admin-table-body divide-y">
                  {enrollments.map(sub => (
                    <tr key={sub.id} className="admin-table-row transition-colors">
                      <td className="px-6 py-4">
                        <p className="admin-text font-medium">{sub.nomineeName}</p>
                        <p className="admin-muted text-xs">{sub.nomineeEmail}</p>
                      </td>
                      <td className="admin-text px-6 py-4">{sub.plan.name}</td>
                      <td className="admin-text px-6 py-4 text-right font-medium">
                        ₱{sub.plan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant="outline"
                          className={
                            sub.status === 'active'
                              ? 'admin-status-active'
                              : sub.status === 'failed'
                                ? 'admin-status-failed'
                                : sub.status === 'cancelled'
                                  ? 'admin-status-inactive'
                                  : 'admin-status-pending'
                          }
                        >
                          {sub.status}
                        </Badge>
                      </td>
                      <td className="admin-muted whitespace-nowrap px-6 py-4">
                        {new Date(sub.createdAt).toLocaleDateString('en-PH')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
