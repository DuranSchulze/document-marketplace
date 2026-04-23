import { Badge } from '@/components/ui/badge'
import type { Order } from '@/lib/schemas'

const config: Record<Order['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'admin-status-pending' },
  paid: { label: 'Paid', className: 'admin-status-paid' },
  failed: { label: 'Failed', className: 'admin-status-failed' },
}

export function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const { label, className } = config[status] ?? config.pending
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
