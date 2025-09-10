import { BaseLayout } from '@/components/BaseLayout';
import { affiliateNavigationConfig } from './nav';
import { UserProfile } from './_components/UserProfile';
import { UpsellCard } from './_components/UpsellCard';
import { LogoutButton } from './_components/LogoutButton';

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
      sidebarHeaderSlot={<UserProfile userType="affiliate" />}
      sidebarFooterSlot={
        <div className="space-y-4">
          <UpsellCard />
          <LogoutButton />
        </div>
      }
    >
      {children}
    </BaseLayout>
  );
}