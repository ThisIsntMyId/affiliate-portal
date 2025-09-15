import { FormFieldConfig } from "@/components/DynamicForm";
import { CAMPAIGN_IMAGE_MAX_SIZE, CampaignStatus, CampaignStatusLabels } from "@/constants/campaign";

export const createCampaignFormConfig: FormFieldConfig[] = [
    {
        name: 'title',
        label: 'Campaign Title',
        type: 'input',
        required: true,
        placeholder: 'Enter campaign title',
        description: 'A clear and descriptive title for your campaign'
    },
    {
        name: 'link',
        label: 'Campaign Link',
        type: 'input',
        required: true,
        placeholder: 'https://example.com/campaign',
        description: 'The destination URL for this campaign'
    },
    {
        name: 'description',
        label: 'Description',
        type: 'richtext',
        required: false,
        placeholder: 'Enter campaign description...',
        description: 'Detailed description of the campaign (supports rich text formatting)',
        colSpan: 2
    },
    {
        name: 'terms',
        label: 'Terms & Conditions',
        type: 'richtext',
        required: false,
        placeholder: 'Enter terms and conditions...',
        description: 'Terms and conditions for this campaign (supports rich text formatting)',
        colSpan: 2
    },
    {
        name: "image",
        label: "Campaign Image",
        type: "file",
        required: false,
        description: 'Upload an image for this campaign',
        colSpan: 2,
        fileConfig: {
            hint: 'Upload up to 1 image (PNG, JPEG, WebP, SVG) up to 5MB',
            image: true,
            maxFiles: 1,
            multiple: false,
            maxSize: CAMPAIGN_IMAGE_MAX_SIZE,
            accept: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
            boxSizeHeight: 200,
            boxSizeWidth: 300
        }
    },
    {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
            { label: CampaignStatusLabels[CampaignStatus.DRAFT], value: CampaignStatus.DRAFT },
            { label: CampaignStatusLabels[CampaignStatus.ACTIVE], value: CampaignStatus.ACTIVE },
            { label: CampaignStatusLabels[CampaignStatus.PAUSED], value: CampaignStatus.PAUSED },
            { label: CampaignStatusLabels[CampaignStatus.SUSPENDED], value: CampaignStatus.SUSPENDED },
            { label: CampaignStatusLabels[CampaignStatus.TRASHED], value: CampaignStatus.TRASHED }
        ],
        description: 'Current status of this campaign'
    },
    {
        name: 'isPrivate',
        label: 'Private Campaign',
        type: 'checkbox',
        required: false,
        description: 'Make this campaign private (only visible to you)'
    },
    {
        name: 'tags',
        label: 'Tags',
        type: 'tags',
        required: false,
        placeholder: 'Type and press Enter to add tags...',
        description: 'Add tags to categorize this campaign',
        colSpan: 2
    },
    {
        name: 'cookieDuration',
        label: 'Cookie Duration (Days)',
        type: 'number',
        required: true,
        placeholder: '30',
        description: 'How long to track conversions after click (1-365 days)'
    },
    {
        name: 'utmSource',
        label: 'UTM Source',
        type: 'input',
        required: true,
        placeholder: 'brand-name-affiliate',
        description: 'UTM source parameter for tracking (e.g., brand-name-affiliate)',
        colSpan: 2
    },
    {
        name: 'utmCampaign',
        label: 'UTM Campaign',
        type: 'input',
        required: true,
        placeholder: 'affiliate-campaign',
        description: 'UTM campaign parameter for tracking (e.g., affiliate-campaign)',
        colSpan: 2
    }
];

export const editCampaignFormConfig: FormFieldConfig[] = [
    {
        name: 'title',
        label: 'Campaign Title',
        type: 'input',
        required: true,
        placeholder: 'Enter campaign title',
        description: 'A clear and descriptive title for your campaign'
    },
    {
        name: 'link',
        label: 'Campaign Link',
        type: 'input',
        required: true,
        placeholder: 'https://example.com/campaign',
        description: 'The destination URL for this campaign'
    },
    {
        name: 'description',
        label: 'Description',
        type: 'richtext',
        required: false,
        placeholder: 'Enter campaign description...',
        description: 'Detailed description of the campaign (supports rich text formatting)',
        colSpan: 2
    },
    {
        name: 'terms',
        label: 'Terms & Conditions',
        type: 'richtext',
        required: false,
        placeholder: 'Enter terms and conditions...',
        description: 'Terms and conditions for this campaign (supports rich text formatting)',
        colSpan: 2
    },
    {
        name: "image",
        label: "Campaign Image",
        type: "file",
        required: false,
        description: 'Upload an image for this campaign',
        colSpan: 2,
        fileConfig: {
            hint: 'Upload up to 1 image (PNG, JPEG, WebP, SVG) up to 5MB',
            image: true,
            maxFiles: 1,
            multiple: false,
            maxSize: CAMPAIGN_IMAGE_MAX_SIZE,
            accept: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
            boxSizeHeight: 200,
            boxSizeWidth: 300
        }
    },
    {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
            { label: CampaignStatusLabels[CampaignStatus.DRAFT], value: CampaignStatus.DRAFT },
            { label: CampaignStatusLabels[CampaignStatus.ACTIVE], value: CampaignStatus.ACTIVE },
            { label: CampaignStatusLabels[CampaignStatus.PAUSED], value: CampaignStatus.PAUSED },
            { label: CampaignStatusLabels[CampaignStatus.SUSPENDED], value: CampaignStatus.SUSPENDED },
            { label: CampaignStatusLabels[CampaignStatus.TRASHED], value: CampaignStatus.TRASHED }
        ],
        description: 'Current status of this campaign'
    },
    {
        name: 'isPrivate',
        label: 'Private Campaign',
        type: 'checkbox',
        required: false,
        description: 'Make this campaign private (only visible to you)'
    },
    {
        name: 'tags',
        label: 'Tags',
        type: 'tags',
        required: false,
        placeholder: 'Type and press Enter to add tags...',
        description: 'Add tags to categorize this campaign',
        colSpan: 2
    },
    {
        name: 'cookieDuration',
        label: 'Cookie Duration (Days)',
        type: 'number',
        required: true,
        placeholder: '30',
        description: 'How long to track conversions after click (1-365 days)'
    },
    {
        name: 'utmSource',
        label: 'UTM Source',
        type: 'input',
        required: true,
        placeholder: 'brand-name-affiliate',
        description: 'UTM source parameter for tracking (e.g., brand-name-affiliate)',
        colSpan: 2
    },
    {
        name: 'utmCampaign',
        label: 'UTM Campaign',
        type: 'input',
        required: true,
        placeholder: 'affiliate-campaign',
        description: 'UTM campaign parameter for tracking (e.g., affiliate-campaign)',
        colSpan: 2
    }
];
