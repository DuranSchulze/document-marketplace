import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getDocument = createServerFn()
  .handler(async ({ data }: { data: string }) => {
    const { prisma } = await import('#/db')
    const document = await prisma.document.findUnique({ where: { id: data } })
    if (!document || !document.isActive) throw notFound()
    return document
  })

export const Route = createFileRoute('/documents/$id')({
  loader: ({ params }) => getDocument({ data: params.id }),
  notFoundComponent: () => (
    <main className="page-wrap px-4 pb-16 pt-20 text-center">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-4">Document not found</h1>
      <Link to="/" className="text-[var(--lagoon-deep)] underline">Back to marketplace</Link>
    </main>
  ),
  component: DocumentDetailPage,
})

function DocumentDetailPage() {
  const document = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-16 pt-14">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-[var(--lagoon-deep)] hover:underline mb-6 inline-block">
          ← Back to marketplace
        </Link>

        <div className="island-shell rounded-2xl overflow-hidden">
          {document.thumbnailUrl && (
            <img
              src={document.thumbnailUrl}
              alt={document.title}
              className="w-full h-56 object-cover"
            />
          )}
          <div className="p-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.14)] rounded-full px-3 py-1 mb-4">
              {document.category}
            </span>
            <h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-4">{document.title}</h1>
            <p className="text-[var(--sea-ink-soft)] mb-8 leading-relaxed">{document.description}</p>

            <div className="flex items-center justify-between border-t border-[rgba(23,58,64,0.1)] pt-6">
              <div>
                <p className="text-sm text-[var(--sea-ink-soft)] mb-1">Price</p>
                <p className="text-3xl font-bold text-[var(--sea-ink)]">
                  ₱{document.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Link
                to="/checkout/$id"
                params={{ id: document.id }}
                className="rounded-full bg-[var(--lagoon-deep)] px-8 py-3 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
