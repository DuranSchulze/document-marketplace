import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NomineeSuccessPage() {
  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-16 pt-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="island-shell rounded-2xl p-10">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-3">Subscription Active!</h1>
            <p className="text-[var(--sea-ink-soft)] mb-6">
              Your payment method has been authorized. Your subscription is now active and will auto-renew each month.
            </p>
            <p className="text-sm text-[var(--sea-ink-soft)] mb-8">
              A confirmation has been sent to your email address.
            </p>
            <Link href="/" className="inline-block rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
