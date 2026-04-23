import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SubscribeSuccessPage() {
  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-16 pt-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="island-shell rounded-2xl p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mb-3 text-2xl font-bold text-[var(--sea-ink)]">Subscription Setup Complete</h1>
            <p className="mb-6 text-[var(--sea-ink-soft)]">
              Your subscription setup was completed through Xendit. We will update your subscription status once confirmation is received.
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
