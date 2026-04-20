import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-16 pt-14">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-sm text-[var(--lagoon-deep)] hover:underline mb-6 inline-block">
            ← Back to marketplace
          </Link>
          <div className="island-shell rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-2">Privacy Policy</h1>
            <p className="text-sm text-[var(--sea-ink-soft)] mb-8">Last updated: {new Date().getFullYear()}</p>

            <div className="prose prose-sm max-w-none space-y-6 text-[var(--sea-ink-soft)]">
              <section>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">1. Information We Collect</h2>
                <p>When you make a purchase, we collect your name, email address, phone number, and delivery address. This information is used solely to process your order and deliver your download link.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">2. How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>To process your payment via Xendit</li>
                  <li>To deliver your purchase via email</li>
                  <li>To respond to support inquiries</li>
                  <li>To maintain order records</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">3. Data Storage</h2>
                <p>Order information including your name, email, and purchase details are stored in our secure system. We do not store your payment card information — all payment data is handled by Xendit.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">4. Third-Party Services</h2>
                <p>We use Xendit for payment processing. Their privacy policy governs the handling of your payment data. We may also use analytics tools to understand site usage patterns.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">5. Data Sharing</h2>
                <p>We do not sell, trade, or rent your personal information to third parties. Your data is only shared with service providers necessary to complete your purchase.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">6. Your Rights</h2>
                <p>You have the right to request access to, correction of, or deletion of your personal data. Contact us to exercise these rights.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">7. Contact</h2>
                <p>For any privacy-related questions, please reach out to us through the contact information on our website.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
