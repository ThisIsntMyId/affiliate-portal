import { config } from '@/config'
import { createClient, RedisClientType } from 'redis'
import { loggingService } from './logging.service'

// Service Error Class
export class CacheServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'CacheServiceError'
  }
}

// Service Interface
interface CacheService {
  get<T = unknown>(key: string): Promise<T | null>
  set<T = unknown>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
  getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T>
  invalidate(pattern: string): Promise<void>
}

// Driver Implementations
class RedisCacheService implements CacheService {
  private client: RedisClientType

  constructor() {
    if (!config.cache.redis.url) {
      throw new Error('Redis config missing required field: url')
    }
    
    this.client = createClient({
      url: config.cache.redis.url
    })
    
    this.client.on('error', (err) => {
      loggingService.error('Redis client error', err)
    })
    
    this.client.on('connect', () => {
      loggingService.info('Redis client connected')
    })
    
    this.client.connect()
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new CacheServiceError(`Failed to get cache key: ${errorMessage}`, 'REDIS_GET_ERROR')
    }
  }

  async set<T = unknown>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue)
      } else {
        await this.client.set(key, serializedValue)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new CacheServiceError(`Failed to set cache key: ${errorMessage}`, 'REDIS_SET_ERROR')
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new CacheServiceError(`Failed to delete cache key: ${errorMessage}`, 'REDIS_DELETE_ERROR')
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new CacheServiceError(`Failed to check cache key existence: ${errorMessage}`, 'REDIS_EXISTS_ERROR')
    }
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
    try {
      const cached = await this.get<T>(key)
      if (cached !== null) {
        return cached
      }
      
      const data = await fetcher()
      await this.set(key, data, ttl)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new CacheServiceError(`Failed to get or set cache: ${errorMessage}`, 'REDIS_GET_OR_SET_ERROR')
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(keys)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new CacheServiceError(`Failed to invalidate cache pattern: ${errorMessage}`, 'REDIS_INVALIDATE_ERROR')
    }
  }
}

class MemoryCacheService implements CacheService {
  private cache = new Map<string, { value: unknown; expires?: number }>()

  constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires && entry.expires < now) {
        this.cache.delete(key)
      }
    }
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }
    
    if (entry.expires && entry.expires < Date.now()) {
      this.cache.delete(key)
      return null
    }
    
    return entry.value as T
  }

  async set<T = unknown>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: { value: unknown; expires?: number } = { value }
    
    if (ttl) {
      entry.expires = Date.now() + (ttl * 1000)
    }
    
    this.cache.set(key, entry)
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key)
    if (!entry) {
      return false
    }
    
    if (entry.expires && entry.expires < Date.now()) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }
    
    const data = await fetcher()
    await this.set(key, data, ttl)
    return data
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

// Driver Registry
const cacheDrivers = {
  'redis': () => new RedisCacheService(),
  'memory': () => new MemoryCacheService()
} as const

// Service Factory
export function createCacheService(driver: string): CacheService {
  const factory = cacheDrivers[driver as keyof typeof cacheDrivers]
  if (!factory) {
    throw new Error(`Unknown cache driver: ${driver}`)
  }
  return factory()
}

// Export Singleton - Dynamic config resolution
const cacheDriver = config.cache.driver

export const cacheService = createCacheService(cacheDriver)
