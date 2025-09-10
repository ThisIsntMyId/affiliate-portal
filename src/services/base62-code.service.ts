// services/base62-code.service.ts
import base62 from 'base62'

// Service Error Class
export class Base62CodeServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'Base62CodeServiceError'
  }
}

// Service Interface
interface Base62CodeService {
  generate(id: number, createdAt: Date): string
}

// Base62 Code Service Implementation
class Base62CodeServiceImpl implements Base62CodeService {
  generate(id: number, createdAt: Date): string {
    try {
      // Validate inputs
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new Base62CodeServiceError('Invalid ID provided - must be a positive number', 'INVALID_ID')
      }
      
      if (!createdAt || !(createdAt instanceof Date)) {
        throw new Base62CodeServiceError('Invalid createdAt date provided', 'INVALID_DATE')
      }

      // Create a unique number by combining ID and timestamp
      // This ensures uniqueness while being deterministic
      const timestamp = createdAt.getTime()
      
      // Combine ID with timestamp for uniqueness
      const combined = Math.abs(timestamp + id)
      
      // Convert to base62 for shorter, URL-friendly codes
      const base62Code = base62.encode(combined)
      
      return base62Code
    } catch (error) {
      if (error instanceof Base62CodeServiceError) {
        throw error
      }
      throw new Base62CodeServiceError(
        `Failed to generate base62 code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GENERATION_FAILED'
      )
    }
  }
}

// Export Singleton
export const base62CodeService = new Base62CodeServiceImpl()
