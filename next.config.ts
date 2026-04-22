import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: [
    'nodemailer',
    'googleapis',
    '@prisma/client',
    'better-auth',
    '@better-auth/core',
    '@better-auth/utils',
    '@better-auth/prisma-adapter',
  ],
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/@prisma/client/**/*',
      './src/generated/prisma/**/*',
    ],
  },
}

export default config
