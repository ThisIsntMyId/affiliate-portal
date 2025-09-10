import { BaseLayout } from '@/components/BaseLayout';
import { brandNavigationConfig } from './nav';
import { BrandLogo, LogoutButton } from './_components';

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