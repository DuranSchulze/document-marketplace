import { Badge } from '#/components/ui/badge'
import type { Order } from '#/lib/schemas'

const config: Record<Order['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-800 border-green-200' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' },
}

export function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const { label, className } = config[status] ?? config.pending
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
