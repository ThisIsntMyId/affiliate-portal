import { NavigationConfig } from '@/types/navigation';

const NavigationGroups = {
  AUTH: 'AUTH',
  GENERAL: 'General'
}

export const demoNavigationConfig: NavigationConfig = {
  items: [
    { url: '/demo', icon: 'layout-dashboard', title: 'Overview' },
    { url: '/demo/forms', icon: 'file-text', title: 'Forms' },
    { url: '/demo/table', icon: 'table', title: 'Tables' },
    { url: '/demo/charts', icon: 'bar-chart-3', title: 'Charts' },
    { url: '/demo/stat-cards', icon: 'trending-up', title: 'Stat Cards' },
    { url: '/demo/reusable-components', icon: 'puzzle', title: 'Reusable Components' },
    { url: '/demo/rich-text-editor', icon: 'type', title: 'Rich Text Editor' },
    
    { url: '/demo/login', group: NavigationGroups.AUTH, icon: 'log-in', title: 'Login', openInNewTab: true },
    { url: '/demo/verify-account', group: NavigationGroups.AUTH, icon: 'mail-check', title: 'Verify Account', openInNewTab: true },
  ]
};
