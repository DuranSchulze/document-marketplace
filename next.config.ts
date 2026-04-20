import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: ['nodemailer', 'googleapis', '@prisma/client'],
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/@prisma/client/**/*',
      './src/generated/prisma/**/*',
    ],
  },
}

export default config
