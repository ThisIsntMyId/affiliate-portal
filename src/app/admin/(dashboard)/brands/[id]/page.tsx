import { BrandModel } from '@/models/admin/brand.model';
import { BrandForm } from './BrandForm';
import { notFound } from 'next/navigation';

export default async function EditBrandPage({ params }: {params: Promise<{id: string}>}) {
  const {id} = await params;
  
  const brandId = parseInt(id);
  
  if (isNaN(brandId)) {
    notFound();
  }

  // sleep for 5 sec
  await new Promise(resolve => setTimeout(resolve, 5000));

  const brand = await BrandModel.getBrandById(brandId);
  
  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Brand</h1>
        <p className="text-gray-600 mt-1">Update brand information and settings</p>
      </div>

      <BrandForm brand={brand} />
    </div>
  );
}