# Authentication System

This document outlines the authentication system implementation for the Affiliate Portal application.

## Overview

The authentication system uses **JWT-based authentication** with **server actions** for user interactions and **API key authentication** for external access. The system supports **impersonation** functionality for admin and brand users.

## Core Principles

### 1. Simple and Secure
- **JWT tokens** with configurable expiration (14 days default)
- **Single cookie** approach for authentication
- **Server-side user resolution** with automatic caching
- **No auto-refresh** - users manually log in when expired

### 2. Progressive Enhancement
- **Server actions** work without JavaScript
- **Automatic redirects** after authentication
- **Form-based authentication** with proper HTTP semantics

### 3. Multi-tenant Support
- **Brand context** resolution via middleware
- **User type separation** (admin, brand, affiliate)
- **Impersonation** support for admin and brand users

## Authentication Strategy

### JWT Token Structure

```typescript
interface JWTPayload {
  userId: number
  userType: 'admin' | 'brand' | 'affiliate'
  email: string
  name: string
  brandId?: number // for affiliates
  
  // Impersonation data (when impersonating)
  impersonatingAs?: {
    userId: number
    userType: 'admin' | 'brand' | 'affiliate'
    email: string
    name: string
    brandId?: number
  }
  
  iat: number
  exp: number
}
```

### Cookie Configuration

```bash
# .env.local
AUTH_COOKIE_NAME=affiliate_auth_token
SESSION_DURATION=14d
JWT_SECRET=your_jwt_secret_here
```

**Cookie Settings:**
- **HttpOnly**: Prevents client-side access
- **Secure**: HTTPS only in production
- **SameSite**: Lax for CSRF protection
- **MaxAge**: 30 days (configurable)

## User Types and Registration

### User Types

1. **Admins**
   - **Registration**: Manual creation only (no public registration)
   - **Access**: Full system access, brand management
   - **Impersonation**: Can impersonate brands

2. **Brands**
   - **Registration**: Can register publicly
   - **Access**: Manage affiliates, campaigns, payouts
   - **Impersonation**: Can impersonate affiliates

3. **Affiliates**
   - **Registration**: Can register publicly (with brand context)
   - **Access**: Generate links, view reports, manage payouts
   - **Impersonation**: Cannot impersonate others

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
  const token = createAuthToken(user)
  setAuthCookie(token)
  
  // Redirect to appropriate dashboard
  redirect(getDashboardUrl(userType))
}
```

## Brand Context Resolution

### URL Strategy

Affiliate routes use **subdomains** with **middleware rewriting**:

1. **User visits**: `acme.mysystem.com/affiliate/login`
2. **Middleware rewrites**: `acme.mysystem.com/affiliate/login` → `app.mysystem.com/affiliate/login?brand=acme`
3. **Clean URLs**: Users see clean subdomain URLs
4. **Brand context**: Available in all affiliate pages via query parameter `brand`

### Middleware Implementation

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0]
  
  // Skip if it's the main domain or www
  if (subdomain === 'app' || subdomain === 'www' || subdomain === 'localhost') {
    return NextResponse.next()
  }
  
  // If it's a brand subdomain and affiliate route
  if (url.pathname.startsWith('/affiliate/')) {
    // Rewrite to main domain with brand context
    url.hostname = 'app.mysystem.com' // or your main domain
    url.searchParams.set('brand', subdomain)
    
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}
```

### Brand Context Helper

```typescript
// auth/brand.ts
import { headers } from 'next/headers'
import { getBrandByCode } from '@/models/brand.model'

export async function getCurrentBrand(): Promise<{ brand: Brand | null, brandCode: string | null }> {
  try {
    const headersList = await headers()
    const hostname = headersList.get('host') || ''
    
    // Extract subdomain
    const subdomain = hostname.split('.')[0]
    
    // Skip if it's the main domain
    if (subdomain === 'app' || subdomain === 'www' || subdomain === 'localhost') {
      return { brand: null, brandCode: null }
    }
    
    // Get brand by subdomain
    const brand = await getBrandByCode(subdomain)
    
    return { brand, brandCode: subdomain }
  } catch (error) {
    console.error('Error getting current brand:', error)
    return { brand: null, brandCode: null }
  }
}
```

### Brand Context Access

```typescript
// app/(affiliate)/(dashboard)/layout.tsx
import { getCurrentBrand } from '@/auth/brand'

export default async function AffiliateLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const { brand, brandCode } = await getCurrentBrand()
  
  if (!brandCode || !brand) {
    redirect('/affiliate/login')
  }
  
  if (!user || user.type !== 'affiliate') {
    redirect('/affiliate/login')
  }
  
  return (
    <div>
      <BrandHeader brand={brand} />
      <AffiliateSidebar user={user} brand={brand} />
      <main>{children}</main>
    </div>
  )
}
```

### Usage Examples

```typescript
// Server component - Get brand context
export default async function AffiliateDashboard() {
  const { brand, brandCode } = await getCurrentBrand()
  
  if (!brand) {
    return <div>Invalid brand</div>
  }
  
  return (
    <div>
      <h1>Welcome to {brand.name}</h1>
      <p>Brand Code: {brandCode}</p>
    </div>
  )
}

// Server action - Use brand context
export async function createAffiliateLink(formData: FormData) {
  const { brand } = await getCurrentBrand()
  
  if (!brand) {
    throw new Error('Brand context required')
  }
  
  // Create link for this specific brand
  const link = await createLink({
    brandId: brand.id,
    // ... other data
  })
  
  return link
}
```

### Alternative: Brand Context Hook (Client-side)

```typescript
// hooks/useBrandContext.ts
'use client'
import { useEffect, useState } from 'react'

export function useBrandContext() {
  const [brand, setBrand] = useState(null)
  const [brandCode, setBrandCode] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const getBrand = async () => {
      try {
        const response = await fetch('/api/brand/current')
        if (response.ok) {
          const data = await response.json()
          setBrand(data.brand)
          setBrandCode(data.brandCode)
        }
      } catch (error) {
        console.error('Failed to get brand context:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getBrand()
  }, [])
  
  return {
    brand,
    brandCode,
    loading,
    isBrandSpecific: !!brandCode
  }
}
```

## User Context Management

### Server-Side State (Recommended)

**Why server-side state:**
- ✅ **Automatic caching** by Next.js within same request
- ✅ **No client-side complexity** for auth state
- ✅ **Always up-to-date** user data
- ✅ **Better security** - no client-side user data
- ✅ **Minimal bundle size**

### Implementation Pattern

```typescript
// auth/user.ts
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('affiliate_auth_token')?.value
  
  if (!token) return null
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    
    if (payload.impersonatingAs) {
      // Return impersonated user
      return {
        id: payload.impersonatingAs.userId,
        type: payload.impersonatingAs.userType,
        email: payload.impersonatingAs.email,
        name: payload.impersonatingAs.name,
        brandId: payload.impersonatingAs.brandId,
        isImpersonating: true,
        originalUser: {
          id: payload.userId,
          type: payload.userType,
          email: payload.email,
          name: payload.name
        }
      }
    }
    
    // Return original user
    return {
      id: payload.userId,
      type: payload.userType,
      email: payload.email,
      name: payload.name,
      brandId: payload.brandId,
      isImpersonating: false
    }
  } catch {
    return null // Token expired or invalid
  }
}
```

### Layout-Level Authentication

```typescript
// app/(dashboard)/layout.tsx
import { getCurrentUser } from '@/auth/user'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Custom redirects based on user state
  if (user.emailVerified === false) {
    redirect('/verify-email')
  }
  
  if (user.subscriptionStatus === 'expired') {
    redirect('/billing')
  }
  
  return (
    <AuthProvider user={user}>
      {children}
    </AuthProvider>
  )
}
```

### Page Access

```typescript
// Server-side: Use helper function
export default async function DashboardPage() {
  const user = await getCurrentUser() // Cached by Next.js
  return <div>Welcome {user.name}!</div>
}

// Client-side: Use hook (when needed)
'use client'
export default function ClientComponent() {
  const { user } = useAuth()
  return <div>Welcome {user.name}!</div>
}
```

## Client-Side Auth Hook

### Auth Context Provider

```typescript
// contexts/AuthContext.tsx
'use client'
import { createContext, useContext, useState } from 'react'

interface User {
  id: number
  type: 'admin' | 'brand' | 'affiliate'
  email: string
  name: string
  brandId?: number
  isImpersonating?: boolean
  originalUser?: {
    id: number
    type: string
    email: string
    name: string
  }
}

interface AuthContextType {
  user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode
  initialUser: User | null 
}) {
  const [user] = useState<User | null>(initialUser)

  return (
    <AuthContext.Provider value={{ user }}>
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
import { getCurrentUser } from '@/auth/user'
import { AuthProvider } from '@/contexts/AuthContext'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <AuthProvider initialUser={user}>
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

### Client-Side Usage Examples

```typescript
// Client component with auth
'use client'
import { useAuth } from '@/contexts/AuthContext'

export default function UserProfile() {
  const { user } = useAuth()
  
  if (!user) {
    return <div>Not authenticated</div>
  }
  
  const isImpersonating = user.isImpersonating || false
  
  return (
    <div className="space-y-4">
      <div>
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <p>Type: {user.type}</p>
        {user.brandId && <p>Brand ID: {user.brandId}</p>}
      </div>
      
      {isImpersonating && user.originalUser && (
        <div className="bg-yellow-100 p-4 rounded">
          <p>Impersonating as {user.originalUser.name}</p>
          <p className="text-sm text-gray-600">
            Original user: {user.originalUser?.name} ({user.originalUser?.type})
          </p>
        </div>
      )}
    </div>
  )
}
```

### Login Form with Server Actions

```typescript
// Client component with login form using server actions
'use client'
import { login } from '@/actions/auth'
import { useState } from 'react'

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'brand',
    brandCode: ''
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formDataObj = new FormData()
      formDataObj.append('email', formData.email)
      formDataObj.append('password', formData.password)
      formDataObj.append('userType', formData.userType)
      if (formData.brandCode) formDataObj.append('brandCode', formData.brandCode)
      
      await login(formDataObj)
      // Server action will redirect on success
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>User Type</label>
        <select
          value={formData.userType}
          onChange={(e) => setFormData({...formData, userType: e.target.value})}
        >
          <option value="admin">Admin</option>
          <option value="brand">Brand</option>
          <option value="affiliate">Affiliate</option>
        </select>
      </div>
      
      {formData.userType === 'affiliate' && (
        <div>
          <label>Brand Code</label>
          <input
            type="text"
            value={formData.brandCode}
            onChange={(e) => setFormData({...formData, brandCode: e.target.value})}
            placeholder="Enter brand code"
          />
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Impersonation Banner Component

```typescript
// components/ImpersonationBanner.tsx
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { stopImpersonation } from '@/actions/auth'

export function ImpersonationBanner() {
  const { user } = useAuth()
  
  if (!user || !user.isImpersonating) return null
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">
            Impersonating as <strong>{user.name}</strong> ({user.type})
          </p>
          {user.originalUser && (
            <p className="text-xs text-gray-600">
              Original user: {user.originalUser.name} ({user.originalUser.type})
            </p>
          )}
        </div>
        <form action={stopImpersonation}>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          >
            Stop Impersonating
          </button>
        </form>
      </div>
    </div>
  )
}
```

### Auth Guard Component

```typescript
// components/AuthGuard.tsx
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredUserType?: 'admin' | 'brand' | 'affiliate'
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requiredUserType, 
  fallback = <div>Access denied</div> 
}: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return fallback
  }
  
  if (requiredUserType && user.type !== requiredUserType) {
    return fallback
  }
  
  return <>{children}</>
}

// Usage
export default function AdminOnlyPage() {
  return (
    <AuthGuard requiredUserType="admin">
      <div>Admin content here</div>
    </AuthGuard>
  )
}
```


## Impersonation System

### JWT Payload Extension Approach

**Why JWT payload extension:**
- ✅ **Single cookie** - simpler management
- ✅ **No cookie conflicts** - one source of truth
- ✅ **Easier debugging** - all auth state in one place
- ✅ **Better security** - fewer cookies to manage

### Impersonation Flow

```typescript
// Start impersonation
export async function startImpersonation(targetUserId: number, targetUserType: string) {
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
  
  // Create new token with impersonation data
  const newToken = jwt.sign({
    userId: currentUser.id,
    userType: currentUser.type,
    email: currentUser.email,
    name: currentUser.name,
    brandId: currentUser.brandId,
    
    // Impersonation data
    impersonatingAs: {
      userId: targetUser.id,
      userType: targetUser.type,
      email: targetUser.email,
      name: targetUser.name,
      brandId: targetUser.brandId
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
  
  if (!payload.impersonatingAs) {
    throw new Error('Not impersonating')
  }
  
  // Create new token without impersonation data
  const newToken = jwt.sign({
    userId: payload.userId,
    userType: payload.userType,
    email: payload.email,
    name: payload.name,
    brandId: payload.brandId
    // No impersonatingAs field = back to original user
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
  redirect(getDashboardUrl(payload.userType))
}
```

### Impersonation UI

```typescript
// Impersonation banner component
export function ImpersonationBanner() {
  const { user } = useAuth()
  
  if (!user || !user.isImpersonating) return null
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">
            Impersonating as <strong>{user.name}</strong> ({user.type})
          </p>
        </div>
        <form action={stopImpersonation}>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          >
            Stop Impersonating
          </button>
        </form>
      </div>
    </div>
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
  
  // Create token and set cookie
  const token = createAuthToken(user)
  const cookieStore = cookies()
  cookieStore.set('affiliate_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60
  })
  
  // Redirect to appropriate dashboard
  if (user.type === 'admin') {
    redirect('/admin/dashboard')
  } else if (user.type === 'brand') {
    redirect('/brand/dashboard')
  } else {
    redirect('/affiliate/dashboard')
  }
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

## Security Considerations

### Token Security
- **JWT with short expiration** (14 days configurable)
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
if (userType === 'affiliate' && !brandCode) {
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

## Future Enhancements

### Auto-Refresh (Optional)
```typescript
// Client-side auto-refresh (if needed)
'use client'
export function useAuth() {
  useEffect(() => {
    const checkToken = async () => {
      const response = await fetch('/api/auth/me')
      if (response.status === 401) {
        window.location.href = '/login'
      }
    }
    
    const interval = setInterval(checkToken, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
}
```

### Session Management (Optional)
```typescript
// Database sessions (if needed)
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: integer('user_id').notNull(),
  userType: varchar('user_type', { length: 20 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
```

## Conclusion

This authentication system provides:

✅ **Simple implementation** - JWT cookies, no database sessions  
✅ **Brand context** - Automatic via middleware rewrite  
✅ **Server-side auth** - Layout-level user resolution  
✅ **Progressive enhancement** - Server actions work without JS  
✅ **Clean URLs** - After middleware rewrite  
✅ **Impersonation support** - JWT payload extension  
✅ **Secure** - No client-side token handling  
✅ **Maintainable** - Clear patterns and structure  

The system balances simplicity with security, providing a solid foundation for the affiliate portal while remaining easy to understand and maintain.
