import { NextRequest, NextResponse } from 'next/server'

const SECURITY_HEADERS: Record<string, string> = {
  // Prevent the page from being framed (clickjacking protection).
  'X-Frame-Options': 'DENY',
  // Disable MIME-type sniffing.
  'X-Content-Type-Options': 'nosniff',
  // Don't leak full URL on outbound navigation.
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Reject any browser feature we don't actually use.
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  // Better Auth cookies are HttpOnly + Secure already; HSTS guarantees the
  // cookie is never sent over plaintext in production.
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // ── Cheap admin pre-filter ─────────────────────────────────────────────────
  // SECURITY NOTE: this only checks cookie *presence*, not validity. The real
  // gate is `requireAdminPage()` in app/admin/(protected)/layout.tsx and
  // `requireAdminApi()` in every /api/admin/* route handler. Edge middleware
  // can't talk to the DB cheaply, so this just avoids a server roundtrip on
  // obviously-unauthenticated requests.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie =
      request.cookies.get('docmarket.session_token') ??
      request.cookies.get('docmarket.session_token_http_only')

    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('reason', 'expired')
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Apply security headers to every response ───────────────────────────────
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    // HSTS only meaningful over HTTPS. Skip in dev so localhost http still works.
    if (name === 'Strict-Transport-Security' && process.env.NODE_ENV !== 'production') {
      continue
    }
    response.headers.set(name, value)
  }

  return response
}

export const config = {
  // Run on every page request; skip Next internals + static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
