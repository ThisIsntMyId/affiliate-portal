import { BrandModel, BrandSortOptions } from '@/models/admin/brand.model';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import BrandTable from './BrandTable';
import { getRoute } from '@/app/admin/routes';

export default async function AdminBrands({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // 1. Await searchParams before accessing its properties
  const query = await searchParams;
  
  // 2. Parse search query from the URL, providing defaults
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const search = query.search || '';
  const status = query.status || '';
  const sort = query.sort as keyof typeof BrandSortOptions || 'latest';

  // 3. Fetch paginated data instead of all brands
  const brandsPaginated = await BrandModel.getPaginatedBrands({
    page,
    limit,
    search,
    status,
    sort,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600 mt-1">Manage all brands in the system</p>
        </div>
        <Link href={getRoute('admin.brands.create')}>
          <Button className='cursor-pointer'>
            <Plus className="h-4 w-4 mr-2" />
            Create Brand
          </Button>
        </Link>
      </div>

      {/* 4. Pass the entire paginated data object to the client component */}
      <BrandTable data={brandsPaginated} />
    </div>
  );
}