'use server';

import { CampaignModel } from '@/models/brand/campaign.model';
import { CampaignStatus, CAMPAIGN_IMAGE_MAX_SIZE, CAMPAIGN_IMAGE_ALLOWED_TYPES, CAMPAIGN_IMAGE_UPLOAD_PATH } from '@/constants/campaign';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/auth/brand';
import { generateCode } from '@/lib/generateCode';
import { publishFile } from '@/lib/fileStorage';
import { createErrorResponse, createSuccessResponse, createZodValidationErrorResponse } from '@/lib/response';

const createCampaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required').max(255, 'Campaign title must be less than 255 characters'),
  link: z.url('Invalid URL format').max(500, 'Link must be less than 500 characters'),
  description: z.string().optional(),
  terms: z.string().optional(),
  image: z.file()
    .max(CAMPAIGN_IMAGE_MAX_SIZE, 'File size too large. Maximum size is 5MB.')
    .mime(CAMPAIGN_IMAGE_ALLOWED_TYPES, 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.'),
  status: z.enum([CampaignStatus.DRAFT, CampaignStatus.ACTIVE, CampaignStatus.PAUSED, CampaignStatus.SUSPENDED, CampaignStatus.TRASHED]).optional(),
  isPrivate: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  cookieDuration: z.number().min(1, 'Cookie duration must be at least 1 day').max(365, 'Cookie duration cannot exceed 365 days').optional(),
  utmSource: z.string().min(1, 'UTM source is required').max(255, 'UTM source must be less than 255 characters'),
  utmCampaign: z.string().min(1, 'UTM campaign is required').max(255, 'UTM campaign must be less than 255 characters'),
});

const updateCampaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required').max(255, 'Campaign title must be less than 255 characters'),
  link: z.url('Invalid URL format').max(500, 'Link must be less than 500 characters'),
  description: z.string().optional(),
  terms: z.string().optional(),
  image: z.union([
    z.string().min(1, 'Image is required'),
    z.file()
      .max(CAMPAIGN_IMAGE_MAX_SIZE, 'File size too large. Maximum size is 5MB.')
      .mime(CAMPAIGN_IMAGE_ALLOWED_TYPES, 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.')
  ]),
  status: z.enum([CampaignStatus.DRAFT, CampaignStatus.ACTIVE, CampaignStatus.PAUSED, CampaignStatus.SUSPENDED, CampaignStatus.TRASHED]).optional(),
  isPrivate: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  cookieDuration: z.number().min(1, 'Cookie duration must be at least 1 day').max(365, 'Cookie duration cannot exceed 365 days').optional(),
  utmSource: z.string().min(1, 'UTM source is required').max(255, 'UTM source must be less than 255 characters'),
  utmCampaign: z.string().min(1, 'UTM campaign is required').max(255, 'UTM campaign must be less than 255 characters'),
});

export async function createCampaign(data: unknown) {
  let campaign;

  try {
    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }
    const brand = token.user;

    // Validate the data
    const validatedData = createCampaignSchema.parse(data);

    const campaignCode = generateCode();
    const campaignImageUrl = await publishFile({
      file: validatedData.image,
      directory: CAMPAIGN_IMAGE_UPLOAD_PATH.replace('{campaignCode}', campaignCode),
      name: campaignCode
    });

    // Create campaign with placeholder values
    const campaignData = {
      brandId: brand.id,
      code: campaignCode,
      title: validatedData.title,
      link: validatedData.link,
      description: validatedData.description || null,
      terms: validatedData.terms || null,
      image: campaignImageUrl,
      status: validatedData.status || CampaignStatus.DRAFT,
      isPrivate: validatedData.isPrivate || false,
      tags: validatedData.tags,
      cookieDuration: validatedData.cookieDuration || 30,
      utmSource: validatedData.utmSource,
      utmCampaign: validatedData.utmCampaign,
    };

    // Create the campaign first
    campaign = await CampaignModel.createCampaign(campaignData);

  } catch (error) {
    console.log("🚀 ~ createCampaign ~ error:", error)
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to create campaign');
  }

  console.log(campaign)

  revalidatePath('/brand/campaigns');
  redirect(`/brand/campaigns/${campaign.id}`);
}

export async function updateCampaign(campaignId: number, data: unknown) {
  let updatedCampaign;

  try {
    // Get authenticated brand
    const token = await getCurrentUser();
    if (!token) {
      return createErrorResponse('Authentication required');
    }
    const brand = token.user;

    // Verify campaign belongs to this brand
    const existingCampaign = await CampaignModel.getCampaignByIdAndBrand(campaignId, brand.id);
    if (!existingCampaign) {
      return createErrorResponse('Campaign not found');
    }

    const validatedData = updateCampaignSchema.parse(data);

    let campaignImageUrl: string;
    if (validatedData.image instanceof File) {
      campaignImageUrl = await publishFile({
        file: validatedData.image,
        directory: CAMPAIGN_IMAGE_UPLOAD_PATH.replace('{campaignCode}', existingCampaign.code!),
        name: existingCampaign.code!
      });
    } else {
      campaignImageUrl = validatedData.image;
    }

    // Update campaign data
    const campaignData = {
      title: validatedData.title,
      link: validatedData.link,
      description: validatedData.description || null,
      terms: validatedData.terms || null,
      image: campaignImageUrl,
      status: validatedData.status,
      isPrivate: validatedData.isPrivate,
      tags: validatedData.tags,
      cookieDuration: validatedData.cookieDuration,
      utmSource: validatedData.utmSource,
      utmCampaign: validatedData.utmCampaign,
    };

    updatedCampaign = await CampaignModel.updateCampaign(campaignId, campaignData);

    if (!updatedCampaign) {
      return createErrorResponse('Failed to update campaign');
    }
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return createZodValidationErrorResponse(error);
    }
    
    return createErrorResponse('Failed to update campaign');
  }

  revalidatePath('/brand/campaigns');
  revalidatePath(`/brand/campaigns/${campaignId}`);

  return createSuccessResponse('Campaign updated successfully', updatedCampaign);
}

