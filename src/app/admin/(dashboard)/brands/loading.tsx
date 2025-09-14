import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getRoute } from '../../routes';
import { ColumnConfig, DynamicTable } from '@/components/DynamicTable';
import { Card, CardContent } from '@/components/ui/card';

const columns: ColumnConfig[] = [
    {
        key: 'col1',
        field: 'col1',
        label: 'Col1',
        type: 'text',
    },
    {
        key: 'col2',
        field: 'col2',
        label: 'Col2',
        type: 'text',
    },
    {
        key: 'col3',
        field: 'col3',
        label: 'Col3',
        type: 'text',
    },
    {
        key: 'col4',
        field: 'col4',
        label: 'Col4',
        type: 'text',
    },
    {
        key: 'col5',
        field: 'col5',
        label: 'Col5',
        type: 'text',
    }
];

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
                    columns={columns}
                />
            </CardContent>
        </Card>
    </div>
  );
}