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
import { createBrandSchema } from '@/utils/validation';

export async function createBrand(data: unknown) {
  try {
    const validated = createBrandSchema.parse(data);
    const brand = await BrandModel.create(validated);
    
    revalidatePath('/brands');
    redirect('/brands');
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
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = createBrandSchema.parse(data);
    const brand = await BrandModel.create(validated);
    
    return NextResponse.json({ 
      success: true, 
      data: brand 
    });
  } catch (error) {
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
export default async function BrandsPage() {
  const brands = await BrandModel.getAll();
  
  return (
    <div>
      <h1>Brands</h1>
      <BrandsList brands={brands} />
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
- **Helpers**: Formatting, validation utilities

**Example**:
```typescript
// services/email.service.ts
export const EmailService = {
  async sendWelcomeEmail(email: string) {
    await sendGrid.send({
      to: email,
      subject: 'Welcome!',
      html: '<h1>Welcome to our platform!</h1>'
    });
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
- **Shared schemas**: Same validation schemas across all interfaces
- **Interface-specific handling**: Different error responses per interface
- **Type safety**: Zod provides TypeScript types

**Example**:
```typescript
// utils/validation.ts
import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  website: z.string().url('Invalid website URL')
});

// Used in actions, API routes, and forms
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
// Simple and scalable code generation
const generateCode = (id: string, createdAt: Date) => {
  return base62(id + createdAt.getTime());
};

// Usage
const brandCode = generateCode(brand.id, brand.createdAt);
```

**Benefits**:
- ✅ **Simple**: No complex logic or external dependencies
- ✅ **Scalable**: Works with any number of application instances
- ✅ **Consistent**: Same entity always generates the same code
- ✅ **Debuggable**: Can reverse-engineer to get ID and creation time
- ✅ **No database lookups**: Fast generation
- ✅ **Memory efficient**: No need to store generated codes

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
