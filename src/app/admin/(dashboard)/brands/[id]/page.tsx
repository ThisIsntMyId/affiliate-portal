// import { BrandModel } from '@/models/admin/brand.model';
// import { BrandForm } from './BrandForm';
// import { notFound } from 'next/navigation';

// interface EditBrandPageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function EditBrandPage({ params }: EditBrandPageProps) {
//   const brandId = parseInt(params.id);
  
//   if (isNaN(brandId)) {
//     notFound();
//   }

//   const brand = await BrandModel.getBrandById(brandId);
  
//   if (!brand) {
//     notFound();
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Edit Brand</h1>
//         <p className="text-gray-600 mt-1">Update brand information and settings</p>
//       </div>

//       <BrandForm brand={brand} />
//     </div>
//   );
// }


export default function EditBrandPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Brand Edit
      </h1>
      <div className="text-gray-600">
        Brand edit page
      </div>
    </div>
  );
}
