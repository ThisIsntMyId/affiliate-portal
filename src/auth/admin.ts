import { cookies } from 'next/headers';
import { config } from '@/config';
import { cacheService } from '@/services/cache.service';
import { jwtService } from '@/services/jwt.service';
import { AuthModel } from '@/models/admin/auth.model';

// Admin JWT Payload interface
export interface AdminJWTPayload {
  user: {
    id: number;
    type: 'admin';
    email: string;
    name: string;
    avatar?: string;
  };
  iat: number;
  exp: number;
}

interface Admin {
  id: number;
  email: string;
  name: string;
  type: 'admin';
}



// Cache TTL for admin data (1 hour)
const CACHE_TTL = 3600;

// JWT Helper Functions
export function createJWTToken(admin: Admin): string {
  const payload = {
    user: {
      id: admin.id,
      type: 'admin' as const,
      email: admin.email,
      name: admin.name || 'Admin',
      avatar: admin.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=random&color=fff&size=128` : undefined,
    },
  };

  return jwtService.sign(payload);
}

export function decodeJWTToken(token: string): AdminJWTPayload | null {
  try {
    return jwtService.verify(token) as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

// Get current user from JWT (decode token and return as-is)
export async function getCurrentUser(): Promise<AdminJWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.session.cookieName)?.value;
  
  if (!token) return null;
  
  return decodeJWTToken(token);
}

// Get full admin data from database
export async function getFullUser() {
  const token = await getCurrentUser();
  if (!token) return null;
  
  const admin = await AuthModel.findByEmail(token.user.email);
  if (!admin) return null;
  
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name || 'Admin',
    type: 'admin' as const,
  };
}

// Get cached admin data (with database fallback)
export async function getCachedUser() {
  const token = await getCurrentUser();
  if (!token) return null;
  
  return cacheService.getOrSet(
    `user:admin:${token.user.id}`,
    () => getFullUser(),
    CACHE_TTL
  );
}
