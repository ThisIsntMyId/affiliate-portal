'use client';

import { DynamicForm, DynamicFormSubmissionError } from '@/components/DynamicForm';
import { createBrand } from '@/actions/admin/brand.action';
import { BrandStatus } from '@/constants/brand';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { createBrandFormConfig } from '../brandFormConfig';

export function CreateBrandForm() {
  const handleSubmit = async (values: Record<string, unknown>) => {
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
    <Card className="w-3xl">
      <CardContent>
        <DynamicForm
          config={createBrandFormConfig}
          onSubmit={handleSubmit}
          defaultValues={{
            status: BrandStatus.ACTIVE,
            timezone: 'UTC'
          }}
          submitText="Create Brand"
          loadingText="Creating..."
          submitButtonAlign="right"
          gridCols={2}
        />
      </CardContent>
    </Card>
  );
}
