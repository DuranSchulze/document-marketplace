import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NomineeFailedPage() {
  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-16 pt-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="island-shell rounded-2xl p-10">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-3">Payment Setup Failed</h1>
            <p className="text-[var(--sea-ink-soft)] mb-8">
              We couldn't set up your recurring payment. No charges were made. Please try again.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/nominees" className="rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90">
                Try Again
              </Link>
              <Link href="/" className="text-sm text-[var(--lagoon-deep)] hover:underline">
                Back to marketplace
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
