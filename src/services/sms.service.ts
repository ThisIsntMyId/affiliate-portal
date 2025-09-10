import { loggingService } from './logging.service'
import { config } from '@/config'
import twilio from 'twilio'

// Service Error Class
export class SMSServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'SMSServiceError'
  }
}

// Service Interface
interface SMSService {
  send(to: string, message: string): Promise<void>
}

// Configuration Types
interface TwilioConfig {
  accountSid?: string
  authToken?: string
  phoneNumber?: string
}

// Driver Implementations
class TwilioSMSService implements SMSService {
  private client: twilio.Twilio
  private phoneNumber: string

  constructor(twilioConfig: TwilioConfig) {
    if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber) {
      throw new Error('Twilio config missing required fields: accountSid, authToken, and phoneNumber')
    }
    
    this.client = twilio(twilioConfig.accountSid, twilioConfig.authToken)
    this.phoneNumber = twilioConfig.phoneNumber
  }

  async send(to: string, message: string): Promise<void> {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: to
      })
      
      loggingService.info('Twilio SMS sent successfully', { 
        to, 
        message,
        from: this.phoneNumber,
        messageSid: result.sid
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new SMSServiceError(`Failed to send SMS via Twilio: ${errorMessage}`, 'TWILIO_ERROR')
    }
  }
}

class LogSMSService implements SMSService {
  async send(to: string, message: string): Promise<void> {
    loggingService.info('SMS sent', { 
      to, 
      message
    })
  }
}

// Driver Registry
const smsDrivers = {
  'twilio': (twilioConfig: TwilioConfig) => new TwilioSMSService(twilioConfig),
  'log': () => new LogSMSService()
} as const

// Service Factory
export function createSMSService(driver: string, driverConfig?: TwilioConfig): SMSService {
  const factory = smsDrivers[driver as keyof typeof smsDrivers]
  if (!factory) {
    throw new Error(`Unknown SMS driver: ${driver}`)
  }
  return factory(driverConfig as TwilioConfig)
}

// Export Singleton - Dynamic config resolution
const smsDriver = config.sms.driver
const smsDriverConfig = config.sms[smsDriver as keyof Omit<typeof config.sms, 'driver'>] as TwilioConfig | undefined

export const smsService = createSMSService(smsDriver, smsDriverConfig)
