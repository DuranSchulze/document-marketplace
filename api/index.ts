// Vercel Serverless Function entry that adapts the TanStack Start Web
// fetch handler (produced by `vite build` into `dist/server/server.js`)
// to Vercel's Node runtime. Vercel's Node runtime supports default-export
// of a standard Web `(Request) => Response` handler since 2024, so we
// just re-export it.
//
// The build step (`vercel-build`) runs `vite build` BEFORE Vercel bundles
// this function, so `dist/server/server.js` is guaranteed to exist and
// is traced into the function bundle by @vercel/nft.
//
// All HTTP routes — SSR'd pages, TanStack Start server functions, and
// `src/routes/api/**` handlers — are routed through this single function
// via the `rewrites` rule in `vercel.json`.

// @ts-expect-error — generated at build time, not present in source tree
import server from '../dist/server/server.js'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(request: Request): Promise<Response> {
  return (server as { fetch: (req: Request) => Promise<Response> }).fetch(request)
}
