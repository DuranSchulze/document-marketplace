'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import ThemeToggle from './ThemeToggle'

const STORAGE_KEY = 'docmarket:sidebar-collapsed'

const navItems = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zM3 21h8v-6H3v6zm10-8h8V3h-8v10z" />
      </svg>
    ),
  },
  {
    to: '/admin/documents',
    label: 'Documents',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: '/admin/subscriptions',
    label: 'Subscriptions',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Load persisted state on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === '1') setCollapsed(true)
  }, [])

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }

  async function handleSignOut() {
    await authClient.signOut()
    // Hard navigation flushes the RSC cache; otherwise the previous admin
    // pages can flash before the next request hits the server gate.
    window.location.assign('/admin/login')
  }

  return (
    <aside
      className={`admin-sidebar sticky top-0 h-screen shrink-0 border-r flex flex-col transition-[width] duration-200 ease-out ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Header + collapse toggle */}
      <div
        className={`admin-border flex items-center border-b ${
          collapsed ? 'justify-center px-2 py-4' : 'justify-between px-5 py-6 gap-2'
        }`}
      >
        {!collapsed && (
          <div className="min-w-0">
            <p className="island-kicker text-xs">Admin Portal</p>
            <p className="admin-text font-bold text-sm mt-0.5 truncate">
              Document Marketplace
            </p>
          </div>
        )}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-1'}`}>
          <ThemeToggle className="h-8 w-8 border-[var(--admin-border-soft)] bg-[var(--admin-table-head)] text-[var(--admin-text)] shadow-none hover:bg-[var(--admin-row-hover)]" />
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="admin-muted rounded-lg p-1.5 hover:bg-[var(--admin-row-hover)] hover:text-[var(--admin-text)] transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav (this region scrolls if it ever overflows) */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              href={item.to}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                active
                  ? 'bg-[var(--admin-table-head)] text-[var(--admin-link)]'
                  : 'admin-muted hover:bg-[var(--admin-row-hover)] hover:text-[var(--admin-text)]'
              }`}
            >
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="admin-border p-3 border-t space-y-1">
        <Link
          href="/"
          title={collapsed ? 'View Store' : undefined}
          className={`admin-muted flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline hover:bg-[var(--admin-row-hover)] hover:text-[var(--admin-text)] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {!collapsed && <span className="truncate">View Store</span>}
        </Link>
        <button
          onClick={handleSignOut}
          title={collapsed ? 'Sign Out' : undefined}
          className={`admin-danger-action w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--admin-danger-surface)] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
