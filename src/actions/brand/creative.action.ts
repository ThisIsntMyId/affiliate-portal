'use server';

import { CreativeModel } from '@/models/brand/creative.model';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/auth/brand';
import { generateCode } from '@/lib/generateCode';
import { createErrorResponse, createSuccessResponse, createZodValidationErrorResponse } from '@/lib/response';
import { publishFile } from '@/lib/fileStorage';
import { CREATIVE_FILE_UPLOAD_PATH, CREATIVE_FILE_MAX_SIZE, CREATIVE_FILE_ALLOWED_TYPES } from '@/constants/creative';
import { z } from 'zod';

const createCreativeSchema = z.object({
  campaignId: z.number().min(1, 'Campaign ID is required'),
  name: z.string().min(1, 'Creative name is required').max(255, 'Name must be less than 255 characters'),
  type: z.string().min(1, 'Creative type is required').max(50, 'Type must be less than 50 characters'),
  file: z.file()
    .max(CREATIVE_FILE_MAX_SIZE, 'File size too large. Maximum size is 10MB.')
    .mime(CREATIVE_FILE_ALLOWED_TYPES, 'Invalid file type. Only images, videos, PDFs, and HTML files are allowed.'),
  isActive: z.boolean().optional(),
});

const getCreativeSchema = z.object({
  id: z.number().min(1, 'Creative ID is required'),
  campaignId: z.number().min(1, 'Campaign ID is required'),
});

const updateCreativeSchema = z.object({
  id: z.number().min(1, 'Creative ID is required'),
  campaignId: z.number().min(1, 'Campaign ID is required'),
  name: z.string().min(1, 'Creative name is required').max(255, 'Name must be less than 255 characters'),
  type: z.string().min(1, 'Creative type is required').max(50, 'Type must be less than 50 characters'),
  file: z.union([
    z.string().min(1, 'File is required'),
    z.file()
      .max(CREATIVE_FILE_MAX_SIZE, 'File size too large. Maximum size is 10MB.')
      .mime(CREATIVE_FILE_ALLOWED_TYPES, 'Invalid file type. Only images, videos, PDFs, and HTML files are allowed.')
  ]),
  isActive: z.boolean().optional(),
});

export async function createCreative(data: unknown) {
  let creative;

  try {
    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }

    // Validate the data
    const validatedData = createCreativeSchema.parse(data);

    const creativeCode = generateCode();

    // Upload the file
    const creativeFileUrl = await publishFile({
      file: validatedData.file,
      directory: CREATIVE_FILE_UPLOAD_PATH.replace('{campaignCode}', creativeCode),
      name: creativeCode
    });

    // Create creative data
    const creativeData = {
      campaignId: validatedData.campaignId,
      code: creativeCode,
      name: validatedData.name,
      type: validatedData.type,
      path: creativeFileUrl,
      isActive: validatedData.isActive ?? true,
    };

    // Create the creative
    creative = await CreativeModel.createCreative(creativeData);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to create creative');
  }

  revalidatePath(`/brand/campaigns/${creative.campaignId}/creatives`);
  return createSuccessResponse('Creative created successfully', creative);
}

// Note: Used in modal form to get the data
export async function getCreative(data: unknown) {
  let creative;

  try {
    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }

    // Validate the data
    const validatedData = getCreativeSchema.parse(data);

    creative = await CreativeModel.getCreativeById(validatedData.id);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to get creative');
  }

  revalidatePath(`/brand/campaigns/${creative?.campaignId}/creatives`);
  return createSuccessResponse('Creative retrieved successfully', creative);
}

export async function updateCreative(data: unknown) {
  let updatedCreative;

  try {
    const validatedData = updateCreativeSchema.parse(data);

    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }

    // Get existing creative to access the campaign code
    const existingCreative = await CreativeModel.getCreativeById(validatedData.id);
    if (!existingCreative) {
      return createErrorResponse('Creative not found');
    }

    let creativeFileUrl: string;
    if (validatedData.file instanceof File) {
      // Upload new file
      creativeFileUrl = await publishFile({
        file: validatedData.file,
        directory: CREATIVE_FILE_UPLOAD_PATH.replace('{campaignCode}', existingCreative.code!),
        name: existingCreative.code!
      });
    } else {
      // Use existing file path
      creativeFileUrl = validatedData.file;
    }

    updatedCreative = await CreativeModel.updateCreative(validatedData.id, {
      name: validatedData.name,
      type: validatedData.type,
      path: creativeFileUrl,
      isActive: validatedData.isActive ?? true,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to update creative');
  }

  revalidatePath(`/brand/campaigns/${updatedCreative?.campaignId}/creatives`);
  return createSuccessResponse('Creative updated successfully', updatedCreative);
}
