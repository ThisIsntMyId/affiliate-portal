import { BaseLayout } from '@/components/BaseLayout';
import { affiliateNavigationConfig } from './nav';
import { BrandLogo, UserProfile, UpsellCard, LogoutButton } from './_components';

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout
      navigationConfig={affiliateNavigationConfig}
      logo="Affiliate"
      backgroundColor="gray-50"
      sidebarHeaderSlot={
        <div>
          <BrandLogo />
        </div>
      }
      sidebarFooterSlot={
        <div className="space-y-4">
          <UpsellCard />
          <UserProfile />
          <LogoutButton />
        </div>
      }
    >
      {children}
    </BaseLayout>
  );
}