import { PrismaClient } from '../src/generated/prisma/client.js'
import { hashPassword } from '@better-auth/utils/password'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')
const prisma = new PrismaClient({ accelerateUrl: url } as any)

// ─── Sample documents (placeholder Drive IDs for dev/testing) ─────────────────
const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-001',
    title: 'Business Proposal Template',
    description:
      'A professionally designed business proposal template suitable for pitching clients, investors, or partners. Includes executive summary, problem statement, solution, timeline, and pricing sections.',
    price: 299,
    category: 'Business',
    driveFileId: 'PLACEHOLDER_FILE_ID',
    driveFileName: 'business-proposal-template.pdf',
    driveFileUrl: 'https://drive.google.com/uc?export=download&id=PLACEHOLDER_FILE_ID',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    isActive: true,
  },
  {
    id: 'doc-002',
    title: 'Contract of Service Agreement',
    description:
      'A comprehensive freelance/contractor service agreement covering scope of work, payment terms, intellectual property, confidentiality, and termination clauses.',
    price: 499,
    category: 'Legal',
    driveFileId: 'PLACEHOLDER_FILE_ID',
    driveFileName: 'contract-of-service.pdf',
    driveFileUrl: 'https://drive.google.com/uc?export=download&id=PLACEHOLDER_FILE_ID',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?w=600&q=80',
    isActive: true,
  },
  {
    id: 'doc-003',
    title: 'Company Financial Report Template',
    description:
      'A ready-to-use annual financial report template with income statement, balance sheet, cash flow statement, and key metrics dashboard designed for SMEs and startups.',
    price: 399,
    category: 'Finance',
    driveFileId: 'PLACEHOLDER_FILE_ID',
    driveFileName: 'financial-report-template.xlsx',
    driveFileUrl: 'https://drive.google.com/uc?export=download&id=PLACEHOLDER_FILE_ID',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    isActive: true,
  },
  {
    id: 'doc-004',
    title: 'Employee Handbook Template',
    description:
      'A complete employee handbook covering company policies, code of conduct, leave policies, benefits, grievance procedures, and onboarding checklist. Editable in DOCX format.',
    price: 599,
    category: 'HR',
    driveFileId: 'PLACEHOLDER_FILE_ID',
    driveFileName: 'employee-handbook.docx',
    driveFileUrl: 'https://drive.google.com/uc?export=download&id=PLACEHOLDER_FILE_ID',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=600&q=80',
    isActive: true,
  },
  {
    id: 'doc-005',
    title: 'Academic Research Paper Template',
    description:
      'A structured academic research paper template following APA 7th edition format with abstract, introduction, methodology, results, discussion, and references sections.',
    price: 199,
    category: 'Academic',
    driveFileId: 'PLACEHOLDER_FILE_ID',
    driveFileName: 'research-paper-template.docx',
    driveFileUrl: 'https://drive.google.com/uc?export=download&id=PLACEHOLDER_FILE_ID',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
    isActive: true,
  },
  {
    id: 'doc-006',
    title: 'Digital Marketing Strategy Plan',
    description:
      'A comprehensive digital marketing strategy template covering brand positioning, target audience, channel strategy (social, SEO, email), KPIs, and 90-day execution roadmap.',
    price: 449,
    category: 'Business',
    driveFileId: 'PLACEHOLDER_FILE_ID',
    driveFileName: 'digital-marketing-plan.pdf',
    driveFileUrl: 'https://drive.google.com/uc?export=download&id=PLACEHOLDER_FILE_ID',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80',
    isActive: true,
  },
]

// ─── Admin user seeding ───────────────────────────────────────────────────────
async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed')
    return
  }

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (existing) {
    if (existing.role !== 'admin') {
      await prisma.user.update({ where: { email: adminEmail }, data: { role: 'admin' } })
      console.log(`✅ Admin role set for: ${adminEmail}`)
    } else {
      console.log(`✅ Admin user already exists: ${adminEmail}`)
    }
    return
  }

  const userId = crypto.randomUUID()
  const now = new Date()
  const passwordHash = await hashPassword(adminPassword)

  await prisma.user.create({
    data: {
      id: userId,
      name: 'Admin',
      email: adminEmail,
      emailVerified: true,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    },
  })

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: 'credential',
      userId,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    },
  })

  console.log(`✅ Admin user created: ${adminEmail}`)
}

// ─── Document seeding ─────────────────────────────────────────────────────────
async function seedDocuments() {
  const existingIds = new Set(
    (await prisma.document.findMany({ select: { id: true } })).map((d) => d.id),
  )

  const toInsert = SAMPLE_DOCUMENTS.filter((d) => !existingIds.has(d.id))
  if (toInsert.length === 0) {
    console.log('✅ Documents: sample documents already present')
    return
  }

  await prisma.document.createMany({ data: toInsert })
  console.log(`✅ Documents: inserted ${toInsert.length} sample documents`)
}

// ─── Google Sheets header seeding ─────────────────────────────────────────────
async function seedSheetsHeaders() {
  const sheetsId = process.env.GOOGLE_SHEETS_ID
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!sheetsId || !serviceEmail || !privateKey) {
    console.log('⚠️  Google Sheets env vars not set — skipping Sheets header setup')
    return
  }

  const { google } = await import('googleapis')
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetsId,
    range: 'Customers!A1:H1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [['orderId', 'documentTitle', 'buyerName', 'buyerEmail', 'buyerPhone', 'buyerAddress', 'amount', 'purchasedAt']],
    },
  })

  console.log('✅ Google Sheets: Customers header row set')
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding...\n')
  await seedAdminUser()
  await seedDocuments()
  await seedSheetsHeaders()
  console.log('\n✨ Done!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
