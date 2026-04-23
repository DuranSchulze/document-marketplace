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
        <h1 className="admin-text text-2xl font-bold">Orders</h1>
      </div>

      <div className="admin-panel rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="admin-empty p-12 text-center">No orders yet.</div>
        ) : (
          <div className="admin-table-wrap">
          <table className="admin-table w-full text-sm">
            <thead className="admin-table-head">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Buyer</th>
                <th className="px-6 py-3 text-left font-semibold">Document</th>
                <th className="px-6 py-3 text-right font-semibold">Amount</th>
                <th className="px-6 py-3 text-center font-semibold">Status</th>
                <th className="px-6 py-3 text-center font-semibold">Download</th>
              </tr>
            </thead>
            <tbody className="admin-table-body divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="admin-table-row transition-colors">
                  <td className="admin-muted px-6 py-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-PH')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="admin-text font-medium">{order.buyerName}</p>
                    <p className="admin-muted text-xs">{order.buyerEmail}</p>
                  </td>
                  <td className="admin-text px-6 py-4">{order.documentTitle}</td>
                  <td className="admin-text px-6 py-4 text-right font-medium">
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
                        className="admin-link text-xs"
                      >
                        Link
                      </a>
                    ) : (
                      <span className="admin-muted text-xs">—</span>
                    )}
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
