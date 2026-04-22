import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '@/env'

// Cache the transporter across invocations — creating a new one per email
// re-resolves DNS and re-handshakes TLS, which on serverless is wasteful and
// occasionally times out under cold start.
let cachedTransporter: Transporter | null = null
let verifyPromise: Promise<void> | null = null

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter
  if (!env.SMTP_HOST) return null

  const port = env.SMTP_PORT ?? 587
  const secure = port === 465 // implicit TLS only on 465; 587 = STARTTLS

  cachedTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    // Brevo (and most providers) require STARTTLS upgrade on 587. Without
    // requireTLS, nodemailer would fall back to plaintext if the server
    // didn't advertise STARTTLS, which Brevo silently rejects.
    requireTLS: !secure,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  })

  return cachedTransporter
}

async function verifyOnce(transporter: Transporter): Promise<void> {
  if (!verifyPromise) {
    verifyPromise = transporter.verify().then(
      () => {
        console.info('[mailer] SMTP connection verified', {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT ?? 587,
          user: env.SMTP_USER,
        })
      },
      (error) => {
        // Reset so a later call can retry. Re-throw to surface the failure
        // to the caller — silent verify failures are how Brevo problems hide.
        verifyPromise = null
        console.error('[mailer] SMTP verify failed', {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT ?? 587,
          user: env.SMTP_USER,
          error,
        })
        throw error
      },
    )
  }
  return verifyPromise
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

  const from = env.SMTP_FROM ?? env.SMTP_USER ?? 'noreply@example.com'

  console.info('[mailer] Sending download email', {
    to: opts.to,
    from,
    documentTitle: opts.documentTitle,
  })

  try {
    await verifyOnce(transporter)

    const info = await transporter.sendMail({
      from,
      to: opts.to,
      subject: `Your purchase: ${opts.documentTitle}`,
      text:
        `Hi ${opts.name},\n\n` +
        `Thank you for your purchase. Your document "${opts.documentTitle}" is ready to download:\n\n` +
        `${opts.downloadUrl}\n\n` +
        `This link expires in 72 hours.\n`,
      html: `
        <h2>Thank you for your purchase, ${opts.name}!</h2>
        <p>Your document <strong>${opts.documentTitle}</strong> is ready to download.</p>
        <p>
          <a href="${opts.downloadUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
            Download Now
          </a>
        </p>
        <p style="color:#6b7280;font-size:14px">Or paste this link into your browser:<br><a href="${opts.downloadUrl}">${opts.downloadUrl}</a></p>
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
