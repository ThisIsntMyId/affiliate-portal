import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/auth/admin';
import { getRoute } from '../routes';

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is already authenticated
  const user = await getCurrentUser();
  if (user) {
    redirect(getRoute('admin.dashboard'));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Admin
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
