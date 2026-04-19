import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/payment/success')({
  validateSearch: z.object({ orderId: z.string().optional() }),
  component: SuccessPage,
})

function SuccessPage() {
  const { orderId } = Route.useSearch()
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [polling, setPolling] = useState(true)

  useEffect(() => {
    if (!orderId) { setPolling(false); return }

    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const order: { status: string; downloadUrl: string | null } = await res.json()
          if (order.status === 'paid' && order.downloadUrl) {
            setDownloadUrl(order.downloadUrl)
            setPolling(false)
            clearInterval(interval)
          }
        }
      } catch { /* ignore */ }

      if (attempts >= 12) { setPolling(false); clearInterval(interval) }
    }, 5000)

    return () => clearInterval(interval)
  }, [orderId])

  return (
    <main className="page-wrap px-4 pb-16 pt-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="island-shell rounded-2xl p-10">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-3">Payment Successful!</h1>
          <p className="text-[var(--sea-ink-soft)] mb-6">
            Thank you for your purchase. A download link has been sent to your email address.
          </p>

          {polling && !downloadUrl && (
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--sea-ink-soft)] mb-6">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Preparing your download link…
            </div>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              className="inline-block rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90 mb-4"
            >
              Download Now
            </a>
          )}

          {!polling && !downloadUrl && (
            <p className="text-sm text-[var(--sea-ink-soft)] mb-6">
              Your download link will be emailed shortly. Please check your inbox.
            </p>
          )}

          <Link to="/" className="block text-sm text-[var(--lagoon-deep)] hover:underline mt-4">
            Back to marketplace
          </Link>
        </div>
      </div>
    </main>
  )
}
