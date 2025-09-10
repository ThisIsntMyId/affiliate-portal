# Services Documentation

## Overview

This document outlines the service architecture, patterns, and implementation guidelines for the Affiliate Portal application. Services handle third-party integrations and cross-cutting concerns, following a simple and scalable approach.

## Service Architecture

### Service Categories

**Driver-based Services** (multiple implementations):
- `emailService` - Email delivery (SMTP, Log)
- `smsService` - SMS delivery (Twilio, Log)
- `storageService` - File storage (S3, Local)
- `cacheService` - Caching (Redis, Memory)

**Driver-less Services** (single implementation):
- `loggingService` - Application logging
- `rateLimitService` - Request rate limiting
- `cryptoService` - Encryption and hashing
- `codeGenerationService` - Entity code generation

### Core Principles

1. **Simple and Minimal** - No over-engineering
2. **Type-safe** - Full TypeScript support
3. **Environment-aware** - Configuration-driven
4. **Error-first** - Services throw errors, consumers handle them
5. **Singleton Pattern** - One instance per service

## Service Patterns

### Driver-based Service Pattern

```typescript
// services/email.service.ts
import nodemailer from 'nodemailer'
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
  send(to: string, subject: string, content: string): Promise<void>
}

// Driver Implementations
class SMTPEmailService implements EmailService {
  private transport: any

  constructor(config: any) {
    if (!config.host || !config.port) {
      throw new Error('SMTP config missing required fields: host and port')
    }
    this.transport = nodemailer.createTransporter(config)
  }

  async send(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.transport.sendMail({ to, subject, text: content })
    } catch (error) {
      throw new EmailServiceError(`Failed to send email: ${error.message}`, 'SMTP_ERROR')
    }
  }
}

class LogEmailService implements EmailService {
  async send(to: string, subject: string, content: string): Promise<void> {
    loggingService.log('info', 'Email sent', { to, subject, content })
  }
}

// Driver Registry
const emailDrivers = {
  'smtp': (config: any) => new SMTPEmailService(config),
  'log': () => new LogEmailService()
} as const

// Service Factory
export function createEmailService(driver: string, config?: any): EmailService {
  const factory = emailDrivers[driver as keyof typeof emailDrivers]
  if (!factory) {
    throw new Error(`Unknown email driver: ${driver}`)
  }
  return factory(config)
}

// Export Singleton
export const emailService = createEmailService(config.email.driver, config.email.smtp)
```

### Driver-less Service Pattern

```typescript
// services/logging.service.ts
class LoggingService {
  async log(level: string, message: string, data?: any): Promise<void> {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data)
  }
  
  async error(message: string, error?: Error): Promise<void> {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] [ERROR] ${message}`, error)
  }
  
  async info(message: string, data?: any): Promise<void> {
    await this.log('info', message, data)
  }
  
  async warn(message: string, data?: any): Promise<void> {
    await this.log('warn', message, data)
  }
}

// Export Singleton
export const loggingService = new LoggingService()
```

## Error Handling

### Service Error Classes

Each service defines its own error class within the service file:

```typescript
// services/email.service.ts
export class EmailServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'EmailServiceError'
  }
}

// services/sms.service.ts
export class SMSServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'SMSServiceError'
  }
}

// services/storage.service.ts
export class StorageServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'StorageServiceError'
  }
}

// services/cache.service.ts
export class CacheServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'CacheServiceError'
  }
}
```

### Error Handling Pattern

**Services throw errors:**
```typescript
// In service
async send(to: string, subject: string, content: string): Promise<void> {
  try {
    await this.transport.sendMail({ to, subject, text: content })
  } catch (error) {
    throw new EmailServiceError(`Failed to send email: ${error.message}`, 'SMTP_ERROR')
  }
}
```

**Consumers handle errors:**
```typescript
// In action or API route
try {
  await emailService.send('user@example.com', 'Welcome', 'Welcome message')
} catch (error) {
  if (error instanceof EmailServiceError) {
    return { success: false, error: 'Failed to send email' }
  }
  throw error
}
```

## Service Dependencies

### Dependency Management

**Import at top of file** (recommended for simple cases):
```typescript
// services/email.service.ts
import { loggingService } from './logging.service'

class LogEmailService {
  async send(to: string, subject: string, content: string): Promise<void> {
    loggingService.log('info', 'Email sent', { to, subject, content })
  }
}
```

**Lazy import for complex dependencies:**
```typescript
// services/complex.service.ts
class ComplexService {
  private get someService() {
    return import('./some.service').then(m => m.someService)
  }
}
```

## Configuration

### Service Configuration

Services use the centralized config system:

```typescript
// config/index.ts
export const config = {
  email: {
    driver: env.MAIL_DRIVER, // 'smtp' | 'log'
    smtp: {
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
      from: env.MAIL_FROM,
      fromName: env.MAIL_FROM_NAME,
    },
  },
  // ... other services
}
```

### Environment Variables

```bash
# Email
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-password
MAIL_FROM=noreply@yourapp.com
MAIL_FROM_NAME="Your App"

# SMS
SMS_DRIVER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Cache
CACHE_DRIVER=redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Storage
STORAGE_DRIVER=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## Service Implementation Guidelines

### 1. Service Creation Checklist

- [ ] Define service interface
- [ ] Implement driver classes
- [ ] Add configuration validation
- [ ] Implement error handling
- [ ] Create service factory
- [ ] Export singleton instance
- [ ] Add TypeScript types
- [ ] Write tests

### 2. Driver Implementation

```typescript
// Driver class structure
class DriverService implements ServiceInterface {
  constructor(config: any) {
    // Validate config
    if (!config.requiredField) {
      throw new Error('Config missing required field')
    }
    
    // Initialize dependencies
    this.setupDependencies(config)
  }

  async methodName(params: any): Promise<ReturnType> {
    try {
      // Implementation
    } catch (error) {
      throw new ServiceError(`Operation failed: ${error.message}`, 'ERROR_CODE')
    }
  }
}
```

### 3. Service Factory Pattern

```typescript
// Service factory
const serviceDrivers = {
  'driver1': (config: any) => new Driver1Service(config),
  'driver2': (config: any) => new Driver2Service(config),
  'log': () => new LogService()
} as const

export function createService(driver: string, config?: any): ServiceInterface {
  const factory = serviceDrivers[driver as keyof typeof serviceDrivers]
  if (!factory) {
    throw new Error(`Unknown service driver: ${driver}`)
  }
  return factory(config)
}
```

## Service Registry

### Available Services

| Service | Type | Drivers | Description |
|---------|------|---------|-------------|
| `emailService` | Driver-based | smtp, log | Email delivery |
| `smsService` | Driver-based | twilio, log | SMS delivery |
| `storageService` | Driver-based | s3, local | File storage |
| `cacheService` | Driver-based | redis, memory | Caching |
| `loggingService` | Driver-less | - | Application logging |
| `rateLimitService` | Driver-less | - | Request rate limiting |
| `cryptoService` | Driver-less | - | Encryption/hashing |
| `codeGenerationService` | Driver-less | - | Entity code generation |

### Service Usage Examples

```typescript
// Email service
await emailService.send('user@example.com', 'Welcome', 'Welcome message')

// SMS service
await smsService.send('+1234567890', 'Your code is 123456')

// Storage service
const url = await storageService.upload(file, 'path/to/file.jpg')
await storageService.delete('path/to/file.jpg')

// Cache service
await cacheService.set('key', data, 3600) // TTL: 1 hour
const data = await cacheService.get('key')
await cacheService.delete('key')

// Logging service
await loggingService.info('User logged in', { userId: 123 })
await loggingService.error('Database error', error)
```

## Testing Services

### Service Testing Pattern

```typescript
// services/__tests__/email.service.test.ts
import { emailService } from '../email.service'

describe('EmailService', () => {
  it('should send email via SMTP', async () => {
    // Test implementation
  })

  it('should log email when using log driver', async () => {
    // Test log driver
  })

  it('should throw error for invalid config', () => {
    // Test error handling
  })
})
```

### Mocking Services

```typescript
// For testing other services that depend on email
jest.mock('../email.service', () => ({
  emailService: {
    send: jest.fn()
  }
}))
```

## Performance Considerations

### Singleton Pattern Benefits

- **Connection pooling** - Reuse connections (SMTP, Redis)
- **Memory efficient** - Single instance per service
- **Configuration loaded once** - No repeated config parsing
- **Works in serverless** - Vercel, AWS Lambda compatible

### Service Lifecycle

- **Next.js**: Created on server startup, persists across requests
- **Vercel**: Created per serverless function instance, resets on cold start
- **Self-hosted**: Created on app startup, persists until restart

## Future Considerations

### Adding New Services

1. Create service interface
2. Implement driver classes
3. Add configuration to `config/index.ts`
4. Create service factory
5. Export singleton
6. Update service registry
7. Add tests

### Adding New Drivers

1. Implement driver class
2. Add to driver registry
3. Add configuration options
4. Update environment variables
5. Add tests

## Conclusion

This service architecture provides a solid foundation for handling third-party integrations and cross-cutting concerns. The driver pattern allows for flexible implementations while maintaining simplicity and type safety. Services are designed to be easy to use, test, and extend as the application grows.
