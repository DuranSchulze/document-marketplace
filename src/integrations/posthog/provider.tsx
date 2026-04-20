'use client'

import posthog from 'posthog-js'
import { PostHogProvider as BasePostHogProvider } from '@posthog/react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface PostHogProviderProps {
  children: ReactNode
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
      defaults: '2025-11-30',
    })
  }, [])

  return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>
}
