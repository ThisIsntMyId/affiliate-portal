import jwt from 'jsonwebtoken';
import { config } from '@/config';

// JWT Service Error Class
export class JWTServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'JWTServiceError';
  }
}

// JWT Service Interface
interface JWTService {
  sign(payload: Record<string, unknown>): string;
  verify(token: string): Record<string, unknown>;
  decode(token: string): Record<string, unknown> | null;
}

// JWT Service Implementation
class JWTServiceImpl implements JWTService {
  private secret: string;

  constructor(secret: string) {
    if (!secret) {
      throw new Error('JWT secret is required');
    }
    this.secret = secret;
  }

  sign(payload: Record<string, unknown>): string {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn: config.session.cookieDuration,
      });
    } catch (error) {
      throw new JWTServiceError(
        `Failed to sign JWT: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SIGN_ERROR'
      );
    }
  }

  verify(token: string): Record<string, unknown> {
    try {
      return jwt.verify(token, this.secret) as Record<string, unknown>;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new JWTServiceError('JWT token has expired', 'TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new JWTServiceError('Invalid JWT token', 'INVALID_TOKEN');
      }
      throw new JWTServiceError(
        `Failed to verify JWT: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'VERIFY_ERROR'
      );
    }
  }

  decode(token: string): Record<string, unknown> | null {
    try {
      return jwt.decode(token) as Record<string, unknown> | null;
    } catch {
      return null;
    }
  }
}

// Export Singleton
export const jwtService = new JWTServiceImpl(config.session.jwtSecret);
