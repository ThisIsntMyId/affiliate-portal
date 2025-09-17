import { CampaignModel } from '@/models/brand/campaign.model';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/auth/brand';
import { EditCampaignForm } from './EditCampaignForm';
import { CampaignDetailsTab } from '../_components/CampaignDetailsTab';

export default async function EditCampaignPage({ params }: {params: Promise<{id: string}>}) {
  const {id} = await params;
  
  const campaignId = parseInt(id);
  
  if (isNaN(campaignId)) {
    notFound();
  }

  // Get authenticated brand
  const token = await getCurrentUser();
  if (!token) {
    notFound();
  }

  const brand = token.user;

  const campaign = await CampaignModel.getCampaignByIdAndBrand(campaignId, brand.id);
  
  if (!campaign) {
    notFound();
  }

  return (
    <div className="space-y-6">      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
        <p className="text-gray-600 mt-1">Update campaign information and settings</p>
      </div>

      <CampaignDetailsTab campaignId={id} />

      <EditCampaignForm campaign={campaign} />
    </div>
  );
}
