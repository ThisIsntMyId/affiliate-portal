import { cookies } from 'next/headers';
import { config } from '@/config';
import { cacheService } from '@/services/cache.service';
import { jwtService } from '@/services/jwt.service';
import { AuthModel } from '@/models/brand/auth.model';

// Brand JWT Payload interface
export interface BrandJWTPayload {
  user: {
    id: number;
    type: 'brand';
    email: string;
    name: string;
    logo?: string;
  };
  iat: number;
  exp: number;
}

interface Brand {
  id: number;
  email: string;
  name: string;
  logo?: string;
  type: 'brand';
}

// Cache TTL for brand data (1 hour)
const CACHE_TTL = 3600;

// JWT Helper Functions
export function createJWTToken(brand: Brand): string {
  const payload = {
    user: {
      id: brand.id,
      type: 'brand' as const,
      email: brand.email,
      name: brand.name || 'Brand',
      logo: brand.logo || undefined,
    },
  };

  return jwtService.sign(payload);
}

export function decodeJWTToken(token: string): BrandJWTPayload | null {
  try {
    return jwtService.verify(token) as unknown as BrandJWTPayload;
  } catch {
    return null;
  }
}

// Get current user from JWT (decode token and return as-is)
export async function getCurrentUser(): Promise<BrandJWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.session.cookieName)?.value;
  
  if (!token) return null;
  
  return decodeJWTToken(token);
}

// Get full brand data from database
export async function getFullUser() {
  const token = await getCurrentUser();
  if (!token) return null;
  
  const brand = await AuthModel.findByEmail(token.user.email);
  if (!brand) return null;
  
  return {
    id: brand.id,
    email: brand.email,
    name: brand.name || 'Brand',
    logo: brand.logo || undefined,
    status: brand.status,
    type: 'brand' as const,
  };
}

// Get cached brand data (with database fallback)
export async function getCachedUser() {
  const token = await getCurrentUser();
  if (!token) return null;
  
  return cacheService.getOrSet(
    `user:brand:${token.user.id}`,
    () => getFullUser(),
    CACHE_TTL
  );
}
