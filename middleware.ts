import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Lightweight cookie presence check — actual session/role verification
    // happens server-side in requireAdminApi for API routes and in the
    // admin layout's server-side data fetching.
    const sessionCookie =
      request.cookies.get('docmarket.session_token') ??
      request.cookies.get('docmarket.session_token_http_only')

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
