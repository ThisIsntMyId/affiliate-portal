'use server';

import { BrandModel } from '@/models/admin/brand.model';
import { BrandStatus, BRAND_LOGO_MAX_SIZE, BRAND_LOGO_ALLOWED_TYPES, BRAND_LOGO_UPLOAD_PATH } from '@/constants/brand';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cryptoService } from '@/services/crypto.service';
import { revalidatePath } from 'next/cache';
import { base62CodeService } from '@/services/base62-code.service';
import { storageService } from '@/services/storage.service';

// Validation schemas defined locally in this action file
// This keeps validation logic close to where it's used and avoids spreading schemas across the app

const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name must be less than 255 characters'),
  email: z.email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  logo: z.file()
    .max(BRAND_LOGO_MAX_SIZE, 'File size too large. Maximum size is 5MB.')
    .mime(BRAND_LOGO_ALLOWED_TYPES, 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.')
    .optional(),
  website: z.url('Invalid website URL').optional().or(z.literal('')),
  trackingDomain: z.string().optional().or(z.literal('')),
  status: z.enum([BrandStatus.ACTIVE, BrandStatus.INACTIVE, BrandStatus.SUSPENDED]).optional(),
  timezone: z.string().optional()
});

const updateBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name must be less than 255 characters').optional(),
  email: z.email('Invalid email address').max(255, 'Email must be less than 255 characters').optional(),
  website: z.url('Invalid website URL').optional().or(z.literal('')),
  status: z.enum([BrandStatus.ACTIVE, BrandStatus.INACTIVE, BrandStatus.SUSPENDED]).optional(),
  logo: z.union([
    z.file()
      .max(BRAND_LOGO_MAX_SIZE, 'File size too large. Maximum size is 5MB.')
      .mime(BRAND_LOGO_ALLOWED_TYPES, 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.')
      .optional(),
    z.string().min(1, 'Logo is required').optional()
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

// Helper functions for file handling
function getFileExtension(file: File): string {
  return file.name.split('.').pop()?.toLowerCase() || 'png';
}

function generateBrandLogoDirectory(brandId: number): string {
  return BRAND_LOGO_UPLOAD_PATH.replace('{brandId}', brandId.toString());
}

function generateBrandLogoFilename(brandCode: string, extension: string): string {
  return `${brandCode}.${extension}`;
}

async function ensureDirectoryExists(directoryPath: string): Promise<void> {
  if (await storageService.directoryExists(directoryPath)) return;
  else {
    await storageService.createDirectory(directoryPath);
    return;
  }
}

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
    
    // Create brand first (without logo)
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
    await BrandModel.updateBrand(brand.id, { code });

    let logoUrl: string | undefined = undefined;
    let uploadedFilePath: string | undefined = undefined;

    // Handle logo upload if present
    if (validated.logo) {
      try {
        // Get extension from File object
        const fileExtension = getFileExtension(validated.logo);
        const filename = generateBrandLogoFilename(code, fileExtension);
        const directoryPath = generateBrandLogoDirectory(brand.id);
        const fullFilePath = `${directoryPath}/${filename}`;
        
        // Ensure directory exists
        await ensureDirectoryExists(directoryPath);
        
        // Convert File to Buffer for upload
        const fileBuffer = await validated.logo.arrayBuffer();
        
        // Upload to storage
        await storageService.write(fullFilePath, Buffer.from(fileBuffer), {
          contentType: validated.logo.type
        });
        
        // Get public URL
        logoUrl = await storageService.publicUrl(fullFilePath);
        uploadedFilePath = fullFilePath;
        
        // Update brand with logo URL
        await BrandModel.updateBrand(brand.id, { logo: logoUrl });
        
      } catch (uploadError) {
        console.error('Logo upload failed:', uploadError);
        // Cleanup uploaded file if brand update fails
        if (uploadedFilePath) {
          try {
            // Note: FileStorage might not have delete method, 
            // cleanup would need to be handled by storage service implementation
            console.warn('File uploaded but brand update failed. Manual cleanup may be required:', uploadedFilePath);
          } catch (cleanupError) {
            console.error('Failed to cleanup uploaded file:', cleanupError);
          }
        }
        
        return {
          success: false,
          error: 'Failed to upload brand logo. Please try again.'
        };
      }
    }

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

    // Prepare update data without logo (logo will be handled separately)
    const { logo, ...updateData } = validated;

    let logoUrl: string | undefined = undefined;
    let uploadedFilePath: string | undefined = undefined;
    let oldLogoPath: string | undefined = undefined;

    // Handle logo upload if present
    if (logo && logo instanceof File) {
      try {
        // Store old logo path for cleanup if it exists
        if (brand.logo) {
          // Extract the file path from the logo URL for cleanup
          // Assuming logo URL format: http://domain/path/to/file
          const url = new URL(brand.logo);
          oldLogoPath = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
        }

        // Get extension from File object
        const fileExtension = getFileExtension(logo);
        const filename = generateBrandLogoFilename(brand.code!, fileExtension);
        const directoryPath = generateBrandLogoDirectory(brand.id);
        const fullFilePath = `${directoryPath}/${filename}`;
        
        // Ensure directory exists
        await ensureDirectoryExists(directoryPath);
        
        // Convert File to Buffer for upload
        const fileBuffer = await logo.arrayBuffer();
        
        // Upload to storage
        await storageService.write(fullFilePath, Buffer.from(fileBuffer), {
          contentType: logo.type
        });
        
        // Get public URL
        logoUrl = await storageService.publicUrl(fullFilePath);
        uploadedFilePath = fullFilePath;
        
        // Add logo URL to update data
        (updateData as Record<string, unknown>).logo = logoUrl;
        
      } catch (uploadError) {
        console.error('Logo upload failed:', uploadError);
        // Cleanup uploaded file if brand update fails
        if (uploadedFilePath) {
          try {
            // Note: FileStorage might not have delete method, 
            // cleanup would need to be handled by storage service implementation
            console.warn('File uploaded but brand update failed. Manual cleanup may be required:', uploadedFilePath);
          } catch (cleanupError) {
            console.error('Failed to cleanup uploaded file:', cleanupError);
          }
        }
        
        return {
          success: false,
          error: 'Failed to upload brand logo. Please try again.'
        };
      }
    }

    // Update brand with all data (including new logo URL if uploaded)
    const updatedBrand = await BrandModel.updateBrand(id, updateData);

    if (!updatedBrand) {
      return {
        success: false,
        error: 'Brand update failed'
      };
    }

    // Cleanup old logo file if new logo was uploaded successfully
    if (logo && oldLogoPath && logoUrl) {
      try {
        // Note: FileStorage interface may not have delete method
        // This is a placeholder for future implementation
        // For now, we log the cleanup requirement
        console.log('Old logo file should be cleaned up:', oldLogoPath);
        
        // TODO: Implement file deletion when storage service supports it
        // await storageService.delete(oldLogoPath);
        
      } catch (cleanupError) {
        console.error('Failed to cleanup old logo file:', cleanupError);
        // Don't fail the update if cleanup fails
      }
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