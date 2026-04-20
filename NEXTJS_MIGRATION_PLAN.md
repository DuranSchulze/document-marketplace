# Migration Plan: TanStack Start → Next.js 15 (App Router)

**Reason:** TanStack Start + Nitro has proven unstable on Vercel — repeated serverless
function failures, hashed module path issues, and no reliable official Vercel adapter.
Next.js 15 is Vercel-native, zero-config deploy, and supports all libraries currently in
use (Better Auth, Prisma, shadcn/ui, TanStack Query, PostHog).

**Goal:** Preserve every feature — storefront, checkout, payments, downloads, admin panel,
Google Drive/Sheets, email, and analytics — with no regressions.

---

## Feature Checklist (do not lose any of these)

- [ ] Public storefront (browse & filter documents)
- [ ] Document detail page
- [ ] Buyer checkout form
- [ ] Xendit payment invoice creation
- [ ] Xendit webhook → order fulfillment
- [ ] Payment success / failure pages with order polling
- [ ] JWT download token (72-hour expiry)
- [ ] Secure file download via Google Drive redirect
- [ ] Admin login (email + password via Better Auth)
- [ ] Admin dashboard — CRUD documents, file upload to Google Drive
- [ ] Admin orders view
- [ ] Google Drive integration (upload, folder auto-creation)
- [ ] Google Sheets integration (customer record append)
- [ ] Email on successful payment (Nodemailer)
- [ ] Google integration status banner
- [ ] Admin idle timeout / session expiry guard
- [ ] Light / dark / auto theme
- [ ] PostHog analytics
- [ ] All environment variables preserved

---

## Tech Stack Mapping

| Current (TanStack Start)             | Next.js Equivalent                          |
|--------------------------------------|---------------------------------------------|
| `@tanstack/react-start`              | `next` 15                                   |
| `createFileRoute` + file-based routes| App Router (`app/` directory)               |
| Route `loader()` functions           | Server Components + `async` page props      |
| Route `server.handlers`              | Route Handlers (`route.ts`)                 |
| `_admin.tsx` layout + guard          | `app/admin/layout.tsx` + `middleware.ts`    |
| `__root.tsx`                         | `app/layout.tsx`                            |
| `@tanstack/react-router`             | Next.js `Link`, `useRouter`, `useParams`    |
| `@tanstack/react-query`              | Keep as-is (works with Next.js)             |
| `@tanstack/react-form`               | Keep as-is (works with Next.js)             |
| `better-auth` + TanStack plugin      | `better-auth` + Next.js plugin              |
| `prisma` + `@prisma/adapter-pg`      | Keep as-is                                  |
| shadcn/ui components                 | Keep as-is (originally built for Next.js)   |
| `next-themes`                        | Keep as-is (already installed)              |
| `@t3-oss/env-core`                   | Keep as-is (or swap to `@t3-oss/env-nextjs`)|
| `posthog-js` + `@posthog/react`      | Keep as-is (add `'use client'` wrapper)     |
| Tailwind CSS v4                      | Keep as-is                                  |
| `googleapis`, `nodemailer`, `xendit` | Keep as-is (server-only imports)            |
| `jsonwebtoken`                       | Keep as-is                                  |
| `VITE_*` env vars                    | Rename to `NEXT_PUBLIC_*`                   |

---

## New Project Structure

```
document-marketplace-next/
├── app/
│   ├── layout.tsx                        ← __root.tsx
│   ├── page.tsx                          ← src/routes/index.tsx
│   ├── documents/
│   │   └── [id]/
│   │       └── page.tsx                  ← src/routes/documents/$id.tsx
│   ├── checkout/
│   │   └── [id]/
│   │       └── page.tsx                  ← src/routes/checkout/$id.tsx
│   ├── payment/
│   │   ├── success/
│   │   │   └── page.tsx                  ← src/routes/payment/success.tsx
│   │   └── failed/
│   │       └── page.tsx                  ← src/routes/payment/failed.tsx
│   ├── privacy/
│   │   └── page.tsx                      ← src/routes/privacy.tsx
│   ├── terms/
│   │   └── page.tsx                      ← src/routes/terms.tsx
│   ├── admin/
│   │   ├── layout.tsx                    ← src/routes/_admin.tsx
│   │   ├── login/
│   │   │   └── page.tsx                  ← src/routes/admin/login.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx                  ← src/routes/_admin/admin/dashboard.tsx
│   │   ├── documents/
│   │   │   ├── new/
│   │   │   │   └── page.tsx              ← src/routes/_admin/admin/documents/new.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx          ← src/routes/_admin/admin/documents/$id/edit.tsx
│   │   └── orders/
│   │       └── page.tsx                  ← src/routes/_admin/admin/orders.tsx
│   └── api/
│       ├── auth/
│       │   └── [...all]/
│       │       └── route.ts              ← src/routes/api/auth/$.ts
│       ├── payment/
│       │   ├── create-invoice/
│       │   │   └── route.ts              ← src/routes/api/payment/create-invoice.ts
│       │   └── webhook/
│       │       └── route.ts              ← src/routes/api/payment/webhook.ts
│       ├── orders/
│       │   └── [id]/
│       │       └── route.ts              ← src/routes/api/orders/$id.ts
│       ├── download/
│       │   └── [token]/
│       │       └── route.ts              ← src/routes/api/download/$token.ts
│       └── admin/
│           ├── documents/
│           │   ├── route.ts              ← src/routes/api/admin/documents/index.ts
│           │   └── [id]/
│           │       └── route.ts          ← src/routes/api/admin/documents/$id.ts
│           ├── orders/
│           │   └── route.ts              ← src/routes/api/admin/orders/index.ts
│           ├── upload/
│           │   └── route.ts              ← src/routes/api/admin/upload.ts
│           ├── google-status/
│           │   └── route.ts              ← src/routes/api/admin/google-status.ts
│           └── sheets-test-write/
│               └── route.ts              ← src/routes/api/admin/sheets-test-write.ts
├── components/
│   ├── ui/                               ← src/components/ui/* (copy as-is)
│   ├── DocumentCard.tsx                  ← keep
│   ├── DocumentForm.tsx                  ← keep
│   ├── AdminSidebar.tsx                  ← keep
│   ├── Header.tsx                        ← keep
│   ├── Footer.tsx                        ← keep
│   ├── GoogleStatusBanner.tsx            ← keep
│   ├── IdleTimeoutWatcher.tsx            ← keep
│   ├── ThemeToggle.tsx                   ← keep
│   └── OrderStatusBadge.tsx              ← keep
├── lib/
│   ├── auth.ts                           ← src/lib/auth.ts (change plugin)
│   ├── auth-client.ts                    ← src/lib/auth-client.ts (keep)
│   ├── admin-guard.ts                    ← src/lib/admin-guard.ts (adapt)
│   ├── xendit.ts                         ← src/lib/xendit.ts (keep)
│   ├── drive.ts                          ← src/lib/drive.ts (keep)
│   ├── sheets.ts                         ← src/lib/sheets.ts (keep)
│   ├── mailer.ts                         ← src/lib/mailer.ts (keep)
│   ├── download-token.ts                 ← src/lib/download-token.ts (keep)
│   └── schemas.ts                        ← src/lib/schemas.ts (keep)
├── db.ts                                 ← src/db.ts (keep)
├── env.ts                                ← src/env.ts (update VITE_ → NEXT_PUBLIC_)
├── middleware.ts                         ← NEW: protects /admin/* routes
├── prisma/
│   └── schema.prisma                     ← keep as-is
├── public/                               ← static assets
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 1 — Project Bootstrap

### 1.1 Create the Next.js app

```bash
npx create-next-app@latest document-marketplace-next \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

### 1.2 Install all dependencies

```bash
# Core dependencies to keep
npm install \
  better-auth \
  @prisma/client @prisma/adapter-pg \
  googleapis \
  nodemailer \
  jsonwebtoken \
  @t3-oss/env-nextjs \
  zod \
  next-themes \
  posthog-js @posthog/react \
  @tanstack/react-query @tanstack/react-query-devtools \
  @tanstack/react-form \
  @tanstack/react-table \
  sonner \
  lucide-react \
  clsx tailwind-merge class-variance-authority \
  @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-label \
  @radix-ui/react-slot \
  @hugeicons/react @hugeicons/core-free-icons \
  @fontsource-variable/figtree @fontsource-variable/manrope

# Dev dependencies
npm install -D \
  prisma \
  typescript @types/node @types/react @types/react-dom \
  @types/jsonwebtoken @types/nodemailer \
  @faker-js/faker \
  dotenv-cli
```

### 1.3 Copy unchanged files

These files require **zero changes** — copy directly:

- `prisma/schema.prisma`
- `src/lib/xendit.ts` → `lib/xendit.ts`
- `src/lib/drive.ts` → `lib/drive.ts`
- `src/lib/sheets.ts` → `lib/sheets.ts`
- `src/lib/mailer.ts` → `lib/mailer.ts`
- `src/lib/download-token.ts` → `lib/download-token.ts`
- `src/lib/schemas.ts` → `lib/schemas.ts`
- `src/lib/auth-client.ts` → `lib/auth-client.ts`
- `src/db.ts` → `db.ts`
- `src/components/ui/*` → `components/ui/*`
- `src/components/DocumentCard.tsx` → `components/DocumentCard.tsx`
- `src/components/DocumentForm.tsx` → `components/DocumentForm.tsx`
- `src/components/AdminSidebar.tsx` → `components/AdminSidebar.tsx`
- `src/components/Header.tsx` → `components/Header.tsx`
- `src/components/Footer.tsx` → `components/Footer.tsx`
- `src/components/GoogleStatusBanner.tsx` → `components/GoogleStatusBanner.tsx`
- `src/components/IdleTimeoutWatcher.tsx` → `components/IdleTimeoutWatcher.tsx`
- `src/components/ThemeToggle.tsx` → `components/ThemeToggle.tsx`
- `src/components/OrderStatusBadge.tsx` → `components/OrderStatusBadge.tsx`
- `public/*` static assets

---

## Phase 2 — Configuration Files

### 2.1 `next.config.ts`

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'nodemailer', 'googleapis'],
}

export default config
```

### 2.2 `env.ts` (update `@t3-oss/env-nextjs`, rename VITE_ → NEXT_PUBLIC_)

```ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    SERVER_URL: z.string().url().optional(),
    XENDIT_SECRET_KEY: z.string().min(1),
    XENDIT_WEBHOOK_TOKEN: z.string().min(1),
    GOOGLE_DRIVE_ROOT_FOLDER_ID: z.string().min(1),
    GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email(),
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1),
    GOOGLE_SHEETS_ID: z.string().min(1),
    DOWNLOAD_TOKEN_SECRET: z.string().min(32),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM: z.string().email(),
    ADMIN_EMAIL: z.string().email().optional(),
    ADMIN_PASSWORD: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_TITLE: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    // ... map all variables
    NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
})
```

> **Note:** Update `.env` / Vercel environment variables: rename `VITE_POSTHOG_KEY` → `NEXT_PUBLIC_POSTHOG_KEY`, etc.

### 2.3 `middleware.ts` (replaces `_admin.tsx` session guard)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'   // or use Better Auth's getSession helper

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## Phase 3 — Authentication Migration

Better Auth has first-class Next.js support.

### 3.1 `lib/auth.ts` — change plugin

```ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'   // ← replaces tanstackStartCookies
import { prisma } from '@/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true, disableSignUp: true },
  session: {
    expiresIn: 60 * 60 * 24,         // 24 hours
    updateAge: 0,                      // no sliding refresh
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  advanced: { cookiePrefix: 'docmarket' },
  plugins: [nextCookies()],           // ← only this line changes
})
```

### 3.2 `app/api/auth/[...all]/route.ts`

```ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```

### 3.3 `lib/admin-guard.ts` — server-side guard for Route Handlers

```ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function requireAdminApi() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return new Response('Unauthorized', { status: 401 })
  if (session.user.role !== 'admin') return new Response('Forbidden', { status: 403 })
  return null  // null = access granted
}
```

---

## Phase 4 — Route Migration

### Pattern differences

| TanStack Start | Next.js App Router |
|---|---|
| `createFileRoute('/path')({ component })` | `export default function Page()` |
| `route.loader()` for server data | `async` Server Component, fetch in the component |
| `useLoaderData()` | Props come from server component or `params`/`searchParams` |
| `<Link to="/path">` | `<Link href="/path">` from `next/link` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useParams()` | `useParams()` from `next/navigation` (client) or `params` prop (server) |
| `useSearch()` | `useSearchParams()` from `next/navigation` |

### 4.1 Public pages — example: `app/page.tsx` (storefront)

```tsx
// Server Component — fetch data directly
import { prisma } from '@/db'
import { DocumentCard } from '@/components/DocumentCard'

export default async function StorefrontPage() {
  const documents = await prisma.document.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })
  return (
    <main>
      {documents.map((doc) => <DocumentCard key={doc.id} document={doc} />)}
    </main>
  )
}
```

### 4.2 Pages that need client interactivity

Use `'use client'` only for interactive parts. Keep data fetching in parent Server Components and pass as props, or use TanStack Query for client-side polling (e.g., payment success page).

```tsx
// app/payment/success/page.tsx — needs polling, stays as client component
'use client'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
// ... same logic as current success.tsx
```

### 4.3 Admin pages

```tsx
// app/admin/layout.tsx — wraps all admin pages
// Middleware already guards auth, this just adds the sidebar UI
import { AdminSidebar } from '@/components/AdminSidebar'
import { IdleTimeoutWatcher } from '@/components/IdleTimeoutWatcher'
import { GoogleStatusBanner } from '@/components/GoogleStatusBanner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <GoogleStatusBanner />
        {children}
      </main>
      <IdleTimeoutWatcher />
    </div>
  )
}
```

---

## Phase 5 — API Route Migration

### Pattern: `src/routes/api/*.ts` → `app/api/*/route.ts`

TanStack Start `server.handlers.POST` becomes a Next.js named export:

**Before (TanStack Start):**
```ts
export const Route = createFileRoute('/api/payment/create-invoice')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // ...
        return Response.json({ paymentUrl })
      }
    }
  }
})
```

**After (Next.js):**
```ts
// app/api/payment/create-invoice/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // ...identical business logic...
  return Response.json({ paymentUrl })
}
```

**All API routes to migrate (business logic is copy-paste):**

| File | Handler(s) |
|------|-----------|
| `app/api/payment/create-invoice/route.ts` | `POST` |
| `app/api/payment/webhook/route.ts` | `POST` |
| `app/api/orders/[id]/route.ts` | `GET` |
| `app/api/download/[token]/route.ts` | `GET` (note: `params` is now `Promise<{token}>` in Next 15) |
| `app/api/admin/documents/route.ts` | `GET`, `POST` |
| `app/api/admin/documents/[id]/route.ts` | `PATCH`, `DELETE` |
| `app/api/admin/orders/route.ts` | `GET` |
| `app/api/admin/upload/route.ts` | `POST` |
| `app/api/admin/google-status/route.ts` | `GET` |
| `app/api/admin/sheets-test-write/route.ts` | `POST` |

> **Next.js 15 note:** Dynamic params are now `async` — use `const { id } = await params` instead of `params.id`.

---

## Phase 6 — Root Layout & Providers

### `app/layout.tsx` (replaces `__root.tsx`)

```tsx
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { PostHogProvider } from '@/components/PostHogProvider'
import { TanStackQueryProvider } from '@/components/TanStackQueryProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import '@fontsource-variable/figtree/index.css'
import '@fontsource-variable/manrope/index.css'
import './globals.css'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE ?? 'Document Marketplace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PostHogProvider>
            <TanStackQueryProvider>
              <Header />
              {children}
              <Footer />
              <Toaster />
            </TanStackQueryProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Client-side providers (must be `'use client'`)

Create `components/TanStackQueryProvider.tsx` and `components/PostHogProvider.tsx` as `'use client'` wrappers — same pattern as any Next.js app.

---

## Phase 7 — Deployment Config

### `vercel.json` (minimal — Next.js is auto-detected)

```json
{}
```

Or delete it entirely. Vercel auto-detects Next.js with zero config.

### Environment variables

Rename in Vercel dashboard:
- `VITE_POSTHOG_KEY` → `NEXT_PUBLIC_POSTHOG_KEY`
- `VITE_POSTHOG_HOST` → `NEXT_PUBLIC_POSTHOG_HOST`
- `VITE_APP_TITLE` → `NEXT_PUBLIC_APP_TITLE`

All other env vars stay exactly the same.

---

## Phase 8 — Remove TanStack Start Dependencies

After migration is complete, remove:

```bash
npm uninstall \
  @tanstack/react-start \
  @tanstack/react-router \
  @tanstack/router-plugin \
  @tanstack/devtools-vite \
  @tanstack/devtools-event-client \
  @tanstack/react-router-devtools \
  @tanstack/react-devtools \
  nitro \
  vite \
  @vitejs/plugin-react \
  @tailwindcss/vite
```

Keep:
- `@tanstack/react-query` ✅
- `@tanstack/react-form` ✅
- `@tanstack/react-table` ✅
- `@tanstack/react-query-devtools` ✅

---

## Migration Order (Recommended)

1. **Bootstrap** — create Next.js app, install deps, copy `prisma/`, `lib/`, `components/`
2. **Config** — `next.config.ts`, `env.ts`, Tailwind, global CSS
3. **Auth** — `lib/auth.ts`, `middleware.ts`, `/api/auth/[...all]/route.ts`
4. **API routes** — copy-paste all business logic from `server.handlers` into `route.ts`
5. **Root layout** — `app/layout.tsx` with all providers
6. **Public pages** — storefront, document detail, checkout, payment success/failed, privacy, terms
7. **Admin pages** — login, dashboard, document new/edit, orders
8. **Test locally** — `npm run dev`, verify every route and API endpoint
9. **Deploy to Vercel** — push, watch build logs, verify
10. **Cleanup** — remove old TanStack Start project or archive it

---

## Known Gotchas

| Issue | Solution |
|-------|----------|
| `params` is `Promise` in Next.js 15 | Use `const { id } = await params` in all route handlers and page components |
| Server-only imports in client components | Add `'server-only'` package to `lib/` files that use Prisma/env — prevents accidental client bundling |
| Better Auth session in Server Components | Use `auth.api.getSession({ headers: await headers() })` |
| File upload size limit | Set `export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }` in upload route |
| PostHog in App Router | Wrap in `'use client'` component, use `usePathname`/`useSearchParams` for pageview tracking |
| `next-themes` flash | `suppressHydrationWarning` on `<html>` (already shown above) |
| TanStack Form server actions | TanStack Form works fine with `fetch` calls to API routes — no changes needed |
| Google private key newlines | Keep `\n` handling in `lib/drive.ts` — no changes needed |

---

## What Does NOT Need to Change

- `prisma/schema.prisma` — identical
- All `lib/` files except `auth.ts` and `admin-guard.ts`
- All `components/` files (shadcn/ui is Next.js-native)
- All business logic in API handlers (copy verbatim)
- All database queries
- All external service calls (Xendit, Google Drive, Google Sheets, Nodemailer)
- JWT download token logic
- Xendit webhook verification
- Environment variable values (only 3 names change)
- Tailwind CSS config and custom theme
- Fonts

---

*Created: 2026-04-20 | Status: Ready to implement*
