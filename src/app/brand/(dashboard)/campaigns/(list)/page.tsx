import { CampaignModel, CampaignSortOptions } from '@/models/brand/campaign.model';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CampaignTable from './CampaignTable';
import { getRoute } from '@/app/brand/routes';
import { getCurrentUser } from '@/auth/brand';

export default async function BrandCampaigns({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Get authenticated brand
  const token = await getCurrentUser();
  if (!token) {
    throw new Error('Authentication required');
  }

  const brand = token.user;

  // 1. Await searchParams before accessing its properties
  const query = await searchParams;
  
  // 2. Parse search query from the URL, providing defaults
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const search = query.search || '';
  const status = query.status || '';
  const isPrivate = query.isPrivate || '';
  const sort = query.sort as keyof typeof CampaignSortOptions || 'latest';

  // 3. Fetch paginated data instead of all campaigns
  const campaignsPaginated = await CampaignModel.getPaginatedCampaigns(brand.id, {
    page,
    limit,
    search,
    status,
    isPrivate,
    sort,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage all your affiliate campaigns</p>
        </div>
        <Link href={getRoute('brand.campaigns.create')}>
          <Button className='cursor-pointer'>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* 4. Pass the entire paginated data object to the client component */}
      <CampaignTable data={campaignsPaginated} />
    </div>
  );
}
