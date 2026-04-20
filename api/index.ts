// Vercel Serverless Function entry — bridges Node.js IncomingMessage/ServerResponse
// to the Web-standard fetch handler that TanStack Start (h3/srvx) expects.
//
// Vercel's Node.js runtime calls handlers as (req, res) not as
// (request: Request) => Promise<Response>, so we manually convert both ways.

import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'

type StartServer = { fetch: (req: Request) => Promise<Response> }
type NodeRequest = IncomingMessage & { headers: IncomingMessage['headers']; method?: string; url?: string }

let serverPromise: Promise<StartServer> | undefined

function loadServer(): Promise<StartServer> {
  if (!serverPromise) {
    // @ts-expect-error — generated at build time; traced into the bundle via
    // includeFiles in vercel.json.
    serverPromise = import('../.output/server/_libs/_3.mjs').then((mod) => mod.default as StartServer)
  }
  return serverPromise
}

function isWebRequest(value: unknown): value is Request {
  return value instanceof Request
}

function nodeToWebRequest(req: NodeRequest): Request {
  const rawHost = req.headers['x-forwarded-host'] ?? req.headers['host'] ?? 'localhost'
  const host = Array.isArray(rawHost) ? rawHost[0] : rawHost

  const rawProto = req.headers['x-forwarded-proto'] ?? 'https'
  const proto = Array.isArray(rawProto) ? rawProto[0] : rawProto

  const url = new URL(req.url ?? '/', `${proto}://${host}`)

  const headers = new Headers()
  for (const [key, raw] of Object.entries(req.headers)) {
    if (!raw) continue
    if (Array.isArray(raw)) {
      for (const v of raw) headers.append(key, v)
    } else {
      headers.set(key, raw)
    }
  }

  const method = req.method ?? 'GET'
  const hasBody = method !== 'GET' && method !== 'HEAD'

  const init: RequestInit & { duplex?: 'half' } = {
    method,
    headers,
  }

  if (hasBody) {
    init.body = Readable.toWeb(req) as ReadableStream
    init.duplex = 'half'
  }

  return new Request(url.toString(), init)
}

async function webResponseToNode(response: Response, res: ServerResponse): Promise<void> {
  res.statusCode = response.status

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') res.setHeader(key, value)
  })
  // set-cookie values must NOT be comma-joined — write as an array
  const cookies = response.headers.getSetCookie()
  if (cookies.length > 0) res.setHeader('set-cookie', cookies)

  if (response.body) {
    const reader = response.body.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    } finally {
      reader.releaseLock()
    }
  }

  res.end()
}

export default async function handler(req: Request): Promise<Response>
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void>
export default async function handler(req: Request | IncomingMessage, res?: ServerResponse): Promise<Response | void> {
  try {
    const server = await loadServer()
    const webRequest = isWebRequest(req) ? req : nodeToWebRequest(req as NodeRequest)
    const webResponse = await server.fetch(webRequest)

    if (!res) {
      return webResponse
    }

    await webResponseToNode(webResponse, res)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[api/index] handler error:', err)

    if (!res) {
      return Response.json({ error: 'Internal Server Error', message, stack }, { status: 500 })
    }

    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
    }
    res.end(JSON.stringify({ error: 'Internal Server Error', message, stack }))
  }
}
