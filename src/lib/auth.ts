import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { prisma } from '@/db'

const isProd = process.env.NODE_ENV === 'production'

// Pin everything from env — never let Better Auth fall back to dev defaults in production.
const secret = process.env.BETTER_AUTH_SECRET
if (isProd && (!secret || secret.length < 32)) {
  throw new Error('BETTER_AUTH_SECRET must be set to a 32+ char value in production')
}

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.SERVER_URL
if (isProd && !baseURL) {
  throw new Error('BETTER_AUTH_URL (or SERVER_URL) must be set in production')
}

// Same-origin requests are always allowed; trustedOrigins covers extra origins
// (e.g. preview deployments). Comma-separated env var → array.
const extraTrusted = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const auth = betterAuth({
  secret,
  baseURL,
  trustedOrigins: extraTrusted,

  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    // Single-tenant admin portal — no public sign-up. Admins are created via
    // the seed script using ADMIN_EMAIL / ADMIN_PASSWORD env vars.
    disableSignUp: true,
    // Enforce a minimum password length on any future password changes.
    minPasswordLength: 12,
    maxPasswordLength: 128,
    // Hash with the default Better Auth password hasher (scrypt — strong + zero-dep).
    autoSignIn: false,
  },

  // Disable cross-provider account linking. We only have email+password and
  // turning this off prevents any future OAuth provider from silently merging
  // into an existing admin account.
  account: {
    accountLinking: { enabled: false },
  },

  session: {
    // Hard 24h expiry — no sliding refresh. After 24h the user must re-auth.
    expiresIn: 60 * 60 * 24,
    updateAge: 0,
    // Sensitive actions (e.g. change-password) require session <15min old.
    freshAge: 60 * 15,
    // Signed cookie cache so most reads don't hit the DB. The DB session is
    // still the source of truth — this just reduces lookup pressure.
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Brute-force defense. Better Auth applies these to its internal endpoints
  // (sign-in, password ops). Tune via env if you need to.
  rateLimit: {
    enabled: true,
    window: 60,        // seconds
    max: 10,           // requests per window per IP per route
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 3 },
    },
  },

  advanced: {
    cookiePrefix: 'docmarket',
    useSecureCookies: isProd,
    defaultCookieAttributes: {
      httpOnly: true,
      // Lax is correct for our flow: the auth POST is same-origin, and we
      // don't need cookies on cross-site GETs. Don't switch to "none" unless
      // you genuinely need cross-site auth (which then requires Secure).
      sameSite: 'lax',
      secure: isProd,
      path: '/',
    },
  },

  plugins: [nextCookies()],

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false, // never settable from the client
      },
    },
  },
})

// ── Typed helpers ─────────────────────────────────────────────────────────────

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin'
}

/**
 * Returns the current admin user, or null. Centralizes the role check so we
 * don't sprinkle `as { role?: string }` casts across the codebase.
 */
export async function getAdminFromSession(
  session: AuthSession,
): Promise<AdminUser | null> {
  if (!session?.user) return null
  const role = (session.user as { role?: string }).role
  if (role !== 'admin') return null
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: 'admin',
  }
}
