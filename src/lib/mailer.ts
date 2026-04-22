import nodemailer from 'nodemailer'
import { env } from '@/env'

function getTransporter() {
  if (!env.SMTP_HOST) return null
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: (env.SMTP_PORT ?? 587) === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  })
}

export async function sendDownloadEmail(opts: {
  to: string
  name: string
  documentTitle: string
  downloadUrl: string
}): Promise<void> {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[mailer] SMTP not configured — skipping email delivery', {
      to: opts.to,
      documentTitle: opts.documentTitle,
    })
    return
  }

  console.info('[mailer] Sending download email', {
    to: opts.to,
    from: env.SMTP_FROM ?? 'noreply@example.com',
    documentTitle: opts.documentTitle,
  })

  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM ?? 'noreply@example.com',
      to: opts.to,
      subject: `Your purchase: ${opts.documentTitle}`,
      html: `
        <h2>Thank you for your purchase, ${opts.name}!</h2>
        <p>Your document <strong>${opts.documentTitle}</strong> is ready to download.</p>
        <p>
          <a href="${opts.downloadUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
            Download Now
          </a>
        </p>
        <p style="color:#6b7280;font-size:14px">This link expires in 72 hours.</p>
      `,
    })

    console.info('[mailer] Download email sent', {
      to: opts.to,
      messageId: info.messageId,
      response: info.response,
    })
  } catch (error) {
    console.error('[mailer] Failed to send download email', {
      to: opts.to,
      documentTitle: opts.documentTitle,
      error,
    })
    throw error
  }
}
