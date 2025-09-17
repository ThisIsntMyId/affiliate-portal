'use server';

import { CommissionRateModel } from '@/models/brand/commission.model';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/auth/brand';
import { generateCode } from '@/lib/generateCode';
import { createErrorResponse, createSuccessResponse, createZodValidationErrorResponse } from '@/lib/response';
import { z } from 'zod';

const createCommissionRateSchema = z.object({
  campaignId: z.number().min(1, 'Campaign ID is required'),
  title: z.string().min(1, 'Commission rate title is required').max(255, 'Title must be less than 255 characters'),
  type: z.enum(['fixed', 'percent'], "Commission type is required"),
  value: z.number('Commission value is required').positive('Commission value must be a positive number').transform(val => val.toString()),
  isActive: z.boolean().optional(),
});

const getCommissionRateSchema = z.object({
  id: z.number().min(1, 'Commission rate ID is required'),
  campaignId: z.number().min(1, 'Campaign ID is required'),
});

const updateCommissionRateSchema = z.object({
  id: z.number().min(1, 'Commission rate ID is required'),
  campaignId: z.number().min(1, 'Campaign ID is required'),
  title: z.string().min(1, 'Commission rate title is required').max(255, 'Title must be less than 255 characters'),
  type: z.enum(['fixed', 'percent'], "Commission type is required"),
  value: z.number('Commission value is required').positive('Commission value must be a positive number').transform(val => val.toString()),
  isActive: z.boolean().optional(),
});

export async function createCommissionRate(data: unknown) {
  let commissionRate;

  try {
    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }

    // Validate the data
    const validatedData = createCommissionRateSchema.parse(data);

    const commissionCode = generateCode();

    // Create commission rate data
    const commissionData = {
      campaignId: validatedData.campaignId,
      code: commissionCode,
      title: validatedData.title,
      type: validatedData.type,
      value: validatedData.value,
      isActive: validatedData.isActive ?? true,
    };

    // Create the commission rate
    commissionRate = await CommissionRateModel.createCommissionRate(commissionData);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to create commission rate');
  }

  revalidatePath(`/brand/campaigns/${commissionRate.campaignId}/commission`);
  return createSuccessResponse('Commission rate created successfully', commissionRate);
}

// Note: Used in modal form to get the data
export async function getCommissionRate(data: unknown) {
  let commissionRate;

  try {
    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }

    // Validate the data
    const validatedData = getCommissionRateSchema.parse(data);

    commissionRate = await CommissionRateModel.getCommissionRateById(validatedData.id);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to get commission rate');
  }

  revalidatePath(`/brand/campaigns/${commissionRate?.campaignId}/commission`);
  return createSuccessResponse('Commission rate retrieved successfully', commissionRate);
}

export async function updateCommissionRate(data: unknown) {
  let updatedCommissionRate;
  console.log("🚀 ~ updateCommissionRate ~ data:", data)

  try {
    const validatedData = updateCommissionRateSchema.parse(data);

    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }

    updatedCommissionRate = await CommissionRateModel.updateCommissionRate(validatedData.id, {
      title: validatedData.title,
      type: validatedData.type,
      value: validatedData.value,
      isActive: validatedData.isActive ?? true,
    });

  } catch (error) {
    console.log("🚀 ~ updateCommissionRate ~ error:", error)
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to update commission rate');
  }

  revalidatePath(`/brand/campaigns/${updatedCommissionRate?.campaignId}/commission`);
  return createSuccessResponse('Commission rate updated successfully', updatedCommissionRate);
}