import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-sm font-semibold text-[var(--sea-ink)]">
              DocMarket
            </span>
            <p className="mt-1 max-w-xs text-xs leading-relaxed">
              Your trusted source for professional, ready-to-use documents.
              Purchase and download instantly after payment.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm sm:items-end">
            <Link href="/" className="transition hover:text-[var(--sea-ink)] no-underline">
              Home
            </Link>
            <a
              href="https://www.filepino.com/privacy-policy/"
              className="transition hover:text-[var(--sea-ink)] no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy and Terms &amp; Conditions
            </a>
          </nav>
        </div>

        <div className="my-8 border-t border-[var(--line)]" />

        <div className="flex flex-col items-center gap-3 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
          <p className="m-0">&copy; {year} DocMarket. All rights reserved.</p>
          <p className="m-0 flex items-center gap-1.5">
            Powered by
            <a
              href="https://xendit.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--sea-ink)] transition hover:text-[var(--lagoon-deep)] no-underline"
            >
              Xendit
            </a>
            <span>&amp;</span>
            <a
              href="https://filepino.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--sea-ink)] transition hover:text-[var(--lagoon-deep)] no-underline"
            >
              FilePino
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
