'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const navItems = [
  {
    to: '/admin/dashboard',
    label: 'Documents',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 shrink-0 border-r border-[rgba(23,58,64,0.08)] bg-white flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-[rgba(23,58,64,0.08)]">
        <p className="island-kicker text-xs">Admin Portal</p>
        <p className="font-bold text-[var(--sea-ink)] text-sm mt-0.5">Document Marketplace</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                active
                  ? 'bg-[rgba(79,184,178,0.14)] text-[var(--lagoon-deep)]'
                  : 'text-[var(--sea-ink-soft)] hover:bg-[rgba(23,58,64,0.04)] hover:text-[var(--sea-ink)]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[rgba(23,58,64,0.08)]">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] no-underline hover:bg-[rgba(23,58,64,0.04)] hover:text-[var(--sea-ink)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Store
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
