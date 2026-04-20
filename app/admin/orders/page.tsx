'use client'

import { useEffect, useState } from 'react'
import { OrderStatusBadge } from '@/components/OrderStatusBadge'

interface Order {
  id: string
  createdAt: string
  buyerName: string
  buyerEmail: string
  documentTitle: string
  amount: number
  status: string
  downloadUrl: string | null
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/admin/orders').then(r => r.json()).then(setOrders)
  }, [])

  return (
    <div>
      <div className="mb-8">
        <p className="island-kicker mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Orders</h1>
      </div>

      <div className="island-shell rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-[var(--sea-ink-soft)]">No orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[rgba(23,58,64,0.08)] bg-[rgba(23,58,64,0.03)]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Buyer</th>
                <th className="px-6 py-3 text-left font-semibold text-[var(--sea-ink-soft)]">Document</th>
                <th className="px-6 py-3 text-right font-semibold text-[var(--sea-ink-soft)]">Amount</th>
                <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Status</th>
                <th className="px-6 py-3 text-center font-semibold text-[var(--sea-ink-soft)]">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(23,58,64,0.06)]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[rgba(23,58,64,0.02)] transition-colors">
                  <td className="px-6 py-4 text-[var(--sea-ink-soft)] whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-PH')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--sea-ink)]">{order.buyerName}</p>
                    <p className="text-xs text-[var(--sea-ink-soft)]">{order.buyerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-[var(--sea-ink)]">{order.documentTitle}</td>
                  <td className="px-6 py-4 text-right font-medium text-[var(--sea-ink)]">
                    ₱{order.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <OrderStatusBadge status={order.status as 'pending' | 'paid' | 'failed'} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {order.downloadUrl ? (
                      <a
                        href={order.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--lagoon-deep)] hover:underline"
                      >
                        Link
                      </a>
                    ) : (
                      <span className="text-xs text-[var(--sea-ink-soft)]">—</span>
                    )}
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
