// Vercel Serverless Function entry that adapts the TanStack Start Web
// fetch handler (produced by `vite build` into `dist/server/server.js`)
// to Vercel's Node runtime.
//
// The build step (`vercel-build`) runs `vite build` BEFORE Vercel bundles
// this function, so `dist/server/server.js` is guaranteed to exist and is
// traced into the function bundle via @vercel/nft + `includeFiles` in
// `vercel.json`.
//
// All HTTP routes — SSR'd pages, TanStack Start server functions, and
// `src/routes/api/**` handlers — are routed through this single function
// via the `rewrites` rule in `vercel.json`.
//
// We use a dynamic import inside the handler so that any error thrown
// during module initialisation (e.g. a missing env var) is caught and
// returned as a readable JSON response instead of crashing the cold
// start with a generic FUNCTION_INVOCATION_FAILED.

export const config = {
  runtime: 'nodejs',
}

type StartServer = { fetch: (req: Request) => Promise<Response> }

let serverPromise: Promise<StartServer> | undefined

function loadServer(): Promise<StartServer> {
  if (!serverPromise) {
    // @ts-expect-error — generated at build time, not present in the
    // source tree; Vercel's nft traces this path because of the literal
    // string + `includeFiles: dist/server/**` in vercel.json.
    serverPromise = import('../dist/server/server.js').then((mod) => mod.default as StartServer)
  }
  return serverPromise
}

export default async function handler(request: Request): Promise<Response> {
  try {
    const server = await loadServer()
    return await server.fetch(request)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[api/index] handler error:', err)
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message,
        // Stack intentionally included in all envs while stabilising
        // the deployment. Remove once the function is healthy.
        stack,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
