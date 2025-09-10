import { FileStorage } from '@flystorage/file-storage'
import { LocalStorageAdapter } from '@flystorage/local-fs'
import { AwsS3StorageAdapter } from '@flystorage/aws-s3'
import { S3Client } from '@aws-sdk/client-s3'
import { config } from '@/config'

// Service Error Class
export class StorageServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'StorageServiceError'
  }
}

// Local storage config type
interface LocalStorageConfig {
  path: string
  publicUrl?: string
}

// S3 storage config type
interface S3StorageConfig {
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
}

// Driver Registry
const storageDrivers = {
  'local': (config: LocalStorageConfig) => {
    if (!config?.path) {
      throw new StorageServiceError('Local storage config missing required field: path', 'CONFIG_ERROR')
    }
    
    return new FileStorage(
      new LocalStorageAdapter(config.path)
    )
  },

  's3': (config: S3StorageConfig) => {
    if (!config?.bucket || !config?.region || !config?.accessKeyId || !config?.secretAccessKey) {
      throw new StorageServiceError('S3 storage config missing required fields: bucket, region, accessKeyId, secretAccessKey', 'CONFIG_ERROR')
    }
    
    const s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
    
    return new FileStorage(
      new AwsS3StorageAdapter(s3Client, {
        bucket: config.bucket,
        publicUrlOptions: {
          generatePublicUrl: (path: string) => {
            return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`
          }
        }
      })
    )
  }
} as const

// Service Factory
export function createStorageService(driver: string, driverConfig?: LocalStorageConfig | S3StorageConfig): FileStorage {
  try {
    if (driver === 'local') {
      const factory = storageDrivers.local
      return factory(driverConfig as LocalStorageConfig)
    } else if (driver === 's3') {
      const factory = storageDrivers.s3
      return factory(driverConfig as S3StorageConfig)
    }
    throw new StorageServiceError(`Unknown storage driver: ${driver}`, 'UNKNOWN_DRIVER')
  } catch (error) {
    if (error instanceof StorageServiceError) {
      throw error
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new StorageServiceError(`Failed to initialize storage driver: ${errorMessage}`, 'INIT_ERROR')
  }
}

// Dynamic config resolution - automatically selects the right config
const storageDriver = config.storage.driver
const storageDriverConfig = config.storage[storageDriver as keyof Omit<typeof config.storage, 'driver'>] as LocalStorageConfig | S3StorageConfig

// Export Singleton
export const storageService = createStorageService(storageDriver, storageDriverConfig)
