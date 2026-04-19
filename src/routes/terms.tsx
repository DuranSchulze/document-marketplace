import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <main className="page-wrap px-4 pb-16 pt-14">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm text-[var(--lagoon-deep)] hover:underline mb-6 inline-block">
          ← Back to marketplace
        </Link>
        <div className="island-shell rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-[var(--sea-ink-soft)] mb-8">Last updated: {new Date().getFullYear()}</p>

          <div className="prose prose-sm max-w-none space-y-6 text-[var(--sea-ink-soft)]">
            <section>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">1. Acceptance of Terms</h2>
              <p>By accessing and purchasing from DocMarket, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">2. Digital Products</h2>
              <p>All products sold on DocMarket are digital documents delivered via a secure download link. Due to the nature of digital goods, all sales are final. No refunds will be issued once a download link has been generated and delivered.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">3. License</h2>
              <p>Upon purchase, you are granted a non-exclusive, non-transferable license to use the document for personal or internal business purposes. You may not resell, redistribute, or sublicense the document to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">4. Payment</h2>
              <p>Payments are processed securely through Xendit. DocMarket does not store your payment card information. By completing a purchase you agree to Xendit's terms of service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">5. Download Links</h2>
              <p>Download links are valid for 72 hours from the time of purchase. Please ensure you download your document within this window. Contact support if your link has expired.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">6. Limitation of Liability</h2>
              <p>DocMarket provides documents "as is" without warranty of any kind. We are not liable for any damages arising from the use of purchased documents.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">7. Changes to Terms</h2>
              <p>We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
