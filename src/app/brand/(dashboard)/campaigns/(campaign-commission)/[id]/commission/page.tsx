import { CommissionRateModel, CommissionRateSortOptions } from '@/models/brand/commission.model';
import CommissionTable from './CommissionTable';
import { getCurrentUser } from '@/auth/brand';
import { CampaignDetailsTab } from '../../../_components/CampaignDetailsTab';
import { CommissionForm } from './CommissionForm';

export default async function CommissionRatesPage({
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
  const sort = query.sort as keyof typeof CommissionRateSortOptions || 'latest';

  // 3. Fetch paginated commission rates data
  const commissionRatesPaginated = await CommissionRateModel.getPaginatedCommissionRates(parseInt(campaignId), {
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
          <h1 className="text-3xl font-bold text-gray-900">Commission Rates</h1>
          <p className="text-gray-600 mt-1">Manage commission rates for this campaign</p>
        </div>
        <CommissionForm campaignId={parseInt(campaignId)}>
          Add Commission
        </CommissionForm>
      </div>

      <CampaignDetailsTab campaignId={campaignId} />

      {/* 4. Pass the entire paginated data object to the client component */}
      <CommissionTable data={commissionRatesPaginated} />
    </div>
  );
}
