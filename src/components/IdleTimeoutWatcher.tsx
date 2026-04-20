'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const IDLE_LIMIT_MS = 30 * 60 * 1000
const CHECK_INTERVAL_MS = 60 * 1000
const ACTIVITY_THROTTLE_MS = 30 * 1000

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
]

export function IdleTimeoutWatcher() {
  const router = useRouter()
  const lastActivityRef = useRef<number>(Date.now())
  const signedOutRef = useRef(false)

  useEffect(() => {
    let lastMark = 0
    const markActivity = () => {
      const now = Date.now()
      if (now - lastMark < ACTIVITY_THROTTLE_MS) return
      lastMark = now
      lastActivityRef.current = now
    }

    ACTIVITY_EVENTS.forEach((evt) => {
      window.addEventListener(evt, markActivity, { passive: true })
    })

    const interval = window.setInterval(async () => {
      if (signedOutRef.current) return
      const idleFor = Date.now() - lastActivityRef.current
      if (idleFor >= IDLE_LIMIT_MS) {
        signedOutRef.current = true
        try {
          await authClient.signOut()
        } catch {
          // ignore — still redirect
        }
        router.push('/admin/login?reason=idle')
      }
    }, CHECK_INTERVAL_MS)

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, markActivity)
      })
      window.clearInterval(interval)
    }
  }, [router])

  return null
}
