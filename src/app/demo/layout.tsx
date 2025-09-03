import { BaseLayout } from '@/components/BaseLayout';
import { demoNavigationConfig } from './nav';

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
    >
      {children}
    </BaseLayout>
  );
}
