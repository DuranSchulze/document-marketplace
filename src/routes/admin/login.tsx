import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: authError } = await authClient.signIn.email({ email, password })

    if (authError) {
      setError(authError.message ?? 'Invalid credentials')
      setIsLoading(false)
      return
    }

    navigate({ to: '/admin/dashboard' })
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

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
