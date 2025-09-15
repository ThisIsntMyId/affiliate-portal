'use client';

import { DynamicForm, DynamicFormSubmissionError } from '@/components/DynamicForm';
import { updateCampaign } from '@/actions/brand/campaign.action';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { editCampaignFormConfig } from '../campaignFormConfig';

type CampaignDetails = Awaited<ReturnType<typeof import('@/models/brand/campaign.model').CampaignModel.getCampaignById>>;

export function EditCampaignForm({ campaign }: {campaign: CampaignDetails}) {
  const handleSubmit = async (values: Record<string, unknown>) => {
    const result = await updateCampaign(campaign!.id, values);
    
    if (result.success) {
      toast.success('Campaign updated successfully');
      // The updateCampaign action will redirect to the campaign detail page
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
        throw new DynamicFormSubmissionError('Failed to update campaign');
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardContent>
        <DynamicForm
          config={editCampaignFormConfig}
          onSubmit={handleSubmit}
          defaultValues={{
            title: campaign?.title || '',
            link: campaign?.link || '',
            description: campaign?.description || '',
            terms: campaign?.terms || '',
            status: campaign?.status || '',
            isPrivate: campaign?.isPrivate || false,
            tags: campaign?.tags || [],
            cookieDuration: campaign?.cookieDuration || 30,
            utmSource: campaign?.utmSource || '',
            utmCampaign: campaign?.utmCampaign || '',
            image: campaign?.image || ''
          }}
          submitText="Update Campaign"
          loadingText="Updating..."
          submitButtonAlign="right"
          gridCols={2}
        />
      </CardContent>
    </Card>
  );
}
