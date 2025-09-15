// Brand Status Constants
export const BrandStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

// Brand Status Labels for UI Display
export const BrandStatusLabels = {
  [BrandStatus.ACTIVE]: 'Active',
  [BrandStatus.INACTIVE]: 'Inactive',
  [BrandStatus.SUSPENDED]: 'Suspended'
} as const;

// Brand Status Colors for UI Display
export const BrandStatusColors = {
  [BrandStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [BrandStatus.INACTIVE]: 'bg-yellow-100 text-yellow-800',
  [BrandStatus.SUSPENDED]: 'bg-red-100 text-red-800'
} as const;

// Type definitions for TypeScript support
export type BrandStatusType = typeof BrandStatus[keyof typeof BrandStatus];

// Brand Sort Options Labels for UI Display
export const BrandSortOptionsLabels: Record<string, string> = {
  'latest': 'Latest',
  'oldest': 'Oldest',
  'name-asc': 'Name (A-Z)',
  'name-desc': 'Name (Z-A)',
}

// Brand logo upload configuration
export const BRAND_LOGO_UPLOAD_PATH = '/brands/{brandId}/logo';
export const BRAND_LOGO_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const BRAND_LOGO_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/svg+xml'
];