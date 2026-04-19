import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/payment/failed')({
  validateSearch: z.object({
    orderId: z.string().optional(),
    documentId: z.string().optional(),
  }),
  component: FailedPage,
})

function FailedPage() {
  const { documentId } = Route.useSearch()

  return (
    <main className="page-wrap px-4 pb-16 pt-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="island-shell rounded-2xl p-10">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-3">Payment Failed</h1>
          <p className="text-[var(--sea-ink-soft)] mb-8">
            Your payment was not completed. No charges were made. Please try again.
          </p>

          <div className="flex flex-col gap-3">
            {documentId && (
              <Link
                to="/checkout/$id"
                params={{ id: documentId }}
                className="rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Try Again
              </Link>
            )}
            <Link to="/" className="text-sm text-[var(--lagoon-deep)] hover:underline">
              Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
