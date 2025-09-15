// Campaign Status Constants
export const CampaignStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  SUSPENDED: 'suspended',
  TRASHED: 'trashed'
} as const;

// Campaign Status Labels for UI Display
export const CampaignStatusLabels = {
  [CampaignStatus.DRAFT]: 'Draft',
  [CampaignStatus.ACTIVE]: 'Active',
  [CampaignStatus.PAUSED]: 'Paused',
  [CampaignStatus.SUSPENDED]: 'Suspended',
  [CampaignStatus.TRASHED]: 'Trashed'
} as const;

// Campaign Status Colors for UI Display
export const CampaignStatusColors = {
  [CampaignStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [CampaignStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [CampaignStatus.PAUSED]: 'bg-yellow-100 text-yellow-800',
  [CampaignStatus.SUSPENDED]: 'bg-orange-100 text-orange-800',
  [CampaignStatus.TRASHED]: 'bg-red-100 text-red-800'
} as const;

// Type definitions for TypeScript support
export type CampaignStatusType = typeof CampaignStatus[keyof typeof CampaignStatus];

// Campaign Sort Options Labels for UI Display
export const CampaignSortOptionsLabels: Record<string, string> = {
  'latest': 'Latest',
  'oldest': 'Oldest',
  'title-asc': 'Title (A-Z)',
  'title-desc': 'Title (Z-A)',
}

// Campaign image upload configuration
export const CAMPAIGN_IMAGE_UPLOAD_PATH = '/campaigns/{campaignCode}/images';
export const CAMPAIGN_IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const CAMPAIGN_IMAGE_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/svg+xml'
];
