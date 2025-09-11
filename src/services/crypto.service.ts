import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'
import { hash, compare } from 'bcryptjs'
import { config } from '@/config'

export class CryptoServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'CryptoServiceError'
  }
}

class CryptoService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly keySalt = 'app-specific-salt'
  private readonly encryptionKey: Buffer
  private readonly saltRounds = 10

  constructor(appSecret: string) {
    if (!appSecret || appSecret.length < 32) {
      throw new CryptoServiceError('APP_SECRET must be defined and at least 32 characters long.', 'INVALID_SECRET')
    }
    this.encryptionKey = scryptSync(appSecret, this.keySalt, 32) as Buffer
  }

  async encrypt(text: string): Promise<string> {
    try {
      const iv = randomBytes(16)
      const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv)
      const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
      const authTag = cipher.getAuthTag()

      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
    } catch {
      throw new CryptoServiceError('Encryption failed.', 'ENCRYPTION_ERROR')
    }
  }

  async decrypt(encryptedText: string): Promise<string> {
    try {
      const parts = encryptedText.split(':')
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format.')
      }
      
      const [ivHex, authTagHex, encryptedDataHex] = parts
      const iv = Buffer.from(ivHex, 'hex')
      const authTag = Buffer.from(authTagHex, 'hex')
      const encryptedData = Buffer.from(encryptedDataHex, 'hex')

      const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv)
      decipher.setAuthTag(authTag)
      
      const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()])
      
      return decrypted.toString('utf8')
    } catch {
      throw new CryptoServiceError('Decryption failed. The data may be corrupt or the key incorrect.', 'DECRYPTION_ERROR')
    }
  }

  async hash(text: string): Promise<string> {
    try {
      return await hash(text, this.saltRounds)
    } catch {
      throw new CryptoServiceError('Hashing failed.', 'HASHING_ERROR')
    }
  }

  async match(text: string, hashedText: string): Promise<boolean> {
    try {
      return await compare(text, hashedText)
    } catch {
      return false
    }
  }
}

export const cryptoService = new CryptoService(config.app.secret)
