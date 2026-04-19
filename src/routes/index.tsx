import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { DocumentCard } from '#/components/DocumentCard'

const getDocuments = createServerFn().handler(async () => {
  const { prisma } = await import('#/db')
  return prisma.document.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
})

export const Route = createFileRoute('/')({
  loader: () => getDocuments(),
  component: StorefrontPage,
})

function StorefrontPage() {
  const documents = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-16 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 mb-10">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">Document Marketplace</p>
        <h1 className="display-title mb-4 text-4xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          Ready-to-use documents
        </h1>
        <p className="mb-0 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Browse our collection of professional documents. Purchase and download instantly after payment.
        </p>
      </section>

      {documents.length === 0 ? (
        <div className="text-center py-20 text-[var(--sea-ink-soft)]">
          <p className="text-lg font-medium mb-2">No documents listed yet.</p>
          <p className="text-sm">Run <code className="font-mono bg-[rgba(23,58,64,0.08)] px-2 py-0.5 rounded">npm run db:seed</code> or add documents via the admin panel.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              index={i}
            />
          ))}
        </div>
      )}
    </main>
  )
}
