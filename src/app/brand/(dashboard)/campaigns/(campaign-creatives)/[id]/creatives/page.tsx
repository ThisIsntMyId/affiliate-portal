import { CreativeModel, CreativeSortOptions } from '@/models/brand/creative.model';
import CreativesTable from './CreativesTable';
import { getCurrentUser } from '@/auth/brand';
import { CampaignDetailsTab } from '../../../_components/CampaignDetailsTab';

export default async function CreativesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Get authenticated brand
  const token = await getCurrentUser();
  if (!token) {
    throw new Error('Authentication required');
  }

  const { id: campaignId } = await params;

  // 1. Await searchParams before accessing its properties
  const query = await searchParams;
  
  // 2. Parse search query from the URL, providing defaults
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const search = query.search || '';
  const type = query.type || '';
  const isActive = query.isActive || '';
  const sort = query.sort as keyof typeof CreativeSortOptions || 'latest';

  // 3. Fetch paginated creatives data
  const creativesPaginated = await CreativeModel.getPaginatedCreatives(parseInt(campaignId), {
    page,
    limit,
    search,
    type,
    isActive,
    sort,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creatives</h1>
          <p className="text-gray-600 mt-1">Manage creative assets for this campaign</p>
        </div>
      </div>

      <CampaignDetailsTab campaignId={campaignId} />

      {/* 4. Pass the entire paginated data object to the client component */}
      <CreativesTable data={creativesPaginated} />
    </div>
  );
}
