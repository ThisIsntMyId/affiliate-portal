'use server';

import { BrandModel } from '@/models/admin/brand.model';
import { BrandStatus } from '@/constants/brand';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cryptoService } from '@/services/crypto.service';
import { revalidatePath } from 'next/cache';
import { base62CodeService } from '@/services/base62-code.service';

// Validation schemas defined locally in this action file
// This keeps validation logic close to where it's used and avoids spreading schemas across the app

const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name must be less than 255 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  trackingDomain: z.string().url('Invalid tracking domain URL').optional().or(z.literal('')),
  status: z.enum([BrandStatus.ACTIVE, BrandStatus.INACTIVE, BrandStatus.SUSPENDED]).optional(),
  timezone: z.string().optional()
});

const updateBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name must be less than 255 characters').optional(),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  status: z.enum([BrandStatus.ACTIVE, BrandStatus.INACTIVE, BrandStatus.SUSPENDED]).optional(),
  timezone: z.string().optional()
});

const brandFiltersSchema = z.object({
  status: z.enum([BrandStatus.ACTIVE, BrandStatus.INACTIVE, BrandStatus.SUSPENDED]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.enum(['latest', 'oldest', 'name-asc', 'name-desc']).default('latest'),
});

/**
 * Create a new brand
 */
export async function createBrand(data: unknown) {
  try {
    const validated = createBrandSchema.parse(data);
    
    // Check if brand with email already exists
    const exists = await BrandModel.brandExistsByEmail(validated.email);
    if (exists) {
      return {
        success: false,
        errors: {
          email: ['A brand with this email already exists']
        }
      };
    }

    // Hash password
    const passwordHash = await cryptoService.hash(validated.password);
    
    // Create brand
    const brand = await BrandModel.createBrand({
      name: validated.name,
      email: validated.email,
      passwordHash,
      website: validated.website || undefined,
      trackingDomain: validated.trackingDomain || undefined,
      status: validated.status || BrandStatus.ACTIVE,
      timezone: validated.timezone || 'UTC'
    });

    
    // Generate code using the base62 service
    const code = base62CodeService.generate(brand.id, brand.createdAt);
    
    // Update brand with generated code
    await BrandModel.updateBrand(brand.id, {code});

    revalidatePath('/admin/brands');
    redirect(`/admin/brands/${brand.id}`);
    
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

/**
 * Update brand by ID
 */
export async function updateBrand(id: number, data: unknown) {
  try {
    const validated = updateBrandSchema.parse(data);

    const brand = await BrandModel.getBrandById(id);
    if (!brand) {
      return {
        success: false,
        error: 'Brand not found'
      }
    }
    
    // Check if email is being changed and if it already exists
    if (validated.email) {
      const exists = await BrandModel.brandExistsByEmail(validated.email);
      if (exists && exists.id !== id) {
        return {
          success: false,
          errors: {
            email: ['A brand with this email already exists']
          }
        };
      }
    }

    // Update brand
    const updatedBrand = await BrandModel.updateBrand(id, {
      ...validated,
      website: validated.website || undefined
    });

    if (!updatedBrand) {
      return {
        success: false,
        error: 'Brand update failed'
      };
    }

    revalidatePath('/admin/brands');
    revalidatePath(`/admin/brands/${id}`);
    return { success: true, data: updatedBrand };
    
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

/**
 * Get paginated brands with filters
 */
export async function getPaginatedBrands(filters: unknown) {
  try {
    const validated = brandFiltersSchema.parse(filters);
    
    const result = await BrandModel.getPaginatedBrands(validated);
    return { success: true, data: result };
    
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