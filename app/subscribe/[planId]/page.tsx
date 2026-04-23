import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/db'
import { SubscribeForm } from './SubscribeForm'

export const dynamic = 'force-dynamic'

export default async function SubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string }>
  searchParams: Promise<{ cancelled?: string }>
}) {
  const { planId } = await params
  const { cancelled } = await searchParams
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
    select: {
      id: true,
      name: true,
      description: true,
      amount: true,
      intervalCount: true,
      durationMonths: true,
      isActive: true,
    },
  })

  if (!plan || !plan.isActive) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-16 pt-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="pt-4">
            <p className="island-kicker mb-2">Subscription</p>
            <h1 className="mb-3 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
              {plan.name}
            </h1>
            <p className="mb-6 text-[var(--sea-ink-soft)]">
              {plan.description}
            </p>

            <div className="island-shell rounded-2xl p-6">
              <p className="text-sm font-semibold text-[var(--sea-ink-soft)]">Plan Summary</p>
              <p className="mt-3 text-3xl font-bold text-[var(--sea-ink)]">
                ₱{plan.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-5 grid gap-3 text-sm text-[var(--sea-ink-soft)]">
                <div className="flex items-center justify-between gap-4">
                  <span>Auto-debit</span>
                  <strong className="text-[var(--sea-ink)]">Monthly</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>For how long</span>
                  <strong className="text-[var(--sea-ink)]">{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Total monthly charges</span>
                  <strong className="text-[var(--sea-ink)]">{plan.durationMonths}</strong>
                </div>
              </div>
            </div>
          </section>

          <section>
            {cancelled && (
              <div className="admin-alert-warning mb-4 rounded-lg px-4 py-3 text-sm">
                Checkout was cancelled. You can continue again when ready.
              </div>
            )}
            <SubscribeForm planId={plan.id} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
