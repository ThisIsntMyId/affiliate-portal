'use client';

import { DynamicForm, FormFieldConfig, DynamicFormSubmissionError } from '@/components/DynamicForm';
import { updateBrand } from '@/actions/admin/brand.action';
import { BrandStatus, BrandStatusLabels } from '@/constants/brand';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BrandModel } from '@/models/admin/brand.model';


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
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'brand@example.com',
    description: 'Primary email address for this brand'
  },
  {
    name: 'website',
    label: 'Website',
    type: 'input',
    placeholder: 'https://example.com',
    description: 'Brand website URL (optional)'
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
    description: 'Current status of this brand'
  },
  {
    name: 'timezone',
    label: 'Timezone',
    type: 'input',
    placeholder: 'UTC',
    description: 'Timezone string (e.g., UTC, America/New_York, Europe/London)'
  }
];

type BrandDetails = Awaited<ReturnType<typeof BrandModel.getBrandById>>;

export function BrandForm({ brand }: {brand: BrandDetails}) {
  const router = useRouter();

  const handleSubmit = async (values: Record<string, unknown>) => {
    const result = await updateBrand(brand.id, values);
    console.log("🚀 ~ handleSubmit ~ result:", result)
    
    if (result.success) {
      toast.success('Brand updated successfully');
      router.push('/admin/brands');
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
        throw new DynamicFormSubmissionError('Validation failed', fieldErrors)
      } else {
        throw new DynamicFormSubmissionError('Failed to update brand');
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
            name: brand.name,
            email: brand.email,
            website: brand.website || '',
            status: brand.status,
            timezone: brand.timezone
          }}
          submitText="Update Brand"
          loadingText="Updating..."
          submitButtonAlign="right"
        />
      </CardContent>
    </Card>
  );
}
