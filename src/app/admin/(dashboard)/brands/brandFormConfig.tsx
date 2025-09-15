import { FormFieldConfig } from "@/components/DynamicForm";
import { BRAND_LOGO_MAX_SIZE, BrandStatus, BrandStatusLabels } from "@/constants/brand";

export const formConfig: FormFieldConfig[] = [
    {
        name: 'name',
        label: 'Brand Name',
        type: 'input',
        required: true,
        placeholder: 'Enter brand name',
        description: 'The display name for this brand'
    },
    {
        name: "logo",
        label: "Brand Logo",
        type: "file",
        required: true,
        description: 'Upload the brand logo here',
        fileConfig: {
            hint: 'Upload up to 3 images (PNG, JPEG, GIF, WebP) up to 5MB each',
            image: false,
            maxFiles: 3,
            multiple: true,
            maxSize: BRAND_LOGO_MAX_SIZE,
            accept: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        }
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'brand@example.com',
        description: 'Primary email address for this brand'
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter password',
        description: 'Password for brand login (minimum 8 characters)'
    },
    {
        name: 'website',
        label: 'Website',
        type: 'input',
        placeholder: 'https://example.com',
        description: 'Brand website URL (optional)'
    },
    {
        name: 'trackingDomain',
        label: 'Tracking Domain',
        type: 'input',
        placeholder: 'https://track.example.com',
        description: 'Tracking domain URL for affiliate links (optional)'
    },
    {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
            { label: BrandStatusLabels[BrandStatus.ACTIVE], value: BrandStatus.ACTIVE },
            { label: BrandStatusLabels[BrandStatus.INACTIVE], value: BrandStatus.INACTIVE },
            { label: BrandStatusLabels[BrandStatus.SUSPENDED], value: BrandStatus.SUSPENDED }
        ],
        description: 'Initial status of this brand'
    },
    {
        name: 'timezone',
        label: 'Timezone',
        type: 'input',
        placeholder: 'UTC',
        description: 'Timezone string (e.g., UTC, America/New_York, Europe/London)'
    }
];