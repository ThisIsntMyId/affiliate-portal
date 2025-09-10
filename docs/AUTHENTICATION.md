# Authentication System

This document outlines the authentication system implementation for the Affiliate Portal application.

## Overview

The authentication system uses **JWT-based authentication** with **comprehensive caching** for optimal performance. The system supports **brand context** for affiliates, **impersonation** functionality for admin and brand users, and **API key authentication** for external access.

## Core Principles

### 1. Simple and Secure
- **JWT tokens** with configurable expiration (2-3 days default)
- **Single cookie** approach for authentication
- **Server-side user resolution** with intelligent caching
- **No auto-refresh** - users manually log in when expired

### 2. Progressive Enhancement
- **Server actions** work without JavaScript
- **Automatic redirects** after authentication
- **Form-based authentication** with proper HTTP semantics

### 3. Multi-tenant Support
- **Brand context** resolution via JWT token (no hostname parsing needed)
- **User type separation** (admin, brand, affiliate)
- **Impersonation** support for admin and brand users
- **Multi-brand users** via separate user records per brand

### 4. Performance-First
- **Comprehensive caching** for user and brand data
- **Cache invalidation** on data changes
- **Fast API responses** via cached data
- **Minimal database overhead** for repeated requests

## JWT Token Structure

### Scoped Data Structure

```typescript
interface JWTPayload {
  user: {
    id: number
    type: 'admin' | 'brand' | 'affiliate'
    email: string
    name: string
    avatar?: string
  }
  
  brand?: {
    id: number
    code: string
    name: string
    website?: string
    logo?: string
  }
  
  impersonateBy?: {
    userId: number
    userType: 'admin' | 'brand' | 'affiliate'
    email: string
    name: string
    avatar?: string
  }
  
  iat: number
  exp: number
}
```

### User Avatar Generation

The `user.avatar` field will initially use **UI Avatars** service to generate avatar URLs based on the username:

```typescript
// Avatar generation utility
export function generateUserAvatar(username: string): string {
  // UI Avatars service - generates avatar from username
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128`
}

// Usage in user creation/update
const userAvatar = generateUserAvatar(user.name)
```

**Future Enhancement:**
- Later, users will be able to upload custom avatars
- The system will fallback to UI Avatars if no custom avatar is set
- Custom avatars will be stored in cloud storage (AWS S3, Cloudinary, etc.)

### Cookie Configuration

```bash
# .env.local
AUTH_COOKIE_NAME=affiliate_auth_token
SESSION_DURATION=2d
JWT_SECRET=your_jwt_secret_here
CACHE_TTL=3600
```

**Cookie Settings:**
- **HttpOnly**: Prevents client-side access
- **Secure**: HTTPS only in production
- **SameSite**: Lax for CSRF protection
- **MaxAge**: 2-3 days (configurable)

## User Types and Registration

### User Types

1. **Admins**
   - **Registration**: Manual creation only (no public registration)
   - **Access**: Full system access, brand management
   - **Impersonation**: Can impersonate brands and affiliates

2. **Brands**
   - **Registration**: Can register publicly
   - **Access**: Manage affiliates, campaigns, payouts
   - **Impersonation**: Can impersonate affiliates

3. **Affiliates**
   - **Registration**: Can register publicly (with brand context)
   - **Access**: Generate links, view reports, manage payouts
   - **Impersonation**: Cannot impersonate others
   - **Multi-brand**: Separate user record per brand (mark@mail.com + brand_id = unique)

4. **Referrers**
   - **Registration**: No registration (created via API/link)
   - **Access**: Temporary access via login links
   - **Impersonation**: Cannot impersonate others

### Registration Flow

```typescript
// Server action for registration
export async function register(formData: FormData) {
  const userType = formData.get('userType') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const brandCode = formData.get('brandCode') as string // for affiliates
  
  // Validate brand exists (for affiliates)
  if (userType === 'affiliate' && brandCode) {
    const brand = await getBrandByCode(brandCode)
    if (!brand) {
      throw new Error('Invalid brand')
    }
  }
  
  // Create user
  const user = await createUser({
    email,
    password,
    userType,
    brandId: brand?.id
  })
  
  // Create token and set cookie
  const token = createAuthToken(user, brand)
  setAuthCookie(token)
  
  // Redirect to appropriate dashboard
  redirect(getDashboardUrl(userType))
}
```

## Implementation

### Core Helper Functions

#### User Context Helpers

```typescript
// auth/user.ts
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { CacheService } from '@/lib/cache'

// Get current user from JWT (decode token and return as-is)
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('affiliate_auth_token')?.value
  
  if (!token) return null
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch {
    return null // Token expired or invalid
  }
}

// Get full user data from database
export async function getFullUser(): Promise<User | null> {
  const token = await getCurrentUser()
  if (!token) return null
  
  return UserModel.findById(token.user.id)
}

// Get cached user data (with database fallback)
export async function getCachedUser(): Promise<User | null> {
  const token = await getCurrentUser()
  if (!token) return null
  
  return CacheService.getOrSet(
    `user:${token.user.id}`,
    () => getFullUser(),
    CACHE_TTL
  )
}
```

#### Brand Context Helpers

```typescript
// auth/brand.ts
import { getCurrentUser } from './user'
import { CacheService } from '@/lib/cache'

// Get current brand from JWT (decode token and return brand data)
export async function getCurrentBrand(): Promise<Brand | null> {
  const token = await getCurrentUser()
  if (!token?.brand) return null
  
  return token.brand
}

// Get full brand data from database
export async function getFullBrand(): Promise<Brand | null> {
  const token = await getCurrentUser()
  if (!token?.brand) return null
  
  return BrandModel.findById(token.brand.id)
}

// Get cached brand data (with database fallback)
export async function getCachedBrand(): Promise<Brand | null> {
  const token = await getCurrentUser()
  if (!token?.brand) return null
  
  return CacheService.getOrSet(
    `brand:${token.brand.id}`,
    () => getFullBrand(),
    CACHE_TTL
  )
}
```

### Why JWT-Only Approach?

**Benefits:**
- ✅ **No hostname parsing** - brand context comes from JWT
- ✅ **Simpler middleware** - no complex URL rewriting
- ✅ **Better performance** - no database queries for basic auth
- ✅ **Cleaner code** - all context in one place
- ✅ **Easier debugging** - all auth state in JWT

**How it works:**
1. User logs in with brand context (for affiliates)
2. Brand data is included in JWT token
3. All subsequent requests use JWT data
4. No need to parse hostnames or query database for basic auth

### Usage Examples

#### Server Components

```typescript
// app/(dashboard)/layout.tsx
import { getCurrentUser, getCurrentBrand } from '@/auth'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const token = await getCurrentUser()
  const brand = await getCurrentBrand()
  
  if (!token) {
    redirect('/login')
  }
  
  return (
    <AuthProvider user={token.user} brand={brand} impersonateBy={token.impersonateBy}>
      {children}
    </AuthProvider>
  )
}

// app/(dashboard)/page.tsx
export default async function DashboardPage() {
  const token = await getCurrentUser() // Cached by Next.js
  const brand = await getCurrentBrand()
  
  return (
    <div>
      <h1>Welcome {token.user.name}!</h1>
      {brand && <p>Brand: {brand.name}</p>}
      {token.impersonateBy && (
        <p>Impersonated by: {token.impersonateBy.name}</p>
      )}
    </div>
  )
}
```

#### Client Components

```typescript
// components/UserProfile.tsx
'use client'
import { useAuth } from '@/contexts/AuthContext'

export function UserProfile() {
  const { user, brand, impersonateBy } = useAuth()
  
  if (!user) {
    return <div>Not authenticated</div>
  }
  
  return (
    <div className="flex items-center space-x-4">
      {user.avatar && (
        <img 
          src={user.avatar} 
          alt={`${user.name} avatar`}
          className="w-12 h-12 rounded-full"
        />
      )}
      <div>
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <p>Type: {user.type}</p>
        {brand && <p>Brand: {brand.name}</p>}
        {impersonateBy && (
          <p className="text-yellow-600">Impersonated by: {impersonateBy.name}</p>
        )}
      </div>
    </div>
  )
}
```

#### Server Actions

```typescript
// actions/auth.ts
'use server'
import { getCurrentUser, getCurrentBrand } from '@/auth'

export async function createAffiliateLink(formData: FormData) {
  const token = await getCurrentUser()
  const brand = await getCurrentBrand()
  
  if (!token || !brand) {
    throw new Error('Authentication required')
  }
  
  // Create link for this specific brand
  const link = await createLink({
    brandId: brand.id,
    userId: token.user.id,
    // ... other data
  })
  
  return link
}
```

## Impersonation System

### Impersonation Flow

```typescript
// Start impersonation
export async function startImpersonation(targetUserId: number) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    throw new Error('Not authenticated')
  }
  
  // Validate impersonation permissions
  if (currentUser.type === 'admin' && targetUserType === 'brand') {
    // Admin can impersonate brands
  } else if (currentUser.type === 'brand' && targetUserType === 'affiliate') {
    // Brand can impersonate affiliates
  } else {
    throw new Error('Insufficient permissions')
  }
  
  // Get target user
  const targetUser = await getUserById(targetUserId)
  const targetBrand = targetUser.brandId ? await getBrandById(targetUser.brandId) : null
  
  // Create new token with impersonation data
  const newToken = jwt.sign({
    user: {
      id: targetUser.id,
      type: targetUser.type,
      email: targetUser.email,
      name: targetUser.name,
      avatar: targetUser.avatar
    },
    brand: targetBrand ? {
      id: targetBrand.id,
      code: targetBrand.code,
      name: targetBrand.name,
      website: targetBrand.website,
      logo: targetBrand.logo
    } : undefined,
    impersonateBy: {
      userId: currentUser.id,
      userType: currentUser.type,
      email: currentUser.email,
      name: currentUser.name,
      avatar: currentUser.avatar
    }
  }, process.env.JWT_SECRET!, {
    expiresIn: process.env.SESSION_DURATION || '14d'
  })
  
  // Update cookie
  const cookieStore = cookies()
  cookieStore.set('affiliate_auth_token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60
  })
  
  // Redirect to target user's dashboard
  redirect(getDashboardUrl(targetUser.type))
}
```

### Stop Impersonation

```typescript
// Stop impersonation
export async function stopImpersonation() {
  const cookieStore = cookies()
  const token = cookieStore.get('affiliate_auth_token')?.value
  
  if (!token) {
    throw new Error('Not authenticated')
  }
  
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  
  if (!payload.impersonateBy) {
    throw new Error('Not impersonating')
  }
  
  // Get original user data
  const originalUser = await getUserById(payload.impersonateBy.userId)
  const originalBrand = originalUser.brandId ? await getBrandById(originalUser.brandId) : null
  
  // Create new token without impersonation data
  const newToken = jwt.sign({
    user: {
      id: originalUser.id,
      type: originalUser.type,
      email: originalUser.email,
      name: originalUser.name,
      avatar: originalUser.avatar
    },
    brand: originalBrand ? {
      id: originalBrand.id,
      code: originalBrand.code,
      name: originalBrand.name,
      website: originalBrand.website,
      logo: originalBrand.logo
    } : undefined
    // No impersonateBy field = back to original user
  }, process.env.JWT_SECRET!, {
    expiresIn: process.env.SESSION_DURATION || '14d'
  })
  
  // Update cookie
  cookieStore.set('affiliate_auth_token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60
  })
  
  // Redirect to original user's dashboard
  redirect(getDashboardUrl(originalUser.type))
}
```

### Impersonation Banner

```typescript
// components/ImpersonationBanner.tsx
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { stopImpersonation } from '@/actions/auth'

export function ImpersonationBanner() {
  const { user, impersonateBy } = useAuth()
  
  if (!user || !impersonateBy) return null
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">
            Impersonating as <strong>{user.name}</strong> ({user.type})
          </p>
          <p className="text-xs text-gray-600">
            Impersonated by: {impersonateBy.name} ({impersonateBy.userType})
          </p>
        </div>
        <form action={stopImpersonation}>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          >
            Return to Original Portal
          </button>
        </form>
      </div>
    </div>
  )
}
```

## Client-Side Auth Context

### Auth Context Provider

```typescript
// contexts/AuthContext.tsx
'use client'
import { createContext, useContext } from 'react'

interface User {
  id: number
  type: 'admin' | 'brand' | 'affiliate'
  email: string
  name: string
  avatar?: string
}

interface Brand {
  id: number
  code: string
  name: string
  website?: string
  logo?: string
}

interface ImpersonateBy {
  userId: number
  userType: 'admin' | 'brand' | 'affiliate'
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  brand: Brand | null
  impersonateBy: ImpersonateBy | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children, 
  user,
  brand,
  impersonateBy
}: { 
  children: React.ReactNode
  user: User | null
  brand: Brand | null
  impersonateBy: ImpersonateBy | null
}) {
  return (
    <AuthContext.Provider value={{ user, brand, impersonateBy }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Layout Integration

```typescript
// app/(dashboard)/layout.tsx
import { getCurrentUser, getCurrentBrand } from '@/auth'
import { AuthProvider } from '@/contexts/AuthContext'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const token = await getCurrentUser()
  const brand = await getCurrentBrand()
  
  if (!token) {
    redirect('/login')
  }
  
  return (
    <AuthProvider 
      user={token.user} 
      brand={brand} 
      impersonateBy={token.impersonateBy || null}
    >
      <ImpersonationBanner />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
```

## Server Actions vs API Routes

### Server Actions (Recommended for Auth)

**Why server actions:**
- ✅ **Automatic redirects** after authentication
- ✅ **Progressive enhancement** (works without JavaScript)
- ✅ **Better security** (no client-side token handling)
- ✅ **Simpler forms** - just `<form action={login}>`
- ✅ **Less code** - no loading states, error handling, etc.

### Implementation

```typescript
// app/actions/auth.ts
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const userType = formData.get('userType') as string
  const brandCode = formData.get('brandCode') as string
  
  // Validate credentials
  const user = await authenticateUser(email, password, userType, brandCode)
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Get brand data if needed
  const brand = user.brandId ? await getBrandById(user.brandId) : null
  
  // Create token and set cookie
  const token = createAuthToken(user, brand)
  const cookieStore = cookies()
  cookieStore.set('affiliate_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60
  })
  
  // Redirect to appropriate dashboard
  redirect(getDashboardUrl(user.type))
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete('affiliate_auth_token')
  redirect('/login')
}
```

### Form Usage

```typescript
// app/(admin)/(auth)/login/page.tsx
import { login } from '@/actions/auth'

export default function AdminLoginPage() {
  return (
    <form action={login}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="userType" type="hidden" value="admin" />
      <button type="submit">Login</button>
    </form>
  )
}
```

## API Key Authentication

### Simple API Key Strategy

**For external access**, we use **API keys** stored in the brands table:

```typescript
// Database schema addition
export const brands = pgTable('brands', {
  // ... existing fields
  apiKey: varchar('api_key', { length: 255 }).unique(),
  // ... other fields
})
```

### API Key Validation

```typescript
// auth/api-auth.ts
export async function validateApiKey(request: Request): Promise<{ brandId: number } | null> {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) return null
  
  const brand = await db.query.brands.findFirst({
    where: eq(brands.apiKey, apiKey)
  })
  
  return brand ? { brandId: brand.id } : null
}
```

### API Route Usage

```typescript
// app/api/referral/stats/route.ts
export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 })
  }
  
  const brand = await db.query.brands.findFirst({
    where: eq(brands.apiKey, apiKey)
  })
  
  if (!brand) {
    return Response.json({ error: 'Invalid API key' }, { status: 401 })
  }
  
  // Return brand-specific data
  const stats = await getReferralStats(brand.id)
  return Response.json(stats)
}
```

## Caching Strategy

### Cache Implementation

```typescript
// lib/cache.ts
const CACHE_TTL = 3600 // 1 hour
const CACHE_PREFIX = {
  USER: 'user:',
  BRAND: 'brand:'
}

export const CacheService = {
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = CACHE_TTL
  ): Promise<T> {
    const cached = await cache.get(key)
    if (cached) return JSON.parse(cached)
    
    const data = await fetcher()
    await cache.setex(key, ttl, JSON.stringify(data))
    return data
  },
  
  async invalidate(pattern: string): Promise<void> {
    const keys = await cache.keys(pattern)
    if (keys.length > 0) {
      await cache.del(...keys)
    }
  }
}
```

### Cache Invalidation

```typescript
// When user data changes
export async function updateUser(userId: number, data: UpdateUserData) {
  const user = await UserModel.update(userId, data)
  
  // Invalidate user cache
  await CacheService.invalidate(`user:${userId}`)
  
  return user
}

// When brand data changes
export async function updateBrand(brandId: number, data: UpdateBrandData) {
  const brand = await BrandModel.update(brandId, data)
  
  // Invalidate brand cache
  await CacheService.invalidate(`brand:${brandId}`)
  
  return brand
}
```

## Security Considerations

### Token Security
- **JWT with short expiration** (2-3 days configurable)
- **Secure cookie settings** (HttpOnly, Secure, SameSite)
- **No client-side token handling** for user authentication

### Impersonation Security
- **Permission-based impersonation** (only admins can impersonate brands)
- **Audit logging** for all impersonation actions (future enhancement)
- **Time-limited impersonation** sessions (same as regular sessions)

### Brand Isolation
- **Strict data access controls** based on user type and brand
- **Brand-specific data filtering** in all queries
- **API key validation** for external access

## Performance Considerations

### Next.js Caching
- **Automatic caching** of `getCurrentUser()` calls within same request
- **No performance impact** from layout-level auth checks
- **Standard pattern** used by major applications

### Database Queries
- **Simple user lookup** by ID (fast)
- **JWT verification** (no database query needed)
- **Minimal database queries** for auth operations

## Error Handling

### Authentication Errors
```typescript
// Token expired or invalid
if (!user) {
  redirect('/login')
}

// Insufficient permissions
if (user.type !== 'admin') {
  throw new Error('Unauthorized')
}

// Brand context missing
if (userType === 'affiliate' && !brand) {
  throw new Error('Brand context required')
}
```

### Form Error Handling
```typescript
// Server action error handling
export async function login(formData: FormData) {
  try {
    // ... authentication logic
  } catch (error) {
    if (error instanceof ValidationError) {
      return { 
        success: false, 
        errors: error.flatten().fieldErrors 
      }
    }
    throw error
  }
}
```

## Conclusion

This authentication system provides:

✅ **Simple implementation** - JWT cookies, no database sessions  
✅ **Brand context** - Automatic via JWT token  
✅ **Server-side auth** - Layout-level user resolution  
✅ **Progressive enhancement** - Server actions work without JS  
✅ **Clean URLs** - No hostname parsing needed  
✅ **Impersonation support** - JWT payload extension  
✅ **Secure** - No client-side token handling  
✅ **Maintainable** - Clear patterns and structure  

The system balances simplicity with security, providing a solid foundation for the affiliate portal while remaining easy to understand and maintain.