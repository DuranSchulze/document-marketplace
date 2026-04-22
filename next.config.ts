import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: [
    'nodemailer',
    'googleapis',
    '@prisma/client',
    // isomorphic-dompurify bundles jsdom for the server path; jsdom uses
    // dynamic requires that webpack can't statically analyze. Marking it
    // external lets Node resolve it at runtime instead of being bundled.
    'isomorphic-dompurify',
    'jsdom',
  ],
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/@prisma/client/**/*',
      './src/generated/prisma/**/*',
    ],
  },
}

export default config
