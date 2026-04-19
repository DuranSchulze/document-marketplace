# DocMarket — Document Marketplace

A digital document marketplace built with TanStack Start. Customers browse and purchase documents, admins manage listings and view sales.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     STORAGE LAYERS                          │
├──────────────────┬──────────────────┬───────────────────────┤
│  Google Drive    │  Google Sheets   │  PostgreSQL (Prisma)  │
│  ─────────────   │  ─────────────── │  ────────────────────  │
│  Actual files    │  Customer log    │  Document catalog     │
│  Organized by    │  (name, email,   │  Orders & payments    │
│  category folder │  phone, address) │  Auth sessions        │
│  Admin drag &    │  Auto-appended   │  Sales reporting      │
│  drop uploads    │  on each sale    │                       │
└──────────────────┴──────────────────┴───────────────────────┘
```

### Why each layer?

| Layer | Responsibility | Why |
|-------|---------------|-----|
| **Google Drive** | File storage | Native folder organization, direct download links, easy manual management |
| **Google Sheets** | Customer records | Non-technical team can open a spreadsheet and see who bought what |
| **PostgreSQL/Prisma** | Document catalog + Orders | Structured queries, sales reports, relational data, admin filtering |

---

## Google Drive Folder Structure

Files are organized automatically under a root folder specified by `GOOGLE_DRIVE_ROOT_FOLDER_ID`:

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
- Each file gets `anyoneWithLink` reader permission so download links work without authentication.
- The service account must have **Editor** access to the root `DocMarket` folder.

---

## Google Sheets — Customer Log

Create a spreadsheet and share it with the service account email (Editor access).

Create one sheet named **"Customers"** with these columns:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| orderId | documentTitle | buyerName | buyerEmail | buyerPhone | buyerAddress | amount | purchasedAt |

A row is appended automatically every time a payment is confirmed (Xendit webhook fires with status=PAID).

---

## Prisma Models

```prisma
model Document {
  id            String   @id @default(cuid())
  title         String
  description   String
  price         Float          // PHP
  category      String
  driveFileId   String         // Google Drive file ID
  driveFileName String
  driveFileUrl  String         // direct download URL
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
```

---

## Payment & Delivery Flow

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
  → Google Sheets: append customer record row
  → Email customer download link

Customer clicks download link → GET /api/download/{jwt-token}
  → Verify JWT (72h expiry)
  → 302 redirect to Google Drive direct download URL
```

---

## Tech Stack

| Concern | Tool |
|---------|------|
| Framework | TanStack Start (React SSR) |
| Routing | TanStack Router (file-based) |
| Auth | Better Auth (email/password, admin role) |
| Database ORM | Prisma 7 + PostgreSQL |
| File storage | Google Drive API (service account) |
| Customer log | Google Sheets API (service account) |
| Payment | Xendit (invoice flow, PHP currency) |
| Download tokens | JWT (72h expiry) |
| Email | Nodemailer (SMTP) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Analytics | PostHog |

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

```env
# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/docmarket

# Better Auth
BETTER_AUTH_SECRET=                     # 32+ random chars
BETTER_AUTH_URL=http://localhost:3000

# Xendit
XENDIT_SECRET_KEY=xnd_production_...
XENDIT_WEBHOOK_TOKEN=                   # from Xendit dashboard → Webhooks

# Google (shared credentials for Drive + Sheets)
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Drive
GOOGLE_DRIVE_ROOT_FOLDER_ID=           # ID of DocMarket root folder in Drive

# Google Sheets
GOOGLE_SHEETS_ID=                      # Spreadsheet ID from URL

# Download tokens
DOWNLOAD_TOKEN_SECRET=                 # 32+ random chars

# Admin seed account
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
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.local.example .env.local
# Fill in all values

# 3. Generate Prisma client and push schema
npm run db:generate
npm run db:push

# 4. Seed admin account + sample documents
npm run db:seed

# 5. Start dev server
npm run dev
```

### Google Cloud Setup

1. Create a Google Cloud project.
2. Enable **Google Drive API** and **Google Sheets API**.
3. Create a **Service Account**, generate a JSON key.
4. Copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
5. Copy `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (keep the `\n` escapes)
6. In Google Drive: create folder `DocMarket`, share it with the service account as **Editor**, copy the folder ID from the URL → `GOOGLE_DRIVE_ROOT_FOLDER_ID`
7. In Google Sheets: create spreadsheet with "Customers" sheet, share with service account as **Editor**, copy spreadsheet ID from URL → `GOOGLE_SHEETS_ID`

### Xendit Setup

1. Create Xendit account at xendit.co
2. Get secret key from Dashboard → Settings → API Keys → `XENDIT_SECRET_KEY`
3. Set up webhook: Dashboard → Developers → Webhooks → add `{SERVER_URL}/api/payment/webhook` → copy the verification token → `XENDIT_WEBHOOK_TOKEN`

---

## Admin Panel

Access at `/admin/login`. After logging in:

- **Dashboard** (`/admin/dashboard`) — manage document listings, upload files, set pricing
- **Orders** (`/admin/orders`) — view all orders, buyer info, payment status
- **New Document** (`/admin/documents/new`) — drag & drop PDF/DOCX upload → auto-organized in Drive
- **Edit Document** (`/admin/documents/:id/edit`) — update details or replace file

---

## Project Structure

```
src/
  lib/
    auth.ts           # Better Auth config
    drive.ts          # Google Drive API client
    sheets.ts         # Google Sheets API (customer records)
    schemas.ts        # Zod validation schemas
    xendit.ts         # Xendit payment client
    download-token.ts # JWT token generation/verification
    admin-guard.ts    # Admin session guard
    mailer.ts         # Email delivery
    db.ts             # Prisma client
  routes/
    index.tsx                           # Public storefront
    documents/$id.tsx                   # Document detail page
    checkout/$id.tsx                    # Buyer form + payment
    payment/success.tsx                 # Post-payment success
    payment/failed.tsx                  # Payment failure
    admin/login.tsx                     # Admin login
    _admin.tsx                          # Admin layout (auth guard)
    _admin/admin/
      dashboard.tsx                     # Document management
      orders.tsx                        # Order history
      documents/new.tsx                 # Create document
      documents/$id/edit.tsx            # Edit document
    api/
      payment/create-invoice.ts         # Start checkout
      payment/webhook.ts                # Xendit webhook
      download/$token.ts                # Secure download
      orders/$id.ts                     # Order status (public)
      admin/
        upload.ts                       # Drive file upload
        documents/index.ts              # CRUD documents
        documents/$id.ts                # CRUD single document
        orders/index.ts                 # List orders
  components/
    DocumentCard.tsx    # Product card
    DocumentForm.tsx    # Create/edit form with Drive upload
    AdminSidebar.tsx    # Admin nav
    OrderStatusBadge.tsx
    Header.tsx
    Footer.tsx
```
