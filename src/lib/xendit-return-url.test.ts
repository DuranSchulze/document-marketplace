import { describe, expect, it } from 'vitest'
import { resolveXenditReturnBaseUrl } from './xendit-return-url'

describe('resolveXenditReturnBaseUrl', () => {
  it('uses an HTTPS SERVER_URL when configured', () => {
    expect(resolveXenditReturnBaseUrl({
      serverUrl: 'https://example.com/app',
      requestUrl: 'http://localhost:3000/subscribe/plan',
    })).toBe('https://example.com')
  })

  it('falls back to an HTTPS request origin', () => {
    expect(resolveXenditReturnBaseUrl({
      requestUrl: 'https://market.example.com/subscribe/plan',
    })).toBe('https://market.example.com')
  })

  it('rejects HTTP origins because Xendit return URLs must be HTTPS', () => {
    expect(resolveXenditReturnBaseUrl({
      serverUrl: 'http://localhost:3000',
      requestUrl: 'http://localhost:3000/subscribe/plan',
    })).toBeNull()
  })
})

