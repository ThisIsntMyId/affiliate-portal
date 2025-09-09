import { BaseLayout } from '@/components/BaseLayout';
import { demoNavigationConfig } from './nav';
import { BrandLogo, UserProfile, UpsellCard, LogoutButton } from './components';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout 
      navigationConfig={demoNavigationConfig}
      logo="Demo Portal"
      backgroundColor="gray-50"
      sidebarHeaderSlot={
        <div>
          <BrandLogo />
        </div>
      }
      sidebarFooterSlot={
        <div>
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
