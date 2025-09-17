// Creative file upload configuration
export const CREATIVE_FILE_UPLOAD_PATH = '/campaigns/{campaignCode}/creatives';
export const CREATIVE_FILE_MAX_SIZE = 10 * 1024 * 1024; // 10MB (larger than campaign images since creatives can be videos)
export const CREATIVE_FILE_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'text/html',
  'text/plain'
];

// Creative type constants
export const CreativeType = {
  IMAGE: 'image',
  VIDEO: 'video',
  BANNER: 'banner',
  TEXT: 'text',
  HTML: 'html',
  PDF: 'pdf'
} as const;

// Creative type labels for UI display
export const CreativeTypeLabels = {
  [CreativeType.IMAGE]: 'Image',
  [CreativeType.VIDEO]: 'Video',
  [CreativeType.BANNER]: 'Banner',
  [CreativeType.TEXT]: 'Text',
  [CreativeType.HTML]: 'HTML',
  [CreativeType.PDF]: 'PDF'
} as const;

// Type definitions for TypeScript support
export type CreativeTypeType = typeof CreativeType[keyof typeof CreativeType];
