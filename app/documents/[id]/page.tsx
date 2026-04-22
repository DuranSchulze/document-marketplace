import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/db'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { sanitizeRichText } from '@/lib/sanitize'
import { DocumentPreview } from './DocumentPreview'

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const document = await prisma.document.findUnique({ where: { id } })
  if (!document || !document.isActive) notFound()

  const descriptionHtml = sanitizeRichText(document.description)

  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-16 pt-14">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-sm text-[var(--lagoon-deep)] hover:underline mb-6 inline-block">
            ← Back to marketplace
          </Link>

          <div className="island-shell rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* LEFT — preview (3/5) */}
              <div className="lg:col-span-3 p-6 lg:p-8 bg-[var(--foam)]">
                {document.driveFileId ? (
                  <DocumentPreview driveFileId={document.driveFileId} title={document.title} />
                ) : document.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={document.thumbnailUrl}
                    alt={document.title}
                    className="w-full h-auto rounded-xl border border-[rgba(23,58,64,0.12)]"
                  />
                ) : (
                  <div className="aspect-[3/4] w-full rounded-xl border border-dashed border-[rgba(23,58,64,0.16)] flex items-center justify-center text-sm text-[var(--sea-ink-soft)]">
                    No preview available
                  </div>
                )}
              </div>

              {/* RIGHT — details + CTA (2/5) */}
              <div className="lg:col-span-2 p-6 lg:p-8 lg:border-l border-[rgba(23,58,64,0.08)] flex flex-col">
                <span className="inline-block self-start text-xs font-semibold uppercase tracking-wider text-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.14)] rounded-full px-3 py-1 mb-4">
                  {document.category}
                </span>

                <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-4 leading-tight">
                  {document.title}
                </h1>

                {/* Rich description: authored in TipTap, sanitized server-side
                    via DOMPurify before reaching the DOM. Old plain-text
                    descriptions render through unchanged. */}
                {descriptionHtml && (
                  <div
                    className="prose prose-sm max-w-none text-[var(--sea-ink-soft)] mb-8 prose-headings:text-[var(--sea-ink)] prose-strong:text-[var(--sea-ink)] prose-a:text-[var(--lagoon-deep)]"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                )}

                {/* Price + Buy Now pinned to the bottom of the column on
                    desktop; flows naturally on mobile. */}
                <div className="mt-auto border-t border-[rgba(23,58,64,0.1)] pt-6">
                  <p className="text-sm text-[var(--sea-ink-soft)] mb-1">Price</p>
                  <p className="text-3xl font-bold text-[var(--sea-ink)] mb-5">
                    ₱{document.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </p>
                  <Link
                    href={`/checkout/${document.id}`}
                    className="block text-center w-full rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
