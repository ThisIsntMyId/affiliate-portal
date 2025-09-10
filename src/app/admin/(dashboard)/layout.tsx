import { BaseLayout } from '@/components/BaseLayout';
import { adminNavigationConfig } from './nav';
import { BrandLogo, LogoutButton } from './_components';

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
      sidebarHeaderSlot={
        <div>
          <BrandLogo />
        </div>
      }
      sidebarFooterSlot={<LogoutButton />}
    >
      {children}
    </BaseLayout>
  );
}