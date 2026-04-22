'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminLoginForm() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason') as
    | 'idle'
    | 'expired'
    | 'forbidden'
    | null
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const notice =
    reason === 'idle'
      ? 'You were signed out due to inactivity. Please sign in again.'
      : reason === 'expired'
        ? 'Your session expired. Please sign in again.'
        : reason === 'forbidden'
          ? 'Your account is not authorized to access the admin portal.'
          : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
      // Don't auto-remember; sessions hard-expire in 24h regardless.
      rememberMe: false,
    })

    if (authError) {
      // Generic message — never leak whether the email exists or whether the
      // password was wrong (defense against account enumeration).
      setError('Invalid email or password.')
      setIsLoading(false)
      return
    }

    // SECURITY: Authentication succeeded, but the admin portal also requires
    // role=admin. Verify before redirecting; if the user is a regular user,
    // sign them out so a non-admin session cookie isn't left behind.
    const { data: session } = await authClient.getSession()
    const role = (session?.user as { role?: string } | undefined)?.role

    if (role !== 'admin') {
      await authClient.signOut()
      setError('Your account is not authorized to access the admin portal.')
      setIsLoading(false)
      return
    }

    // Use a hard navigation so the server layout re-runs `requireAdminPage()`
    // with the freshly-set cookie — no stale RSC cache.
    window.location.assign('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--foam)] px-4">
      <div className="w-full max-w-md">
        <div className="island-shell rounded-2xl p-8">
          <div className="mb-8 text-center">
            <p className="island-kicker mb-2">Admin Portal</p>
            <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Sign In</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[var(--sea-ink)]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-[var(--sea-ink)]">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors"
                >
                  {showPassword ? (
                    // eye-off
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.96 11.96 0 012.92-4.36M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8M14.12 14.12L9.88 9.88m4.24 4.24l3.65 3.65M9.88 9.88L6.23 6.23M21 12a11.96 11.96 0 01-4.06 5.94" />
                    </svg>
                  ) : (
                    // eye
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {notice && !error && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                {notice}
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[var(--lagoon-deep)] text-white hover:opacity-90"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
