# DocMarket — Document Marketplace

A digital document marketplace built with **Next.js 15 (App Router)**. Customers browse and purchase document templates, nominees enroll in recurring subscription plans, and admins manage the catalog from a single panel.

---

## Recent Enhancements

This section summarizes the latest changes shipped to the system. Older architectural docs follow below.

### 1. Database — Prisma Postgres / Accelerate
- **Switched from raw `pg` driver to Prisma's HTTP transport.** `DATABASE_URL` now uses the `prisma+postgres://accelerate.prisma-data.net/...` scheme.
- The Prisma client is constructed with `accelerateUrl` (Prisma 7 requirement):
  ```ts
  new PrismaClient({ accelerateUrl: process.env.DATABASE_URL })
  ```
- Removed the `@prisma/adapter-pg` TCP driver — it was timing out (`ETIMEDOUT`) trying to open a socket against the HTTP endpoint.
- Files: [`src/db.ts`](src/db.ts), [`prisma/seed.ts`](prisma/seed.ts).

### 2. Google service-account key — base64 support
- The `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` env var can now be stored as **base64-encoded PEM** (Vercel-friendly — no more `\n` escaping headaches) **or** as a literal PEM with `\n`.
- Detection is automatic: if the value doesn't contain `-----BEGIN`, it's decoded from base64.
- Applied in `src/lib/sheets.ts`, `src/lib/drive.ts`, and `prisma/seed.ts`.

### 3. Subscriptions (Nominees) — full audit trail in Google Sheets
A second tab named **`Subscriptions`** is now provisioned and written to alongside the existing `Customers` tab.

| Tab | Tracks | Trigger |
|---|---|---|
| `Customers` | One row per **paid** document order | `/api/payment/webhook` on `status=PAID` |
| `Subscriptions` | One row per **subscription event** (attempts + status changes) | `/api/subscription/create` and `/api/subscription/webhook` |

Subscription columns (`A:K`):
`subscriptionId | planName | nomineeName | nomineeEmail | nomineePhone | nomineeAddress | paymentChannel | amount | status | event | recordedAt`

Events captured:

| When | status | event |
|---|---|---|
| Nominee submits enrollment form | `pending` | `created` |
| E-wallet authorized via Xendit | `active` | `payment_method_activated` |
| Recurring plan activated | `active` | `plan_activated` |
| Monthly auto-charge succeeds | `active` | `payment_succeeded` |
| Monthly charge fails | `failed` | `payment_failed` |
| Subscription cancelled / deactivated | `cancelled` | `plan_deactivated` |
| Recurring plan creation errored after auth | `failed` | `recurring_plan_create_failed` |

Re-running `bun run prisma/seed.ts` automatically:
- Creates any missing tabs (`Customers`, `Subscriptions`)
- Refreshes both header rows

Files: [`src/lib/sheets.ts`](src/lib/sheets.ts), [`app/api/subscription/create/route.ts`](app/api/subscription/create/route.ts), [`app/api/subscription/webhook/route.ts`](app/api/subscription/webhook/route.ts), [`prisma/seed.ts`](prisma/seed.ts).

### 4. Document form — UX improvements
- **Removed dropzone upload widget**, replaced with a single source of truth: paste a **Google Drive link or file ID**. The form auto-extracts the file ID via `extractGoogleDriveFileId()` from `src/lib/google-drive.ts`.
- **Inline file preview** — when a Drive file is linked, the form embeds Google Drive's native preview iframe (`https://drive.google.com/file/d/{id}/preview`). Toggleable via a "Show / Hide preview" button. Includes "Open in Drive ↗" deep link.
- **Price input fix** — no longer shows a leading `0`. The placeholder reads `0`, the value is empty until the user types. `inputMode="decimal"`, `min="0"`, `step="0.01"`.
- **Form is now centered** on both the **Add Document** (`/admin/documents/new`) and **Edit Document** (`/admin/documents/[id]/edit`) pages.
- **Stricter validation** — `DocumentFileFieldsSchema` in `src/lib/schemas.ts` requires either `driveFileId` or `driveFileUrl` plus `driveFileName`, preventing orphaned document records.

### 5. Admin sidebar — sticky + collapsible
- Sidebar is now `sticky top-0 h-screen` — pinned to the viewport while content scrolls.
- New **collapse / expand** chevron button. Collapsed width `w-16` (icon-only), expanded `w-56`.
- State persists across reloads via `localStorage` key `docmarket:sidebar-collapsed`.
- Hover tooltips on icons when collapsed (via native `title` attribute).
- File: [`src/components/AdminSidebar.tsx`](src/components/AdminSidebar.tsx).

### 6. Admin login — password visibility toggle
- Eye / eye-off icon button inside the password input toggles between `type="password"` and `type="text"`.
- Accessible: `aria-label`, `aria-pressed`, `tabIndex={-1}` (preserves form tab order).
- File: [`app/admin/login/AdminLoginForm.tsx`](app/admin/login/AdminLoginForm.tsx).

### 7. Drive utilities extracted
A new module [`src/lib/google-drive.ts`](src/lib/google-drive.ts) consolidates Drive helpers:
- `extractGoogleDriveFileId(input)` — parses any Drive URL or raw ID
- `getGoogleDriveDownloadUrl(fileId)` — returns the direct-download URL
- `normalizeGoogleDriveFile(input)` — fallback chain `ID → URL → filename` for validation

Used by `DocumentForm`, `src/lib/drive.ts`, and the admin documents API routes.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     STORAGE LAYERS                          │
├──────────────────┬──────────────────┬───────────────────────┤
│  Google Drive    │  Google Sheets   │  PostgreSQL (Prisma)  │
│  ─────────────   │  ─────────────── │  ────────────────────  │
│  Actual files    │  Customers tab:  │  Document catalog     │
│  Organized by    │   document       │  Orders               │
│  category folder │   purchases      │  SubscriptionPlans    │
│                  │  Subscriptions   │  Subscriptions        │
│                  │  tab: nominee    │  Auth (Better Auth)   │
│                  │   enrollments    │                       │
└──────────────────┴──────────────────┴───────────────────────┘
```

| Layer | Responsibility | Why |
|-------|---------------|-----|
| **Google Drive** | File storage | Native folder organization, direct download links, manual management |
| **Google Sheets** | Audit logs (Customers + Subscriptions) | Non-technical team can open a spreadsheet and see who bought / enrolled |
| **PostgreSQL / Prisma** | Catalog, orders, subscriptions, auth | Structured queries, sales reports, relational data |

---

## Google Drive Folder Structure

Files live under a root folder specified by `GOOGLE_DRIVE_ROOT_FOLDER_ID`:

```
DocMarket/                          ← root folder (share with service account as Editor)
  Legal/
    nda-template-2024.pdf
    employment-contract.pdf
  Business/
    business-plan-template.pdf
  Finance/
    invoice-template.xlsx
  HR/
    employee-handbook.pdf
```

- Folders are created automatically on first upload to each category.
- Each file gets `anyoneWithLink` reader permission so download (and the new admin form preview iframe) works without authentication.

---

## Google Sheets — Two Tabs

Create one spreadsheet, share it with the service account email (Editor access), then run the seed (`bun run prisma/seed.ts`) — it provisions both tabs automatically.

### `Customers` tab (document orders)

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| orderId | documentTitle | buyerName | buyerEmail | buyerPhone | buyerAddress | amount | purchasedAt |

Appended on every successful payment (Xendit webhook fires with `status=PAID`).

### `Subscriptions` tab (nominee enrollments)

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| subscriptionId | planName | nomineeName | nomineeEmail | nomineePhone | nomineeAddress | paymentChannel | amount | status | event | recordedAt |

Appended on every enrollment attempt and every status transition. The same `subscriptionId` repeats across rows so you can trace each nominee's journey.

---

## Prisma Models

```prisma
model Document {
  id            String   @id @default(cuid())
  title         String
  description   String
  price         Float
  category      String
  driveFileId   String
  driveFileName String
  driveFileUrl  String
  thumbnailUrl  String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  orders        Order[]
}

model Order {
  id               String    @id @default(cuid())
  documentId       String
  document         Document  @relation(...)
  documentTitle    String
  buyerName        String
  buyerEmail       String
  buyerPhone       String
  buyerAddress     String?
  amount           Float
  status           String    @default("pending")  // pending | paid | failed
  xenditInvoiceId  String?   @unique
  xenditPaymentUrl String?
  downloadToken    String?
  downloadUrl      String?
  createdAt        DateTime  @default(now())
  paidAt           DateTime?
}

model SubscriptionPlan {
  id            String         @id @default(cuid())
  name          String
  description   String
  amount        Float          // PHP per cycle
  intervalCount Int            // billing every N months
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  subscriptions Subscription[]
}

model Subscription {
  id                    String           @id
  planId                String
  plan                  SubscriptionPlan @relation(...)
  nomineeName           String
  nomineeEmail          String
  nomineePhone          String
  nomineeAddress        String?
  paymentChannel        String?          // GCASH | PAYMAYA
  xenditCustomerId      String?
  xenditPaymentMethodId String?          @unique
  xenditSubscriptionId  String?
  authUrl               String?
  status                String           @default("pending")  // pending | active | failed | cancelled
  activatedAt           DateTime?
  createdAt             DateTime         @default(now())
}
```

---

## One-time Document Purchase Flow

```
Customer fills checkout form
  → POST /api/payment/create-invoice
  → Prisma: create Order { status: "pending" }
  → Xendit: create PHP invoice
  → Return paymentUrl → redirect customer to Xendit hosted page

Customer pays on Xendit
  → Xendit: POST /api/payment/webhook (x-callback-token header)
  → Verify webhook token
  → Prisma: update Order { status: "paid", downloadUrl, paidAt }
  → Google Sheets: append row to "Customers" tab
  → Email customer download link

Customer clicks download link → GET /api/download/{jwt-token}
  → Verify JWT (72h expiry)
  → 302 redirect to Google Drive direct download URL
```

---

## Subscription (Nominee) Enrollment Flow

```
Nominee fills /nominees form (plan + name/email/phone + GCash/PayMaya)
  → POST /api/subscription/create
  → Xendit: createXenditCustomer
  → Xendit: createXenditPaymentMethod  → returns auth URL
  → Prisma: create Subscription { status: "pending" }
  → Google Sheets: append row to "Subscriptions" (status=pending, event=created)
  → Return authUrl → redirect nominee to e-wallet authorization

Nominee authorizes e-wallet on Xendit
  → Xendit: POST /api/subscription/webhook  (event: payment_method.activated)
  → Xendit: createXenditRecurringPlan
  → Prisma: update Subscription { status: "active", activatedAt }
  → Google Sheets: append row (status=active, event=payment_method_activated)

Monthly auto-charge by Xendit
  → Webhook fires recurring.plan.payment.succeeded / .failed / .deactivated
  → Prisma: update Subscription.status
  → Google Sheets: append corresponding event row
```

---

## Tech Stack

| Concern | Tool |
|---------|------|
| Framework | **Next.js 15** (App Router, React 19, deployed on Vercel) |
| Auth | Better Auth (email/password, admin role) |
| Database ORM | **Prisma 7** + Prisma Postgres (Accelerate HTTP transport) |
| File storage | Google Drive API (service account) |
| Audit log | Google Sheets API (`Customers` + `Subscriptions` tabs) |
| Payment (one-time) | Xendit invoices (PHP) |
| Payment (recurring) | Xendit Customer + Payment Method + Recurring Plan |
| Download tokens | JWT (72h expiry) |
| Email | Nodemailer (SMTP) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Forms | Native React state + Zod validation |
| Analytics | PostHog |

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

```env
# Prisma Postgres (HTTP transport via Accelerate)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

# Better Auth
BETTER_AUTH_SECRET=                     # 32+ random chars
BETTER_AUTH_URL=http://localhost:3000

# Xendit
XENDIT_SECRET_KEY=xnd_production_...
XENDIT_WEBHOOK_TOKEN=                   # from Xendit dashboard → Webhooks

# Google (shared service account for Drive + Sheets)
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
# Either base64-encoded PEM (recommended for Vercel) OR literal PEM with \n escapes
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0t...

# Google Drive
GOOGLE_DRIVE_ROOT_FOLDER_ID=            # ID of DocMarket root folder

# Google Sheets
GOOGLE_SHEETS_ID=                       # Spreadsheet ID

# Download tokens
DOWNLOAD_TOKEN_SECRET=                  # 32+ random chars

# Admin seed account (used by prisma/seed.ts)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=

# App base URL
SERVER_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@yourdomain.com

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

> **Tip — base64-encoding the Google private key**
> ```bash
> base64 -i service-account.json.private_key.pem | pbcopy
> ```
> Paste the resulting string as `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. Both `sheets.ts` and `drive.ts` decode it automatically.

---

## Setup

```bash
# 1. Install dependencies
bun install   # or npm install

# 2. Copy env template
cp .env.local.example .env.local
# Fill in all values

# 3. Generate Prisma client
bunx prisma generate

# 4. Push schema to Prisma Postgres
bunx prisma db push

# 5. Seed admin account + sample documents + Sheets tabs
bun run prisma/seed.ts
# (Use bun, not `npx tsx` — bun auto-loads .env.local; npx tsx does not.)

# 6. Start dev server
npm run dev
```

After login at `/admin/login`, the email/password come from your `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) — the seed script inserts the hashed admin row into Postgres.

### Google Cloud Setup

1. Create a Google Cloud project.
2. Enable **Google Drive API** and **Google Sheets API**.
3. Create a **Service Account**, generate a JSON key.
4. Copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
5. Copy `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (recommended: base64-encode it)
6. In Drive: create folder `DocMarket`, share it with the service account as **Editor**, copy the folder ID → `GOOGLE_DRIVE_ROOT_FOLDER_ID`
7. In Sheets: create a spreadsheet (any name), share with service account as **Editor**, copy spreadsheet ID → `GOOGLE_SHEETS_ID`. The seed script will create both `Customers` and `Subscriptions` tabs for you.

### Xendit Setup

1. Create Xendit account at xendit.co
2. Get secret key from Dashboard → Settings → API Keys → `XENDIT_SECRET_KEY`
3. Webhooks (Dashboard → Developers → Webhooks):
   - **Invoice paid** → `{SERVER_URL}/api/payment/webhook`
   - **Recurring / payment-method events** → `{SERVER_URL}/api/subscription/webhook`
4. Copy the verification token → `XENDIT_WEBHOOK_TOKEN`

---

## Admin Panel

Access at `/admin/login`. Sidebar is **sticky + collapsible** (toggle persists per browser).

| Page | Path | What it does |
|---|---|---|
| Dashboard | `/admin/dashboard` | Manage document listings, edit, deactivate |
| Add document | `/admin/documents/new` | Centered form, paste Drive link, inline preview |
| Edit document | `/admin/documents/[id]/edit` | Same form pre-filled |
| Orders | `/admin/orders` | All orders with buyer info + payment status |
| Subscriptions | `/admin/subscriptions` | Two tabs: **Plans** (define offerings) + **Enrollments** (active subscribers) |
| Login | `/admin/login` | Password show/hide toggle, idle/expired notices |

---

## Project Structure

```
document-marketplace/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Public storefront
│   ├── nominees/                     # Subscription sign-up
│   ├── checkout/[id]/                # Buyer checkout
│   ├── documents/[id]/               # Document detail
│   ├── payment/{success,failed}/     # Post-payment pages
│   ├── admin/
│   │   ├── layout.tsx                # Auth guard + sidebar
│   │   ├── login/                    # Login form (password show/hide)
│   │   ├── dashboard/                # Document management
│   │   ├── documents/new/            # Create document
│   │   ├── documents/[id]/edit/      # Edit document
│   │   ├── orders/                   # Order history
│   │   └── subscriptions/            # Plans + Enrollments tabs
│   └── api/
│       ├── auth/[...all]/            # Better Auth
│       ├── payment/{create-invoice,webhook}/
│       ├── subscription/{create,webhook,plans}/
│       ├── download/[token]/         # JWT download redirect
│       ├── orders/[id]/
│       └── admin/{upload,documents,orders,subscriptions,google-status}/
├── src/
│   ├── lib/
│   │   ├── auth.ts                   # Better Auth config
│   │   ├── admin-guard.ts            # Session middleware
│   │   ├── drive.ts                  # Google Drive client
│   │   ├── google-drive.ts           # Drive URL/ID utilities (NEW)
│   │   ├── sheets.ts                 # Customers + Subscriptions appenders
│   │   ├── xendit.ts                 # Invoice + webhook verification
│   │   ├── xendit-recurring.ts       # Customer + PaymentMethod + RecurringPlan
│   │   ├── download-token.ts         # JWT 72h tokens
│   │   ├── mailer.ts                 # SMTP delivery
│   │   └── schemas.ts                # Zod validation (incl. DocumentFileFieldsSchema)
│   ├── components/
│   │   ├── AdminSidebar.tsx          # Sticky + collapsible
│   │   ├── DocumentForm.tsx          # Drive-link form with preview iframe
│   │   ├── DocumentCard.tsx
│   │   ├── GoogleStatusBanner.tsx
│   │   ├── IdleTimeoutWatcher.tsx
│   │   └── ui/                       # shadcn/ui
│   ├── db.ts                         # Prisma client (accelerateUrl)
│   └── env.ts                        # T3 env validation
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                       # Admin user + sample docs + Sheets tabs
└── middleware.ts                     # Better Auth session validation
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ETIMEDOUT` on `prisma.session.findFirst()` | TCP adapter pointed at HTTP endpoint | Ensure `src/db.ts` does **not** wrap with `PrismaPg`; pass `accelerateUrl` instead |
| `PrismaClientConstructorValidationError: Unknown property datasourceUrl` | Wrong constructor key for Prisma 7 + Accelerate | Use `accelerateUrl: process.env.DATABASE_URL` |
| `error:0900006e:PEM routines:OPENSSL_internal:NO_START_LINE` | Private key is base64 but seed treats it as raw PEM | Already fixed in seed; confirm you re-ran the seed after pulling latest |
| `DATABASE_URL is not set` when running seed | `npx tsx` does not auto-load `.env.local` | Use `bun run prisma/seed.ts` |
| Sheet write fails with `Unable to parse range` | A required tab was renamed/deleted | Re-run seed; it auto-creates `Customers` + `Subscriptions` |
| Document preview iframe shows "You need access" | Drive file isn't shared as `anyoneWithLink` reader | Update sharing in Drive, or upload via the admin upload route which sets it automatically |
