import DOMPurify from 'isomorphic-dompurify'

/**
 * Whitelist-based sanitization for rich-text fields authored in the admin
 * TipTap editor and rendered on public pages via `dangerouslySetInnerHTML`.
 *
 * The allow-list mirrors the formatting marks/nodes our TipTap config exposes
 * (StarterKit + Link). Anything not on the list — including <script>, <img>,
 * <iframe>, inline event handlers, and `javascript:` URLs — is stripped.
 *
 * Why server-side: the document detail page is an RSC, so sanitization runs
 * once during render and the browser never sees raw author HTML. This also
 * keeps the bundle smaller (DOMPurify isn't shipped to the client).
 */
const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'a',
]

const ALLOWED_ATTR = ['href', 'target', 'rel']

// Permit only safe URL schemes. Notably blocks `javascript:` and `data:` to
// prevent XSS via a poisoned link.
const ALLOWED_URI_REGEXP = /^(https?:|mailto:|tel:|#|\/)/i

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    // No comments, no DOM clobbering surface.
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  })
}
