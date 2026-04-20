import { prisma } from '@/db'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { NomineesForm } from './NomineesForm'

export default async function NomineesPage() {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { amount: 'asc' },
    select: { id: true, name: true, description: true, amount: true, intervalCount: true },
  })

  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-16 pt-14">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <p className="island-kicker mb-2">Subscription</p>
            <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-2">Nominee Registration</h1>
            <p className="text-[var(--sea-ink-soft)]">
              Fill in your details and choose a subscription plan. You'll be redirected to complete your payment setup.
            </p>
          </div>
          <NomineesForm plans={plans} />
        </div>
      </main>
      <Footer />
    </>
  )
}
