export function resolveXenditReturnBaseUrl(params: {
  serverUrl?: string
  requestUrl?: string
}): string | null {
  const rawBaseUrl = params.serverUrl ?? (params.requestUrl ? new URL(params.requestUrl).origin : undefined)
  if (!rawBaseUrl) return null

  const baseUrl = new URL(rawBaseUrl)
  if (baseUrl.protocol !== 'https:') return null

  return baseUrl.origin
}

