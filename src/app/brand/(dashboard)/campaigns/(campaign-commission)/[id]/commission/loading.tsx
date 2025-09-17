import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getRoute } from '@/app/brand/routes';
import { DynamicTable } from '@/components/DynamicTable';
import { Card, CardContent } from '@/components/ui/card';
import { skeletonTableColumns } from '@/lib/skeletonConfigs';

export default async function BrandCampaignsLoading() {
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage all your affiliate campaigns</p>
        </div>
        <Link href={getRoute('brand.campaigns.create')}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <Card className="w-full">
            <CardContent>
                <DynamicTable
                    loading={true}
                    data={[]}
                    columns={skeletonTableColumns}
                />
            </CardContent>
        </Card>
    </div>
  );
}
