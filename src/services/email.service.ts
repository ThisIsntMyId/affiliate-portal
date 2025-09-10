import nodemailer, { type Transporter } from 'nodemailer'
import { loggingService } from './logging.service'
import { config } from '@/config'

// Service Error Class
export class EmailServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'EmailServiceError'
  }
}

// Service Interface
interface EmailService {
  send(to: string, subject: string, html: string): Promise<void>
}

// Configuration Types
interface SMTPConfig {
  host?: string
  port?: number
  user?: string
  pass?: string
  from?: string
  fromName?: string
}

// Driver Implementations
class SMTPEmailService implements EmailService {
  private transport: Transporter

  constructor(smtpConfig: SMTPConfig) {
    if (!smtpConfig.host || !smtpConfig.port) {
      throw new Error('SMTP config missing required fields: host and port')
    }
    this.transport = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465, // true for 465, false for other ports
      auth: smtpConfig.user && smtpConfig.pass ? {
        user: smtpConfig.user,
        pass: smtpConfig.pass
      } : undefined,
    })
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transport.sendMail({
        from: `${config.mail.smtp.fromName} <${config.mail.smtp.from}>`,
        to,
        subject,
        html
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new EmailServiceError(`Failed to send email: ${errorMessage}`, 'SMTP_ERROR')
    }
  }
}


class LogEmailService implements EmailService {
  async send(to: string, subject: string, html: string): Promise<void> {
    loggingService.info('Email sent', { 
      to, 
      subject, 
      html
    })
  }
}

// Driver Registry
const emailDrivers = {
  'smtp': (smtpConfig: SMTPConfig) => new SMTPEmailService(smtpConfig),
  'log': () => new LogEmailService()
} as const

// Service Factory
export function createEmailService(driver: string, driverConfig?: SMTPConfig): EmailService {
  const factory = emailDrivers[driver as keyof typeof emailDrivers]
  if (!factory) {
    throw new Error(`Unknown email driver: ${driver}`)
  }
  return factory(driverConfig as SMTPConfig)
}

// Export Singleton - Cleaner config handling
const emailDriver = config.mail.driver
const emailDriverConfig = config.mail[emailDriver as keyof Omit<typeof config.mail, 'driver'>] as SMTPConfig | undefined

export const emailService = createEmailService(emailDriver, emailDriverConfig)
