import { describe, expect, it } from 'vitest'
import { createXenditSubscriptionScheduleWindow } from './xendit-recurring'

describe('createXenditSubscriptionScheduleWindow', () => {
  it('creates a short checkout expiry before the subscription anchor', () => {
    const window = createXenditSubscriptionScheduleWindow(new Date('2026-04-24T05:04:03.117Z'))

    expect(Date.parse(window.expiresAt)).not.toBeNaN()
    expect(Date.parse(window.anchorDate)).not.toBeNaN()
    expect(new Date(window.anchorDate).getTime()).toBeGreaterThanOrEqual(new Date(window.expiresAt).getTime())
    expect(window.expiresAt).toBe('2026-04-24T05:19:03.117Z')
    expect(window.anchorDate).toBe('2026-04-24T05:20:03.117Z')
  })

  it('keeps the anchor date within Xendit monthly schedule limits', () => {
    const window = createXenditSubscriptionScheduleWindow(new Date('2026-04-29T05:04:03.117Z'))

    expect(new Date(window.anchorDate).getUTCDate()).toBe(28)
    expect(new Date(window.anchorDate).getTime()).toBeGreaterThanOrEqual(new Date(window.expiresAt).getTime())
    expect(window.anchorDate).toBe('2026-05-28T05:20:03.117Z')
  })
})
