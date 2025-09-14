'use client';

import { DynamicForm, FormFieldConfig } from '@/components/DynamicForm';
import { updateBrand } from '@/actions/admin/brand.action';
import { BrandStatus, BrandStatusLabels } from '@/constants/brand';
import { BrandDetails } from '@/models/admin/brand.model';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BrandFormProps {
  brand: BrandDetails;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();

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

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const result = await updateBrand(brand.id, values);
      
      if (result.success) {
        toast.success('Brand updated successfully');
        router.push('/admin/brands');
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                toast.error(`${field}: ${message}`);
              });
            }
          });
        } else {
          toast.error('Failed to update brand');
        }
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
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
      title="Brand Information"
      description="Update the brand details and settings"
      submitText="Update Brand"
      loadingText="Updating..."
      submitButtonAlign="right"
    />
  );
}
