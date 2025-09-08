import { NavigationConfig } from '@/types/navigation';

export const demoNavigationConfig: NavigationConfig = {
  items: [
    { url: '/demo', icon: 'layout-dashboard', title: 'Overview' },
    { url: '/demo/forms', icon: 'file-text', title: 'Forms' },
    { url: '/demo/table', icon: 'table', title: 'Tables' },
    { url: '/demo/charts', icon: 'bar-chart-3', title: 'Charts' },
    { url: '/demo/stat-cards', icon: 'trending-up', title: 'Stat Cards' },
    { url: '/demo/reusable-components', icon: 'puzzle', title: 'Reusable Components' }
  ]
};
