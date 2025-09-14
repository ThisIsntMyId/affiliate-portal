'use client';

import { DynamicForm, FormFieldConfig, DynamicFormSubmissionError } from '@/components/DynamicForm';
import { createBrand } from '@/actions/admin/brand.action';
import { BrandStatus, BrandStatusLabels } from '@/constants/brand';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const formConfig: FormFieldConfig[] = [
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
      image: false,
      maxFiles: 1,
      multiple: false,
      maxSize: 100 * 1024, // 100kb
      accept: 'image/*'
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

export function CreateBrandForm() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log("🚀 ~ handleSubmit ~ values:", values)
    const result = await createBrand(values);
    
    if (result.success) {
      toast.success('Brand created successfully');
      // The createBrand action will redirect to the brand detail page
      // No need to manually redirect here
    } else {
      // Handle validation errors using DynamicFormSubmissionError
      if (result.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            fieldErrors[field] = messages.join(', ');
          } else {
            fieldErrors[field] = messages as string;
          }
        });
        throw new DynamicFormSubmissionError('Validation failed', fieldErrors);
      } else {
        throw new DynamicFormSubmissionError('Failed to create brand');
      }
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <DynamicForm
          config={formConfig}
          onSubmit={handleSubmit}
          defaultValues={{
            status: BrandStatus.ACTIVE,
            timezone: 'UTC'
          }}
          submitText="Create Brand"
          loadingText="Creating..."
          submitButtonAlign="right"
        />
      </CardContent>
    </Card>
  );
}
