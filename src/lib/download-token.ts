import jwt from 'jsonwebtoken'
import { env } from '@/env'

export interface DownloadTokenPayload {
  orderId: string
  documentId: string
  driveFileUrl: string
  buyerEmail: string
}

export function generateDownloadToken(payload: DownloadTokenPayload): string {
  return jwt.sign(payload, env.DOWNLOAD_TOKEN_SECRET ?? 'fallback-secret-change-me', {
    expiresIn: '72h',
    issuer: 'document-marketplace',
  })
}

export function verifyDownloadToken(token: string): DownloadTokenPayload {
  return jwt.verify(token, env.DOWNLOAD_TOKEN_SECRET ?? 'fallback-secret-change-me', {
    issuer: 'document-marketplace',
  }) as DownloadTokenPayload
}
