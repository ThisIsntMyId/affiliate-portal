import { BaseLayout } from '@/components/BaseLayout';
import { adminNavigationConfig } from './nav';
import { UserProfile } from './_components/UserProfile';
import { LogoutButton } from './_components/LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout
      navigationConfig={adminNavigationConfig}
      logo="Admin"
      backgroundColor="gray-50"
      sidebarHeaderSlot={<UserProfile userType="admin" />}
      sidebarFooterSlot={<LogoutButton />}
    >
      {children}
    </BaseLayout>
  );
}