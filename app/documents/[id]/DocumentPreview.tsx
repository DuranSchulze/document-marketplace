'use client'

import { useState } from 'react'

interface Props {
  driveFileId: string
  title: string
}

/**
 * Public first-page preview of a document.
 *
 * Strategy: embed Drive's own viewer (`/file/d/{id}/preview`) inside a
 * height-constrained container so only the first page is visible, then layer
 * a watermark + interaction blocker on top. The viewer works for any file
 * shared as `anyone: reader` (which is what `uploadFileToDrive` configures
 * automatically), so no auth or proxying is needed — visitors see the
 * preview straight from Google's CDN.
 *
 * Hardening (best-effort, not real DRM — anyone determined can screenshot):
 *  - The iframe is wrapped in a container with `pointer-events-none` so the
 *    user can't scroll inside the viewer, can't click Drive's "Open in new
 *    tab" / "Download" buttons (which sit in the toolbar at the top-right),
 *    and can't right-click into the PDF context menu.
 *  - Container has `overflow: hidden` and a fixed page-aspect height — the
 *    viewer loads showing page 1 and there's no way to advance past it.
 *  - A solid bottom gradient covers Drive's bottom toolbar (where the
 *    "open in Drive" link lives).
 *  - A tiled rotated watermark sits above the iframe so any screenshot still
 *    carries the marketplace branding.
 *  - `onContextMenu` and `onDragStart` are suppressed at the wrapper.
 */
export function DocumentPreview({ driveFileId, title }: Props) {
  const [loaded, setLoaded] = useState(false)

  const previewUrl = `https://drive.google.com/file/d/${driveFileId}/preview`

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-[rgba(23,58,64,0.12)] bg-[var(--foam)] select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      aria-label={`Preview of ${title}`}
    >
      {/* Aspect-locked stage so only ~one page shows. 8.5:11 is US Letter;
          A4 (1:√2) is close enough for the visual. */}
      <div className="relative w-full" style={{ aspectRatio: '8.5 / 11' }}>
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-[rgba(23,58,64,0.04)] animate-pulse">
            <span className="text-sm text-[var(--sea-ink-soft)]">Loading preview…</span>
          </div>
        )}

        {/* Drive viewer — covers the full stage. We push it up slightly so
            Drive's top toolbar (with the "popout" arrow) clips outside the
            visible area. */}
        <iframe
          src={previewUrl}
          title={`Preview of ${title}`}
          onLoad={() => setLoaded(true)}
          // pointer-events-none kills scroll + clicks inside the iframe so
          // users can't reach Drive's download/popout buttons or scroll past
          // page 1. They can still see the rendered page perfectly.
          className="absolute inset-x-0 -top-10 h-[calc(100%+5rem)] w-full pointer-events-none border-0"
          // sandbox without `allow-same-origin` would break the viewer; we
          // keep scripts but rely on the pointer-events lock for blocking.
          allow=""
        />

        {/* Transparent overlay — defense-in-depth above pointer-events:none */}
        <div className="absolute inset-0 z-10" aria-hidden="true" />

        {/* Tiled watermark */}
        {loaded && (
          <div
            className="absolute inset-0 z-20 flex flex-wrap content-start justify-start gap-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 opacity-25 mix-blend-multiply"
                style={{
                  width: '33.3333%',
                  height: '120px',
                  transform: 'rotate(-22deg)',
                  color: 'var(--sea-ink)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  paddingLeft: '24px',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Preview · Purchase to download</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom gradient + label that also covers Drive's bottom toolbar */}
        <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none" aria-hidden="true">
          <div className="h-32 bg-gradient-to-t from-white via-white/95 to-transparent" />
          <div className="bg-white/95 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
            First-page preview only · Purchase to unlock the full document
          </div>
        </div>
      </div>
    </div>
  )
}
