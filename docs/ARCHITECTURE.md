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

## Configuration Management

### Driver-Based Configuration Pattern

The application uses a **driver-based configuration pattern** that allows switching between different implementations for core services through environment variables. This provides flexibility for different environments (development, staging, production) and makes the application easily configurable.

### Configuration Structure

**Location**: `src/config/index.ts`

The configuration system uses **Zod validation** for type-safe environment variable parsing and provides a centralized configuration object that can be imported throughout the application.

```typescript
// src/config/index.ts
import z from "zod";

const envSchema = z.object({
  // Application
  PORT: z.number().default(3000),
  APP_NAME: z.string().default("Affiliate Portal"),
  APP_URL: z.string().default("http://localhost:3000"),
  APP_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Database
  DATABASE_URL: z.string(),
  
  // Session
  SESSION_JWT_SECRET: z.string(),
  SESSION_COOKIE_NAME: z.string().default("afp-token"),
  SESSION_COOKIE_DURATION: z.number().default(43200),
  
  // Email
  MAIL_DRIVER: z.enum(["smtp", "log"]).default("log"),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.number().optional(),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_FROM_NAME: z.string().optional(),
  
  // SMS
  SMS_DRIVER: z.enum(["twilio", "log"]).default("log"),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  
  // Cache
  CACHE_DRIVER: z.enum(["redis", "memory"]).default("memory"),
  REDIS_URL: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.number().default(0),
  
  // Storage
  STORAGE_DRIVER: z.enum(["s3", "local"]).default("local"),
  LOCAL_PATH: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
});

const env = envSchema.parse(process.env);

export const config = {
  // Application
  port: env.PORT,
  app: {
    name: env.APP_NAME,
    url: env.APP_URL,
    env: env.APP_ENV,
  },
  
  // Database
  db: {
    url: env.DATABASE_URL,
  },
  
  // Session
  session: {
    jwtSecret: env.SESSION_JWT_SECRET,
    cookieName: env.SESSION_COOKIE_NAME,
    cookieDuration: env.SESSION_COOKIE_DURATION,
  },
  
  // Email
  email: {
    driver: env.MAIL_DRIVER,
    smtp: {
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
      from: env.MAIL_FROM,
      fromName: env.MAIL_FROM_NAME,
    },
  },
  
  // SMS
  sms: {
    driver: env.SMS_DRIVER,
    twilio: {
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
      phoneNumber: env.TWILIO_PHONE_NUMBER,
    },
  },
  
  // Cache
  cache: {
    driver: env.CACHE_DRIVER,
    redis: {
      url: env.REDIS_URL,
      password: env.REDIS_PASSWORD,
      db: env.REDIS_DB,
    },
  },
  
  // Storage
  storage: {
    driver: env.STORAGE_DRIVER,
    s3: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      bucket: env.AWS_S3_BUCKET,
    },
    local: {
      path: env.LOCAL_PATH,
    },
  },
};
```

### Supported Drivers

#### Email Drivers
- **`smtp`**: Production email delivery via SMTP
- **`log`**: Development logging (emails logged to console)

#### SMS Drivers
- **`twilio`**: Production SMS delivery via Twilio
- **`log`**: Development logging (SMS logged to console)

#### Storage Drivers
- **`s3`**: Production file storage via AWS S3
- **`local`**: Development local file storage

#### Cache Drivers
- **`redis`**: Production caching via Redis
- **`memory`**: Development in-memory caching

### Environment Configuration

**Location**: `.env.example`

Environment variables are organized by service categories with clear documentation:

```bash
# APPLICATION
APP_NAME="Affiliate Portal"
APP_URL="http://localhost:3000"
APP_ENV="development"

# DATABASE
DATABASE_URL="postgresql://username:password@localhost:5432/affiliate_portal"

# SESSION
SESSION_JWT_SECRET="your-jwt-secret"
SESSION_COOKIE_NAME="afp-token"
SESSION_COOKIE_DURATION="43200"

# MAIL
MAIL_DRIVER="smtp" # smtp, log
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"
MAIL_FROM="noreply@affiliate-portal.com"
MAIL_FROM_NAME="Affiliate Portal"

# SMS
SMS_DRIVER="twilio" # twilio, log
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# CACHE
CACHE_DRIVER="memory" # memory, redis
# REDIS_URL="redis://localhost:6379"
# REDIS_PASSWORD=""
# REDIS_DB=0

# STORAGE
STORAGE_DRIVER="local" # local, s3
# AWS_ACCESS_KEY_ID="your-aws-access-key-id"
# AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
# AWS_REGION="us-east-1"
# AWS_S3_BUCKET="your-s3-bucket-name"
```

### Usage in Services

Services can use the configuration to determine which driver to use:

```typescript
// services/email.service.ts
import { config } from '@/config';

export const EmailService = {
  async sendEmail(params: EmailParams) {
    switch (config.email.driver) {
      case 'smtp':
        return this.sendViaSMTP(params);
      case 'log':
        return this.logEmail(params);
      default:
        throw new Error(`Unsupported email driver: ${config.email.driver}`);
    }
  },

  async sendViaSMTP(params: EmailParams) {
    // SMTP implementation using config.email.smtp
  },

  async logEmail(params: EmailParams) {
    console.log('Email would be sent:', params);
  }
};
```

### Benefits

✅ **Environment Flexibility**: Easy switching between development and production drivers  
✅ **Type Safety**: Full TypeScript support with Zod validation  
✅ **Centralized Configuration**: Single source of truth for all configuration  
✅ **Validation**: Environment variables are validated at startup  
✅ **Documentation**: Clear documentation of all available options  
✅ **Extensibility**: Easy to add new drivers or configuration options  
✅ **Development Friendly**: Sensible defaults for development environment  

### Architecture Decision

**Configuration Management**: The application uses a driver-based configuration pattern with Zod validation. This approach provides:

- **Type safety** through Zod schema validation
- **Environment flexibility** via driver switching
- **Centralized management** of all configuration
- **Clear documentation** of available options
- **Development-friendly defaults** for easy setup

This configuration architecture ensures that the application can be easily configured for different environments while maintaining type safety and providing clear documentation for all configuration options.

## Model Architecture

### Panel-Scoped Model Structure

The application uses a **panel-scoped model architecture** where each panel (admin, brand, affiliate) has its own set of models that provide data access tailored to that panel's specific needs and security requirements.

#### Model Philosophy

**Models are Database Access Layers**, not ORM entities. They can:
- Return single rows, multiple rows, or aggregated data
- Transform data that doesn't match database structure
- Return boolean results for validation/checks
- Handle complex queries and business logic
- Provide panel-specific data views with appropriate security boundaries

#### Directory Structure

```
src/
  models/
    admin/
      ├── auth.model.ts          # Admin authentication & user data access
      ├── brand.model.ts          # Brand data access for admin context
      ├── affiliate.model.ts      # Affiliate data access for admin context
      ├── campaign.model.ts       # Campaign data access for admin context
      └── payout.model.ts         # Payout data access for admin context
    
    brand/
      ├── auth.model.ts           # Brand authentication & user data access
      ├── affiliate.model.ts      # Affiliate data access for brand context
      ├── campaign.model.ts       # Campaign data access for brand context
      └── payout.model.ts         # Payout data access for brand context
    
    affiliate/
      ├── auth.model.ts           # Affiliate authentication & user data access
      ├── brand.model.ts          # Brand data access for affiliate context (limited)
      ├── campaign.model.ts       # Campaign data access for affiliate context
      └── payout.model.ts         # Payout data access for affiliate context
```

#### Naming Convention

- **Singular naming**: `admin.model.ts` (not `admins.model.ts`)
- **Panel context**: Each panel folder provides the context
- **Auth models**: `auth.model.ts` for authentication-related data access
- **Entity models**: `brand.model.ts`, `affiliate.model.ts`, etc.

#### Model Examples

**Admin Panel Models** - Full access to all data:

```typescript
// models/admin/brand.model.ts
export const AdminBrandModel = {
  async getAllBrands(): Promise<BrandSummary[]> {
    // Returns all brands with admin-level details
    return await db.select({
      id: brands.id,
      name: brands.name,
      email: brands.email,
      website: brands.website,
      status: brands.status,
      createdAt: brands.createdAt,
      totalAffiliates: sql<number>`count(${affiliates.id})`,
      totalRevenue: sql<number>`sum(${conversions.saleAmount})`
    })
    .from(brands)
    .leftJoin(affiliates, eq(affiliates.brandId, brands.id))
    .leftJoin(conversions, eq(conversions.brandId, brands.id))
    .groupBy(brands.id);
  },

  async getBrandDetails(id: number): Promise<BrandDetails> {
    // Returns complete brand information for admin
    return await db.select().from(brands).where(eq(brands.id, id));
  },

  async updateBrandStatus(id: number, status: string): Promise<boolean> {
    // Admin can change any brand's status
    await db.update(brands).set({ status }).where(eq(brands.id, id));
    return true;
  }
};
```

**Brand Panel Models** - Brand's own data and affiliate management:

```typescript
// models/brand/auth.model.ts
export const BrandAuthModel = {
  async authenticate(email: string, password: string): Promise<Brand | null> {
    // Brand authentication with their own data
    return await db.select().from(brands)
      .where(and(
        eq(brands.email, email),
        eq(brands.status, 'active')
      ));
  },

  async getBrandProfile(id: number): Promise<BrandProfile> {
    // Returns brand's own profile data
    return await db.select({
      id: brands.id,
      name: brands.name,
      email: brands.email,
      website: brands.website,
      settings: brands.settings
    }).from(brands).where(eq(brands.id, id));
  }
};

// models/brand/affiliate.model.ts
export const BrandAffiliateModel = {
  async getAffiliates(brandId: number): Promise<AffiliateSummary[]> {
    // Returns affiliates for this specific brand
    return await db.select({
      id: affiliates.id,
      name: affiliates.name,
      email: affiliates.email,
      status: affiliates.status,
      totalClicks: sql<number>`count(${clicks.id})`,
      totalConversions: sql<number>`count(${conversions.id})`
    })
    .from(affiliates)
    .leftJoin(clicks, eq(clicks.affiliateId, affiliates.id))
    .leftJoin(conversions, eq(conversions.affiliateId, affiliates.id))
    .where(eq(affiliates.brandId, brandId))
    .groupBy(affiliates.id);
  },

  async approveAffiliate(affiliateId: number, brandId: number): Promise<boolean> {
    // Brand can only approve their own affiliates
    await db.update(affiliates)
      .set({ status: 'approved' })
      .where(and(
        eq(affiliates.id, affiliateId),
        eq(affiliates.brandId, brandId)
      ));
    return true;
  }
};
```

**Affiliate Panel Models** - Limited access to brand data:

```typescript
// models/affiliate/brand.model.ts
export const AffiliateBrandModel = {
  async getBrandPublicInfo(brandId: number): Promise<BrandPublicInfo> {
    // Returns only public brand information for affiliates
    return await db.select({
      id: brands.id,
      name: brands.name,
      website: brands.website,
      logo: brands.logo,
      description: brands.description
    }).from(brands).where(eq(brands.id, brandId));
  },

  async getAvailableCampaigns(brandId: number): Promise<CampaignSummary[]> {
    // Returns only active campaigns that affiliates can promote
    return await db.select({
      id: campaigns.id,
      title: campaigns.title,
      description: campaigns.description,
      commissionRate: commissionRates.value
    })
    .from(campaigns)
    .leftJoin(commissionRates, eq(commissionRates.campaignId, campaigns.id))
    .where(and(
      eq(campaigns.brandId, brandId),
      eq(campaigns.isActive, true)
    ));
  },

  async isBrandActive(brandId: number): Promise<boolean> {
    // Simple check if brand is active
    const brand = await db.select({ status: brands.status })
      .from(brands)
      .where(eq(brands.id, brandId));
    return brand[0]?.status === 'active';
  }
};
```

#### Security Benefits

**Data Isolation**: Each panel only sees data appropriate for its context
- **Admin**: Full access to all data across all brands
- **Brand**: Access to own data + affiliate data for their brand only
- **Affiliate**: Limited access to brand public data + own affiliate data

**No Data Leakage**: Impossible to accidentally expose sensitive data between panels

**Clear Boundaries**: Each model is scoped to its panel's requirements

#### Business Logic Benefits

**Panel-Specific Views**: Each panel gets exactly the data it needs
- **Admin Brand Model**: Includes performance metrics, system settings, audit logs
- **Brand Brand Model**: Includes settings they can modify, their own metrics
- **Affiliate Brand Model**: Only public information, available campaigns

**No Generic Complexity**: Avoids the complexity of generic models with conditional logic

**Maintainable**: Changes to one panel's data requirements don't affect others

#### Performance Benefits

**Optimized Queries**: Each model is optimized for its specific use case
- **Admin queries**: Include aggregations and joins for comprehensive views
- **Brand queries**: Focused on their specific data and relationships
- **Affiliate queries**: Lightweight, public data only

**No Over-fetching**: Each panel only retrieves the data it actually needs

#### Architecture Decision

**Model Structure**: The application uses panel-scoped models rather than generic models. This approach provides:

- **Security by design** through data isolation
- **Performance optimization** through panel-specific queries
- **Maintainability** through clear boundaries
- **Type safety** through panel-specific interfaces
- **Business logic clarity** through context-appropriate data access

This model architecture ensures that each panel has exactly the data access it needs while maintaining security boundaries and performance optimization.

## Directory Structure

### App Router Structure (Next.js 13+)

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/            # Admin portal routes
│   │   ├── routes.ts       # Admin panel route definitions
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── brands/
│   │       ├── page.tsx
│   │       ├── [id]/
│   │       │   ├── page.tsx
│   │       │   └── edit/page.tsx
│   │       └── create/page.tsx
│   │
│   ├── (brand)/            # Brand portal routes
│   │   ├── routes.ts       # Brand panel route definitions
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── affiliates/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   └── create/page.tsx
│   │   ├── campaigns/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   └── create/page.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── payouts/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   └── create/page.tsx
│   │   ├── refer-earn-settings/page.tsx
│   │   ├── affiliate-signup-settings/page.tsx
│   │   └── general-settings/page.tsx
│   │
│   ├── (affiliate)/        # Affiliate portal routes (with brand context)
│   │   ├── routes.ts       # Affiliate panel route definitions
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # /affiliate/login?brand=acme
│   │   │   ├── register/page.tsx   # /affiliate/register?brand=acme
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Handles brand context
│   │   │   └── page.tsx            # /affiliate/dashboard?brand=acme
│   │   ├── links/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   └── create/page.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── payouts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── general-settings/page.tsx
│   │
│   ├── (referral)/         # Referral access routes
│   │   └── referral/page.tsx
│   │
│   ├── link/               # Public link redirects
│   │   └── [linkCode]/page.tsx     # /link/abc123
│   │
│   └── api/                # API Routes (External access only)
│       └── referral/
│           ├── links/route.ts
│           ├── links/[id]/route.ts
│           ├── stats/route.ts
│           ├── track/route.ts
│           └── generate/route.ts
│
├── actions/                # Server Actions (User authentication)
│   ├── auth/
│   │   ├── login.ts
│   │   ├── register.ts
│   │   ├── logout.ts
│   │   ├── start-impersonation.ts
│   │   └── stop-impersonation.ts
│   ├── admin/
│   │   └── brands.ts
│   ├── brand/
│   │   ├── affiliates.ts
│   │   ├── campaigns.ts
│   │   └── payouts.ts
│   └── affiliate/
│       ├── links.ts
│       └── reports.ts
│
├── models/                 # Data access + business logic
│   ├── brand.model.ts
│   ├── affiliate.model.ts
│   ├── campaign.model.ts
│   ├── link.model.ts
│   └── payout.model.ts
│
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
│
├── lib/                    # Core utilities
│   ├── cache.ts            # Caching utilities for auth data
│   ├── api-auth.ts         # API key validation
│   └── utils.ts
│
├── db/                     # Database
│   ├── db.ts
│   └── schema.ts
│
└── utils/                  # Utilities
    ├── response.ts
    └── validation.ts
```

### Route Groups Explanation

**Route Groups** `(groupName)` are Next.js 13+ features that allow organizing routes without affecting the URL structure:

- **`(admin)`**: Admin portal routes - `/admin/*`
- **`(brand)`**: Brand portal routes - `/brand/*`  
- **`(affiliate)`**: Affiliate portal routes - `/affiliate/*` (with brand context)
- **`(referral)`**: Referral access routes - `/referral/*`

### Brand Context Resolution

Affiliate routes use **brand context** via query parameters and middleware rewriting:

1. **URL with brand**: `/affiliate/login?brand=acme`
2. **Middleware rewrite**: `/affiliate/login?brand=acme` → `/brand/acme/affiliate/login`
3. **Clean URLs**: After rewrite, URLs appear clean to users
4. **Brand context**: Available in all affiliate pages via `params.brandCode`

### Folder Structure Benefits

✅ **Clear separation** by user type (admin, brand, affiliate)  
✅ **Consistent patterns** across all portals  
✅ **Brand context** automatically available for affiliates  
✅ **Scalable structure** - easy to add new modules  
✅ **Clean URLs** after middleware rewrite  
✅ **Single codebase** for affiliate functionality  

### Adding New Modules

To add a new module to any portal:

1. **Admin Portal**: Add to `(admin)/new-module/`
2. **Brand Portal**: Add to `(brand)/new-module/`
3. **Affiliate Portal**: Add to `(affiliate)/new-module/`

**Standard module structure:**
```
new-module/
├── page.tsx           # List/view page
├── [id]/
│   ├── page.tsx       # View details
│   └── edit/page.tsx  # Edit form
└── create/page.tsx    # Create form
```

**Required files for each module:**
- **Model**: `models/new-module.model.ts`
- **Actions**: `actions/new-module.ts` (or appropriate category)
- **API Routes**: `api/new-module/` (if external access needed)

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
  const token = await getCurrentUser();
  if (!token) redirect('/login');
  
  const userPermissions = await UserModel.getPermissions(token.user.id);
  
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
- **Comprehensive caching** for user and brand data

**Services Include**:
- **Email Service**: SendGrid, SMTP integration
- **SMS Service**: Twilio, SMS providers
- **Storage Service**: File uploads, cloud storage
- **Cache Service**: Redis, in-memory caching with TTL and invalidation
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
  },

  // ARCHITECTURE DECISION: Comprehensive caching with TTL and invalidation
  // This provides fast data access while ensuring data consistency
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get(key);
    if (cached) return JSON.parse(cached);
    
    const data = await fetcher();
    await this.set(key, data, ttl);
    return data;
  },

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
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

### JWT-Only Approach
- **JWT in httpOnly cookie**: For automatic authentication
- **Server-side resolution**: All auth data comes from JWT token
- **No hostname parsing**: Brand context included in JWT payload
- **Comprehensive caching**: Full user/brand data cached with TTL
- **Simple and secure**: No client-side token handling

### Auth Module Structure
```
src/auth/
├── user.ts         # User context helpers (getCurrentUser, getFullUser, getCachedUser)
├── brand.ts        # Brand context helpers (getCurrentBrand, getFullBrand, getCachedBrand)
└── lib/
    └── cache.ts    # Caching utilities for auth data
```

## Comprehensive Caching Strategy

### Caching Architecture

The application uses a **multi-level caching strategy** to optimize performance and reduce database overhead:

**Cache Levels:**
1. **JWT Token Data**: Essential user/brand info in token payload (always available)
2. **Cached User Data**: Full user details with TTL (1 hour default)
3. **Cached Brand Data**: Full brand details with TTL (1 hour default)
4. **Cache Invalidation**: Automatic clearing on data changes

**Helper Functions:**
- `getCurrentUser()`: Decode JWT token and return as-is
- `getFullUser()`: Get user from database using token.user.id
- `getCachedUser()`: Use cache with getFullUser() as fallback
- `getCurrentBrand()`: Return token.brand directly from JWT
- `getFullBrand()`: Get brand from database using token.brand.id
- `getCachedBrand()`: Use cache with getFullBrand() as fallback

### Cache Implementation

```typescript
// Cache configuration
const CACHE_TTL = 3600 // 1 hour
const CACHE_PREFIX = {
  USER: 'user:',
  BRAND: 'brand:',
  USER_BRAND: 'user:brand:'
}

// Usage in auth modules
export async function getCachedUser(): Promise<User | null> {
  const token = await getCurrentUser()
  if (!token) return null
  
  return CacheService.getOrSet(
    `user:${token.user.id}`,
    () => getFullUser(),
    CACHE_TTL
  )
}

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

### Cache Invalidation Strategy

**Automatic Invalidation:**
- **User data changes** → Clear user cache
- **Brand data changes** → Clear brand cache + all user caches for that brand
- **Brand status changes** → Clear all related caches

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
  
  // Invalidate all user caches for this brand
  await CacheService.invalidate(`user:*:brand:${brandId}`)
  
  return brand
}
```

### Brand Status Handling

**Status Levels:**
- **`active`** - Normal operation
- **`inactive`** - Show warning, limited access, no new registrations
- **`suspended`** - Immediate redirect to login

**Implementation:**
```typescript
// In layout or middleware
const brand = await getCachedBrand()
if (brand?.status === 'suspended') {
  return redirect('/login?message=brand-suspended')
} else if (brand?.status === 'inactive') {
  return <InactiveBrandWarning />
}
```

### Performance Benefits

**Why this caching approach:**
- ✅ **Fast API responses** via cached data
- ✅ **Minimal database overhead** for repeated requests
- ✅ **No complex token invalidation** needed (cache handles it)
- ✅ **Automatic data consistency** via cache invalidation
- ✅ **Scalable** - works with any number of application instances
- ✅ **Simple implementation** - no complex refresh logic needed

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

## Routing Architecture

### Centralized Route Management

The application uses a centralized routing system inspired by Laravel's route management approach. This provides type safety, maintainability, and a single source of truth for all application routes.

### Route Structure

Each panel (admin, brands, affiliate, demo) has its own route configuration file placed at the root of each panel directory, above the `(auth)` and `(dashboard)` folders:

```
src/app/
├── (admin)/
│   ├── routes.ts          # Admin panel routes
│   ├── (auth)/
│   └── (dashboard)/
├── (brands)/
│   ├── routes.ts          # Brands panel routes
│   ├── (auth)/
│   └── (dashboard)/
├── (affiliate)/
│   ├── routes.ts          # Affiliate panel routes
│   ├── (auth)/
│   └── (dashboard)/
└── (demo)/
    ├── routes.ts          # Demo panel routes
    ├── (auth)/
    └── (dashboard)/
```

### Route Definition Format

Routes can be defined in two formats:

**Simple String Format** (most common):
```typescript
'demo.dashboard': '/demo/dashboard'
'demo.login': '/demo/login'
```

**Object Format** (for routes with parameters):
```typescript
'demo.users.show': {
  path: '/demo/users/[id]',
  params: { id: 'string' },
  query: ['page', 'limit'] // optional query params this route accepts
}
```

### Shared Route Utilities

All route logic is centralized in `src/lib/routes.ts`:

```typescript
// lib/routes.ts - Shared utilities and types
export type RouteValue = string | number | boolean
export type RouteParams = Record<string, RouteValue>
export type RouteQuery = Record<string, RouteValue>

export type SimpleRoute = string
export type ComplexRoute = {
  path: string
  params?: RouteParams
  query?: RouteQuery
}

export type RouteDefinition = SimpleRoute | ComplexRoute
export type RouteConfig = Record<string, RouteDefinition>

// Shared route building logic
export function buildRoute(
  routeDef: RouteDefinition,
  params?: RouteParams,
  query?: RouteQuery,
  baseUrl: string = '/'
): string
```

### Panel-Specific Route Files

Each panel exports its own `getRoute` and `getFullRoute` functions:

```typescript
// app/(demo)/routes.ts
import { buildRoute, buildFullRoute, type RouteConfig } from '@/lib/routes'

const routes: RouteConfig = {
  'demo.dashboard': '/demo/dashboard',
  'demo.users.show': {
    path: '/demo/users/[id]',
    params: { id: 'string' },
    query: { edit: 'boolean' }
  }
} as const

export function getRoute(
  routeName: keyof typeof routes,
  params?: RouteParams,
  query?: RouteQuery
): string {
  return buildRoute(routes[routeName], params, query)
}

export function getFullRoute(
  routeName: keyof typeof routes,
  params?: RouteParams,
  query?: RouteQuery
): string {
  // Get base URL from environment or use localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  process.env.VERCEL_URL || 
                  'http://localhost:3000'
  
  return buildRoute(routes[routeName], params, query, baseUrl)
}
```

### Route Naming Convention

Routes follow Laravel's dot notation pattern:

```typescript
// Demo routes
'demo.dashboard'
'demo.users.index'
'demo.users.create'
'demo.users.show'
'demo.users.edit'
'demo.users.store'
'demo.users.update'
'demo.users.destroy'

// Admin routes
'admin.dashboard'
'admin.brands.index'
'admin.brands.create'
'admin.brands.show'
'admin.brands.edit'
```

### Usage Examples

```typescript
// In demo panel
import { getRoute, getFullRoute } from './routes'

// Simple routes
getRoute('demo.dashboard')  // '/demo/dashboard'

// With params
getRoute('demo.users.show', { id: '123' })  // '/demo/users/123'

// With params + query
getRoute('demo.users.show', { id: '123' }, { edit: true })  // '/demo/users/123?edit=true'

// Full URL
getFullRoute('demo.users.show', { id: '123' })  // 'https://app.com/demo/users/123' (uses env base URL)
```

### Benefits

✅ **Type Safety**: TypeScript prevents invalid route usage and parameter mismatches
✅ **Centralized Management**: Single source of truth for all routes
✅ **Refactoring Safety**: Changing file structure doesn't break route references
✅ **Developer Experience**: Clear overview of all available routes
✅ **Consistency**: Uniform way to handle routing across the app
✅ **Panel Separation**: Each panel manages its own routes, reducing coupling
✅ **Laravel-inspired**: Familiar dot notation for route naming

### Architecture Decision

**Route Management**: The application uses a centralized routing system with panel-specific route files. This approach provides:

- **Type safety** to prevent route and parameter mismatches
- **Shared utilities** to avoid code duplication
- **Panel separation** for better organization
- **Laravel-inspired naming** for consistency
- **Simple extensions** when complex route definitions are needed

This routing architecture ensures that route changes can be made in one place without affecting the rest of the application, while providing full TypeScript support for route names, parameters, and query strings.

## Conclusion

This architecture provides a solid foundation for the Affiliate Portal application. It balances simplicity with scalability, follows established patterns, and provides clear separation of concerns. The modular approach allows for easy maintenance and future enhancements while keeping the codebase understandable and maintainable.

The key principles of interface segregation, single responsibility, and simple but powerful design ensure that the application can grow and evolve while maintaining code quality and developer productivity.
