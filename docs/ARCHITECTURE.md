# Affiliate Portal Architecture

## Overview

This document outlines the architectural decisions and patterns for the Affiliate Portal application. The architecture follows a simple, elegant, and scalable approach that balances simplicity with maintainability.

## Core Principles

### 1. Interface Segregation
Each interface (API Routes, Actions, Pages) is optimized for its specific purpose and nature:
- **API Routes**: Stateless, external contracts, HTTP-aware
- **Actions**: Stateful, user-centric, form-aware
- **Pages**: Render-centric, SEO-optimized, static

### 2. Single Responsibility
- **Models**: Data access + business logic
- **Actions**: User interaction handling
- **API Routes**: External interface
- **Services**: Third-party integrations

### 3. Simple but Powerful
- No over-engineering
- Familiar patterns (Laravel-like)
- Clear boundaries
- Minimal complexity

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/
│   │   └── dashboard/page.tsx
│   ├── brand/
│   │   └── dashboard/page.tsx
│   ├── affiliate/
│   │   └── dashboard/page.tsx
│   └── api/                # API Routes (Next.js convention)
│       └── brand/route.ts
├── models/                 # Data access + business logic
│   ├── brand.model.ts
│   └── affiliate.model.ts
├── actions/                # Server Actions (like controllers)
│   ├── brand.action.ts
│   └── affiliate.action.ts
├── services/               # Third-party integrations
│   ├── email.service.ts
│   ├── sms.service.ts
│   ├── storage.service.ts
│   ├── cache.service.ts
│   ├── logging.service.ts
│   ├── rate-limiting.service.ts
│   ├── crypto.service.ts
│   ├── code-generation.service.ts
│   └── helpers/
│       ├── formatting.ts
│       ├── validation.ts
│       └── utils.ts
├── auth/                   # Authentication module
│   ├── jwt.ts
│   ├── user.ts
│   └── middleware.ts
├── db/                     # Database
│   ├── db.ts
│   └── schema.ts
└── utils/                  # Utilities
    ├── response.ts
    └── validation.ts
```

## Architecture Layers

### 1. Models Layer
**Purpose**: Data access + business logic
**Location**: `src/models/`
**Responsibilities**:
- Database operations (CRUD, queries, relationships)
- Entity-specific business logic
- Raw data return (no formatting)

**Example**:
```typescript
// models/brand.model.ts
export const BrandModel = {
  async create(data: CreateBrandData) {
    const [brand] = await db.insert(brands).values(data).returning();
    return brand; // Raw database result
  },
  
  async getAll() {
    return await db.select().from(brands);
  },
  
  async findById(id: string) {
    return await db.select().from(brands).where(eq(brands.id, id));
  },
  
  async update(id: string, data: UpdateBrandData) {
    const [brand] = await db.update(brands).set(data).where(eq(brands.id, id)).returning();
    return brand;
  }
};
```

### 2. Actions Layer
**Purpose**: User interaction handling (like Laravel controllers)
**Location**: `src/actions/`
**Responsibilities**:
- Handle form submissions
- User interactions
- State management (revalidation, redirects)
- Form-specific validation and error handling

**Example**:
```typescript
// actions/brand.action.ts
'use server'

import { BrandModel } from '@/models/brand.model';
import { AffiliateModel } from '@/models/affiliate.model';
import { EmailService } from '@/services/email.service';
import { revalidatePath, redirect } from 'next/navigation';
import { z } from 'zod';

// ARCHITECTURE DECISION: Validation schemas are defined locally in each file
// This keeps validation logic close to where it's used and avoids spreading schemas across the app
const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

const approveAffiliateSchema = z.object({
  affiliateId: z.string().uuid('Invalid affiliate ID')
});

// ARCHITECTURE DECISION: Actions handle user interactions and form submissions
// They are stateful, user-centric, and form-aware with built-in revalidation
export async function createBrand(data: unknown) {
  try {
    // ARCHITECTURE DECISION: Validation happens at the action level
    // This ensures data integrity before reaching the model layer
    const validated = createBrandSchema.parse(data);
    
    // ARCHITECTURE DECISION: Actions call models directly for data operations
    // No service layer abstraction - keep it simple and direct
    const brand = await BrandModel.create(validated);
    
    // ARCHITECTURE DECISION: Actions handle state management
    // Revalidation ensures UI updates, redirects provide user feedback
    revalidatePath('/brands');
    redirect('/brands');
    
  } catch (error) {
    // ARCHITECTURE DECISION: Actions handle form-specific error responses
    // Different from API routes - actions return form-friendly error objects
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.flatten().fieldErrors 
      };
    }
    throw error;
  }
}

// ARCHITECTURE DECISION: Actions can handle complex business operations
// They orchestrate multiple models and services as needed
export async function approveAffiliate(affiliateId: string) {
  try {
    const validated = approveAffiliateSchema.parse({ affiliateId });
    
    // Multiple model operations in a single action
    const affiliate = await AffiliateModel.findById(validated.affiliateId);
    const brand = await BrandModel.findById(affiliate.brandId);
    
    // Business logic: Update affiliate status
    await AffiliateModel.updateStatus(validated.affiliateId, 'approved');
    
    // ARCHITECTURE DECISION: Actions can call services for side effects
    // Email notifications, logging, etc. happen at the action level
    await EmailService.sendEmail({
      to: affiliate.email,
      from: 'noreply@affiliateportal.com',
      subject: 'Affiliate Application Approved',
      content: `Congratulations! Your application for ${brand.name} has been approved.`
    });
    
    revalidatePath('/admin/affiliates');
    return { success: true };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.flatten().fieldErrors 
      };
    }
    throw error;
  }
}
```

### 3. API Routes Layer
**Purpose**: External interface
**Location**: `src/app/api/`
**Responsibilities**:
- Handle external requests
- HTTP protocol handling
- API-specific validation and responses
- Rate limiting, authentication

**Example**:
```typescript
// app/api/brand/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BrandModel } from '@/models/brand.model';
import { z } from 'zod';

// ARCHITECTURE DECISION: Validation schemas are defined locally in each file
// This keeps validation logic close to where it's used and avoids spreading schemas across the app
const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters')
});

const getBrandsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional()
});

// ARCHITECTURE DECISION: API routes are stateless and HTTP-aware
// They handle external requests with proper HTTP semantics and status codes
export async function POST(request: NextRequest) {
  try {
    // ARCHITECTURE DECISION: API routes handle HTTP protocol specifics
    // JSON parsing, content-type validation, etc.
    const data = await request.json();
    
    // ARCHITECTURE DECISION: Validation schemas are defined locally
    // This ensures validation logic is close to where it's used
    const validated = createBrandSchema.parse(data);
    
    // ARCHITECTURE DECISION: API routes call models directly
    // No service layer abstraction - keep it simple and performant
    const brand = await BrandModel.create(validated);
    
    // ARCHITECTURE DECISION: API routes return structured JSON responses
    // Different from actions - no redirects, proper HTTP status codes
    return NextResponse.json({ 
      success: true, 
      data: brand 
    }, { status: 201 });
    
  } catch (error) {
    // ARCHITECTURE DECISION: API routes handle HTTP-specific error responses
    // Proper status codes, structured error objects for external consumers
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// ARCHITECTURE DECISION: API routes can handle complex external operations
// They orchestrate multiple models and services for external integrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // ARCHITECTURE DECISION: Query parameter validation with local schemas
    // This ensures type safety and validation for external API consumers
    const validated = getBrandsQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search')
    });
    
    // ARCHITECTURE DECISION: API routes can implement pagination, filtering
    // They handle query parameters and return paginated responses
    const brands = await BrandModel.getPaginated({ 
      page: validated.page, 
      limit: validated.limit,
      search: validated.search 
    });
    const total = await BrandModel.getCount({ search: validated.search });
    
    return NextResponse.json({
      success: true,
      data: brands,
      meta: {
        page: validated.page,
        limit: validated.limit,
        total,
        totalPages: Math.ceil(total / validated.limit)
      }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid query parameters',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch brands' 
    }, { status: 500 });
  }
}
```

### 4. Pages Layer
**Purpose**: Server-side rendering
**Location**: `src/app/`
**Responsibilities**:
- Data fetching for rendering
- SEO optimization
- Static generation
- Layout and UI

**Example**:
```typescript
// app/brands/page.tsx
import { BrandModel } from '@/models/brand.model';
import { AffiliateModel } from '@/models/affiliate.model';
import { UserModel } from '@/models/user.model';
import { getCurrentUser } from '@/auth/user';
import { BrandsList } from '@/components/BrandsList';
import { Suspense } from 'react';

// ARCHITECTURE DECISION: Pages handle server-side rendering and data fetching
// They are render-centric, SEO-optimized, and can load multiple data sources
export default async function BrandsPage() {
  // ARCHITECTURE DECISION: Pages can load user context and permissions
  // This enables role-based rendering and access control
  const currentUser = await getCurrentUser();
  const userPermissions = await UserModel.getPermissions(currentUser.id);
  
  // ARCHITECTURE DECISION: Pages can load multiple models in parallel
  // This optimizes performance by avoiding sequential database calls
  const [brands, affiliateStats, userBrands] = await Promise.all([
    BrandModel.getAll(),
    AffiliateModel.getStats(),
    currentUser.role === 'affiliate' 
      ? AffiliateModel.getByUserId(currentUser.id)
      : Promise.resolve([])
  ]);
  
  // ARCHITECTURE DECISION: Pages handle conditional rendering based on data
  // Different content for different user roles and permissions
  const canCreateBrand = userPermissions.includes('brand:create');
  const canViewAllBrands = userPermissions.includes('brand:view:all');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brands</h1>
        {canCreateBrand && (
          <button className="btn btn-primary">Create Brand</button>
        )}
      </div>
      
      {/* ARCHITECTURE DECISION: Pages can show loading states with Suspense */}
      {/* This provides better UX during data fetching */}
      <Suspense fallback={<div>Loading brand statistics...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <h3>Total Brands</h3>
            <p className="text-2xl font-bold">{brands.length}</p>
          </div>
          <div className="card">
            <h3>Active Affiliates</h3>
            <p className="text-2xl font-bold">{affiliateStats.active}</p>
          </div>
          <div className="card">
            <h3>Your Brands</h3>
            <p className="text-2xl font-bold">{userBrands.length}</p>
          </div>
        </div>
      </Suspense>
      
      {/* ARCHITECTURE DECISION: Pages handle conditional content rendering */}
      {/* Different views for different user roles */}
      {canViewAllBrands ? (
        <BrandsList brands={brands} showAll={true} />
      ) : (
        <BrandsList brands={userBrands} showAll={false} />
      )}
    </div>
  );
}
```

### 5. Services Layer
**Purpose**: Third-party integrations and cross-cutting concerns
**Location**: `src/services/`
**Responsibilities**:
- External API integrations
- Cross-cutting concerns (logging, caching, notifications)
- Reusable business logic across the application

**Services Include**:
- **Email Service**: SendGrid, SMTP integration
- **SMS Service**: Twilio, SMS providers
- **Storage Service**: File uploads, cloud storage
- **Cache Service**: Redis, in-memory caching
- **Logging Service**: Structured logging, error tracking
- **Rate Limiting Service**: Request rate limiting
- **Crypto Service**: Encryption, hashing
- **Code Generation Service**: Entity code generation
- **Helpers**: Formatting, validation utilities

**Examples**:

```typescript
// services/email.service.ts
// ARCHITECTURE DECISION: Services are simple, focused functions
// They handle third-party integrations with minimal abstraction
export const EmailService = {
  async sendEmail(params: {
    to: string;
    from: string;
    subject: string;
    content: string;
    html?: string;
  }) {
    await sendGrid.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.content,
      html: params.html || params.content
    });
  }
};

// services/sms.service.ts
export const SMSService = {
  async sendSMS(params: {
    to: string;
    message: string;
    from?: string;
  }) {
    await twilio.messages.create({
      to: params.to,
      from: params.from || process.env.TWILIO_PHONE,
      body: params.message
    });
  }
};

// services/storage.service.ts
export const StorageService = {
  async upload(file: File, path: string): Promise<string> {
    const buffer = await file.arrayBuffer();
    const url = await cloudinary.uploader.upload(
      `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`,
      { public_id: path }
    );
    return url.secure_url;
  },

  async delete(path: string): Promise<void> {
    await cloudinary.uploader.destroy(path);
  },

  async getSignedUrl(path: string): Promise<string> {
    return await cloudinary.url(path, { sign_url: true });
  }
};

// services/cache.service.ts
export const CacheService = {
  async get(key: string): Promise<any> {
    return await redis.get(key);
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await redis.setex(key, ttl, JSON.stringify(value));
    } else {
      await redis.set(key, JSON.stringify(value));
    }
  },

  async delete(key: string): Promise<void> {
    await redis.del(key);
  },

  async exists(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  }
};

// services/code-generation.service.ts
// ARCHITECTURE DECISION: Code generation is a separate service
// This keeps the logic centralized and reusable across all entities
export const CodeGenerationService = {
  generateCode(id: string, createdAt: Date): string {
    // Simple and scalable: ID + timestamp approach
    const combined = id + createdAt.getTime().toString();
    return base62.encode(combined);
  }
};
```

## Data Flow Patterns

### 1. Page Rendering
```
Page Component → Model → Database
```
- Pages call models directly for data fetching
- No action layer needed for read operations
- Optimized for server-side rendering

### 2. User Interactions
```
Frontend Form → Action → Model → Database
```
- Actions handle form submissions
- Include validation, error handling, redirects
- State management (revalidation, cache updates)

### 3. External API Requests
```
External Client → API Route → Model → Database
```
- API routes handle external requests
- HTTP-specific validation and responses
- Rate limiting and authentication

## Validation Strategy

### Zod Integration
- **Local schemas**: Validation schemas defined locally in each file where they're used
- **Interface-specific handling**: Different error responses per interface
- **Type safety**: Zod provides TypeScript types
- **No shared schemas**: Avoid spreading validation logic across the application

**Architecture Decision**: Validation schemas are defined locally in each action or API route file rather than being shared across the application. This approach:

- ✅ **Keeps validation close to usage**: Schemas are defined where they're used
- ✅ **Avoids coupling**: No shared validation files that create dependencies
- ✅ **Enables flexibility**: Each interface can have its own validation requirements
- ✅ **Simplifies maintenance**: Changes to validation don't affect other parts of the app
- ✅ **Reduces complexity**: No need to manage shared schema exports/imports

**Example**:
```typescript
// actions/brand.action.ts
import { z } from 'zod';

// Schema defined locally in the action file
const createBrandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  website: z.string().url('Invalid website URL')
});

export async function createBrand(data: unknown) {
  const validated = createBrandSchema.parse(data);
  // ... rest of the action
}
```

```typescript
// app/api/brand/route.ts
import { z } from 'zod';

// Schema defined locally in the API route file
const createBrandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  website: z.string().url('Invalid website URL')
});

export async function POST(request: Request) {
  const data = await request.json();
  const validated = createBrandSchema.parse(data);
  // ... rest of the API route
}
```

## Response Format Strategy

### Models Return Raw Data
- No formatting or transformation
- Pure database results
- Interface-agnostic

### Interfaces Handle Response Formatting
- **Actions**: Redirects, revalidation, form errors
- **API Routes**: JSON responses, HTTP status codes
- **Pages**: Rendering, SEO, layout

## Code Generation Strategy

### ID + Creation Timestamp Approach
```typescript
// ARCHITECTURE DECISION: Code generation is centralized in a service
// This ensures consistency and reusability across all entities
import { CodeGenerationService } from '@/services/code-generation.service';

// Usage in models
const brandCode = CodeGenerationService.generateBrandCode(brand.id, brand.createdAt);
const affiliateCode = CodeGenerationService.generateAffiliateCode(affiliate.id, affiliate.createdAt);
```

**Benefits**:
- ✅ **Simple**: No complex logic or external dependencies
- ✅ **Scalable**: Works with any number of application instances
- ✅ **Consistent**: Same entity always generates the same code
- ✅ **Debuggable**: Can reverse-engineer to get ID and creation time
- ✅ **No database lookups**: Fast generation
- ✅ **Memory efficient**: No need to store generated codes
- ✅ **Centralized**: Single service handles all code generation
- ✅ **Reusable**: Same logic for brands, affiliates, transactions, etc.

## Authentication Strategy

### JWT + Cookie Approach
- **JWT in response**: For API calls and client-side usage
- **Secure httpOnly cookie**: For automatic authentication
- **Flexibility**: Frontend can use JWT, cookie ensures automatic auth

### Auth Module Structure
```
src/auth/
├── jwt.ts          # Generate/decode JWT tokens
├── user.ts         # Get current user from request
└── middleware.ts   # Auth middleware for protected routes
```

## Error Handling

### Standardized Response Format
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    requestId: string;
  };
}
```

### Error Handling by Interface
- **Actions**: Form errors, validation errors, user-friendly messages
- **API Routes**: HTTP status codes, structured error responses
- **Pages**: Error boundaries, fallback UI

## Performance Considerations

### 1. No Unnecessary Abstractions
- Direct database access in models
- No extra function call layers
- Minimal overhead

### 2. Interface Optimization
- Each interface optimized for its specific use case
- No forced common patterns
- Performance-first approach

### 3. Caching Strategy
- Page-level caching for static content
- API route caching for external endpoints
- Model-level caching for frequently accessed data

## Testing Strategy

### 1. Unit Testing
- **Models**: Test data access and business logic
- **Services**: Test third-party integrations
- **Utils**: Test utility functions

### 2. Integration Testing
- **Actions**: Test user interaction flows
- **API Routes**: Test external interfaces
- **Pages**: Test rendering and data fetching

### 3. Mocking Strategy
- Mock services for external integrations
- Mock models for interface testing
- Mock database for unit tests

## Deployment Considerations

### 1. Environment Configuration
- Database connections
- Service API keys
- JWT secrets
- Rate limiting configuration

### 2. Scaling Strategy
- Horizontal scaling with multiple instances
- Database connection pooling
- Service rate limiting
- Caching strategies

## Security Considerations

### 1. Authentication
- JWT token validation
- Secure cookie handling
- Session management

### 2. Authorization
- Role-based access control
- Resource-level permissions
- API rate limiting

### 3. Data Protection
- Input validation with Zod
- SQL injection prevention (Drizzle ORM)
- XSS protection
- CSRF protection

## Monitoring and Logging

### 1. Structured Logging
- Request/response logging
- Error tracking
- Performance monitoring
- Business metrics

### 2. Health Checks
- Database connectivity
- Service availability
- API endpoint health
- System resource monitoring

## Future Considerations

### 1. Scalability
- Microservices migration path
- Event-driven architecture
- Message queues
- Distributed caching

### 2. Features
- Real-time notifications
- Advanced analytics
- Multi-tenancy
- API versioning

## Conclusion

This architecture provides a solid foundation for the Affiliate Portal application. It balances simplicity with scalability, follows established patterns, and provides clear separation of concerns. The modular approach allows for easy maintenance and future enhancements while keeping the codebase understandable and maintainable.

The key principles of interface segregation, single responsibility, and simple but powerful design ensure that the application can grow and evolve while maintaining code quality and developer productivity.
