import { redirect } from 'next/navigation';
import { BaseLayout } from '@/components/BaseLayout';
import { adminNavigationConfig } from './nav';
import { BrandLogo, UserProfile, LogoutButton } from './_components';
import { getCurrentUser } from '@/auth/admin';
import { getRoute } from '../routes';
import { AuthProvider } from './_components/AuthProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect(getRoute('admin.login'));
  }

  return (
    <AuthProvider user={user}>
      <BaseLayout
        navigationConfig={adminNavigationConfig}
        logo="Admin"
        backgroundColor="gray-50"
        sidebarHeaderSlot={
          <div>
            <BrandLogo />
          </div>
        }
        sidebarFooterSlot={
          <div>
            <UserProfile />
            <LogoutButton />
          </div>
        }
      >
        {children}
      </BaseLayout>
    </AuthProvider>
  );
}