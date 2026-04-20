import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: ['nodemailer', 'googleapis', '@prisma/client'],
}

export default config
