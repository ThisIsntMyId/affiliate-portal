'use client';

import { DynamicForm, DynamicFormSubmissionError } from '@/components/DynamicForm';
import { createCampaign } from '@/actions/brand/campaign.action';
import { CampaignStatus } from '@/constants/campaign';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { createCampaignFormConfig } from '../campaignFormConfig';

export function CreateCampaignForm() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    const result = await createCampaign(values);
    console.log("🚀 ~ handleSubmit ~ result:", result)
    
    if (result.success) {
      toast.success('Campaign created successfully');
      // The createCampaign action will redirect to the campaign detail page
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
        throw new DynamicFormSubmissionError('Failed to create campaign');
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardContent>
        <DynamicForm
          config={createCampaignFormConfig}
          onSubmit={handleSubmit}
          defaultValues={{
            status: CampaignStatus.DRAFT,
            cookieDuration: 30,
            isPrivate: false,
            tags: []
          }}
          submitText="Create Campaign"
          loadingText="Creating..."
          submitButtonAlign="right"
          gridCols={2}
        />
      </CardContent>
    </Card>
  );
}
