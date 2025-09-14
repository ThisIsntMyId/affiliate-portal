import { CreateBrandForm } from './CreateBrandForm';

export default function CreateBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Brand</h1>
        <p className="text-gray-600 mt-1">Add a new brand to the system</p>
      </div>

      <CreateBrandForm />
    </div>
  );
}
