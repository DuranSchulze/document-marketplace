import { type NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { requireAdminApi } from '@/lib/admin-guard'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi(request)
  if (unauthorized) return unauthorized

  if (!env.SMTP_HOST) {
    return Response.json(
      { ok: false, error: 'SMTP not configured (SMTP_HOST missing)' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const { searchParams } = new URL(request.url)
  let to = searchParams.get('to') ?? ''
  if (!to) {
    try {
      const body = (await request.json()) as { to?: string }
      to = body.to ?? ''
    } catch {
      /* ignore */
    }
  }
  to = to.trim() || env.SMTP_FROM || ''

  if (!to) {
    return Response.json(
      { ok: false, error: 'No recipient (pass ?to=... or set SMTP_FROM)' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const port = env.SMTP_PORT ?? 587
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  })

  try {
    await transporter.verify()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'SMTP verify failed'
    console.error('[email-test] SMTP verify failed', { message })
    return Response.json(
      { ok: false, error: `SMTP verify failed: ${message}` },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const sentAt = new Date().toISOString()
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM ?? 'noreply@example.com',
      to,
      subject: `[Test] Document Marketplace SMTP check`,
      html: `
        <h2>SMTP test email</h2>
        <p>This confirms your Brevo / SMTP relay is working.</p>
        <ul>
          <li><strong>Host:</strong> ${env.SMTP_HOST}</li>
          <li><strong>Port:</strong> ${port}</li>
          <li><strong>From:</strong> ${env.SMTP_FROM ?? '(not set)'}</li>
          <li><strong>Sent at:</strong> ${sentAt}</li>
        </ul>
      `,
    })

    console.info('[email-test] Sent test email', {
      to,
      messageId: info.messageId,
      response: info.response,
    })

    return Response.json(
      { ok: true, to, messageId: info.messageId, response: info.response, sentAt },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Send failed'
    console.error('[email-test] Send failed', { to, message })
    return Response.json(
      { ok: false, error: message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
