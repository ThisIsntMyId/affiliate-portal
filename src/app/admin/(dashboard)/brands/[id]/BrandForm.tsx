'use client';

import { DynamicForm, DynamicFormSubmissionError } from '@/components/DynamicForm';
import { updateBrand } from '@/actions/admin/brand.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BrandModel } from '@/models/admin/brand.model';
import { formConfig } from '../brandFormConfig';

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
            timezone: brand.timezone,
            logo: brand.logo
          }}
          submitText="Update Brand"
          loadingText="Updating..."
          submitButtonAlign="right"
        />
      </CardContent>
    </Card>
  );
}
