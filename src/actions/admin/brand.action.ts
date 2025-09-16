'use server';

import { BrandModel } from '@/models/admin/brand.model';
import { BrandStatus, BRAND_LOGO_MAX_SIZE, BRAND_LOGO_ALLOWED_TYPES, BRAND_LOGO_UPLOAD_PATH } from '@/constants/brand';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cryptoService } from '@/services/crypto.service';
import { revalidatePath } from 'next/cache';
import { generateCode } from '@/lib/generateCode';
import { publishFile } from '@/lib/fileStorage';
import { createErrorResponse, createSuccessResponse, createZodValidationErrorResponse, createValidationErrorResponse } from '@/lib/response';

// Validation schemas defined locally in this action file
// This keeps validation logic close to where it's used and avoids spreading schemas across the app

const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name must be less than 255 characters'),
  email: z.email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  logo: z.file()
    .max(BRAND_LOGO_MAX_SIZE, 'File size too large. Maximum size is 5MB.')
    .mime(BRAND_LOGO_ALLOWED_TYPES, 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.'),
  website: z.url('Invalid website URL').or(z.literal('')),
  trackingDomain: z.string().optional().or(z.literal('')),
  status: z.enum([BrandStatus.ACTIVE, BrandStatus.INACTIVE, BrandStatus.SUSPENDED]).optional(),
  timezone: z.string().optional()
});

const updateBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name must be less than 255 characters'),
  email: z.email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  website: z.url('Invalid website URL').or(z.literal('')),
  status: z.enum([BrandStatus.ACTIVE, BrandStatus.INACTIVE, BrandStatus.SUSPENDED]),
  logo: z.union([
    z.file()
      .max(BRAND_LOGO_MAX_SIZE, 'File size too large. Maximum size is 5MB.')
      .mime(BRAND_LOGO_ALLOWED_TYPES, 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.'),
    z.string().min(1, 'Logo is required')
  ]),
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
      return createValidationErrorResponse({
        email: ['A brand with this email already exists']
      });
    }

    // Hash password
    const passwordHash = await cryptoService.hash(validated.password);

    const brandCode = generateCode();

    const brandImageUrl = await publishFile({
      file: validated.logo,
      directory: BRAND_LOGO_UPLOAD_PATH.replace('{brandCode}', brandCode),
      name: brandCode
    });
    
    const brand = await BrandModel.createBrand({
      name: validated.name,
      email: validated.email,
      code: brandCode,
      logo: brandImageUrl,
      passwordHash,
      website: validated.website || undefined,
      trackingDomain: validated.trackingDomain || undefined,
      status: validated.status || BrandStatus.ACTIVE,
      timezone: validated.timezone || 'UTC'
    });

    revalidatePath('/admin/brands');
    redirect(`/admin/brands/${brand.id}`);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
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
      return createErrorResponse('Brand not found');
    }
    
    // Check if email is being changed and if it already exists
    if (validated.email) {
      const exists = await BrandModel.brandExistsByEmail(validated.email);
      if (exists && exists.id !== id) {
        return createValidationErrorResponse({
          email: ['A brand with this email already exists']
        });
      }
    }

    let logoPath: string;
    if (validated.logo instanceof File) {
      logoPath = await publishFile({
        file: validated.logo,
        directory: BRAND_LOGO_UPLOAD_PATH.replace('{brandCode}', brand.code!),
        name: brand.code!
      });

      // TODO: Delete Old Logo File if needed
    }
    else {
      logoPath = validated.logo;
    }

    // Update brand with all data (including new logo URL if uploaded)
    const updatedBrand = await BrandModel.updateBrand(id, {
      ...validated,
      logo: logoPath
    });

    if (!updatedBrand) {
      return createErrorResponse('Brand update failed');
    }

    revalidatePath('/admin/brands');
    revalidatePath(`/admin/brands/${id}`);
    return createSuccessResponse('Brand updated successfully', updatedBrand);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
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
    return createSuccessResponse('Brands retrieved successfully', result);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    throw error;
  }
}