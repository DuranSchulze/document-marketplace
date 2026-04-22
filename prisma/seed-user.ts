import { PrismaClient } from '../src/generated/prisma/client.js'
import { hashPassword } from '@better-auth/utils/password'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

const rawEmail = process.env.SEED_USER_EMAIL
const rawPassword = process.env.SEED_USER_PASSWORD
const name = process.env.SEED_USER_NAME ?? 'Seed User'
const role = process.env.SEED_USER_ROLE ?? 'user'

if (!rawEmail) throw new Error('SEED_USER_EMAIL is not set')
if (!rawPassword) throw new Error('SEED_USER_PASSWORD is not set')

const databaseUrl: string = process.env.DATABASE_URL
const email: string = rawEmail
const password: string = rawPassword
const displayName: string = name
const userRole: string = role

const prisma = new PrismaClient({ accelerateUrl: databaseUrl })

async function main() {
  const now = new Date()
  const passwordHash = await hashPassword(password)
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: {
        where: { providerId: 'credential' },
        take: 1,
      },
    },
  })

  if (!existingUser) {
    const userId = crypto.randomUUID()

    await prisma.user.create({
      data: {
        id: userId,
        name: displayName,
        email,
        emailVerified: true,
        role: userRole,
        createdAt: now,
        updatedAt: now,
        accounts: {
          create: {
            id: crypto.randomUUID(),
            accountId: userId,
            providerId: 'credential',
            password: passwordHash,
            createdAt: now,
            updatedAt: now,
          },
        },
      },
    })

    console.log(`✅ Seeded user created: ${email}`)
    return
  }

  await prisma.user.update({
    where: { email },
    data: {
      name: displayName,
      role: userRole,
      emailVerified: true,
      updatedAt: now,
    },
  })

  const existingCredentialAccount = existingUser.accounts[0]

  if (existingCredentialAccount) {
    await prisma.account.update({
      where: { id: existingCredentialAccount.id },
      data: {
        password: passwordHash,
        updatedAt: now,
      },
    })
  } else {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: existingUser.id,
        providerId: 'credential',
        userId: existingUser.id,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      },
    })
  }

  console.log(`✅ Seeded user updated: ${email}`)
}

main()
  .catch((error) => {
    console.error('❌ Seed user error:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
