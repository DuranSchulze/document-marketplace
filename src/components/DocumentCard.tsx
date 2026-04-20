import Link from 'next/link'

interface DocumentLike {
  id: string
  title: string
  description: string
  price: number
  category: string
  thumbnailUrl?: string | null
}

interface Props {
  document: DocumentLike
  index?: number
}

export function DocumentCard({ document, index = 0 }: Props) {
  return (
    <article
      className="island-shell feature-card rise-in rounded-2xl overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {document.thumbnailUrl ? (
        <img
          src={document.thumbnailUrl}
          alt={document.title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-[rgba(79,184,178,0.1)] flex items-center justify-center">
          <svg className="w-12 h-12 text-[var(--lagoon-deep)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.14)] rounded-full px-2.5 py-0.5 mb-3 self-start">
          {document.category}
        </span>

        <h2 className="font-semibold text-[var(--sea-ink)] mb-2 line-clamp-2">{document.title}</h2>
        <p className="text-sm text-[var(--sea-ink-soft)] line-clamp-3 mb-4 flex-1">{document.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(23,58,64,0.08)]">
          <span className="font-bold text-[var(--sea-ink)]">
            ₱{document.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </span>
          <Link
            href={`/documents/${document.id}`}
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-1.5 text-xs font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
