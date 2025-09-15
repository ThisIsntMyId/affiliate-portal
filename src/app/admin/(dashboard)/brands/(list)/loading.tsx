import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getRoute } from '@/app/admin/routes';
import { DynamicTable } from '@/components/DynamicTable';
import { Card, CardContent } from '@/components/ui/card';
import { genericTableLoadingConfig } from '@/lib/genericTableAndFormConfig';

export default async function AdminBrands() {
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600 mt-1">Manage all brands in the system</p>
        </div>
        <Link href={getRoute('admin.brands.create')}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Brand
          </Button>
        </Link>
      </div>

      <Card className="w-full">
            <CardContent>
                <DynamicTable
                    loading={true}
                    data={[]}
                    columns={genericTableLoadingConfig}
                />
            </CardContent>
        </Card>
    </div>
  );
}