import { redirect } from 'next/navigation';
import { BaseLayout } from '@/components/BaseLayout';
import { brandNavigationConfig } from './nav';
import { BrandLogo, UserProfile, LogoutButton } from './_components';
import { getCurrentUser, getFullUser } from '@/auth/brand';
import { getRoute } from '@/app/brand/routes';
import { AuthProvider } from './_components';

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect(getRoute('brand.login'));
  }

  // Get full brand data to check status
  const fullUser = await getFullUser();
  if (!fullUser) {
    redirect(getRoute('brand.login'));
  }

  // Check if brand is active
  if (fullUser.status !== 'active') {
    redirect('/brand/inactive');
  }

  return (
    <AuthProvider user={user}>
      <BaseLayout
        navigationConfig={brandNavigationConfig}
        logo="Brand"
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