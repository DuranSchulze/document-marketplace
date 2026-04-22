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

const SELF_CLOSING_TAGS = new Set(['br'])

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sanitizeTextSegment(text: string): string {
  return escapeHtml(text)
}

function sanitizeAttributeValue(tagName: string, attrName: string, rawValue: string): string | null {
  const value = rawValue.trim()

  if (!ALLOWED_ATTR.includes(attrName)) return null

  if (attrName === 'href') {
    if (!ALLOWED_URI_REGEXP.test(value)) return null
    return escapeHtml(value)
  }

  if (attrName === 'target') {
    return value === '_blank' ? '_blank' : null
  }

  if (attrName === 'rel') {
    if (tagName !== 'a') return null
    const relTokens = value
      .split(/\s+/)
      .filter(Boolean)
      .filter((token) => token === 'noopener' || token === 'noreferrer')

    return relTokens.length > 0 ? relTokens.join(' ') : null
  }

  return null
}

function sanitizeTag(rawTag: string): string {
  const tagMatch = rawTag.match(/^<\s*(\/)?\s*([a-z0-9]+)([^>]*)>$/i)
  if (!tagMatch) return ''

  const [, slash, rawTagName, rawAttrs] = tagMatch
  const tagName = rawTagName.toLowerCase()

  if (!ALLOWED_TAGS.includes(tagName)) return ''

  if (slash) {
    return `</${tagName}>`
  }

  const attrs: string[] = []
  const attrPattern = /([a-zA-Z0-9:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g

  for (const match of rawAttrs.matchAll(attrPattern)) {
    const attrName = match[1]?.toLowerCase()
    const attrValue = match[3] ?? match[4] ?? match[5] ?? ''
    if (!attrName) continue
    const sanitizedValue = sanitizeAttributeValue(tagName, attrName, attrValue)
    if (sanitizedValue === null) continue
    attrs.push(`${attrName}="${sanitizedValue}"`)
  }

  const serializedAttrs = attrs.length > 0 ? ` ${attrs.join(' ')}` : ''
  return SELF_CLOSING_TAGS.has(tagName) ? `<${tagName}${serializedAttrs}>` : `<${tagName}${serializedAttrs}>`
}

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return ''

  return html.replace(/<[^>]*>|[^<]+/g, (segment) => {
    if (!segment.startsWith('<')) {
      return sanitizeTextSegment(segment)
    }

    if (/^<\s*!--/i.test(segment)) {
      return ''
    }

    return sanitizeTag(segment)
  })
}
