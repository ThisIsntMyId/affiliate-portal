import { BaseLayout } from '@/components/BaseLayout';
import { brandNavigationConfig } from './nav';
import { UserProfile } from './_components/UserProfile';
import { LogoutButton } from './_components/LogoutButton';

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout
      navigationConfig={brandNavigationConfig}
      logo="Brand"
      backgroundColor="gray-50"
      sidebarHeaderSlot={<UserProfile userType="brand" />}
      sidebarFooterSlot={<LogoutButton />}
    >
      {children}
    </BaseLayout>
  );
}