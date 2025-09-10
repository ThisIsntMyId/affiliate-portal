import { NavigationConfig } from '@/types/navigation';
import { getRoute } from '../routes';

const NavigationGroups = {
  AUTH: 'AUTH',
  GENERAL: 'General'
}

export const demoNavigationConfig: NavigationConfig = {
  items: [
    { url: getRoute('demo.dashboard'), icon: 'layout-dashboard', title: 'Overview' },
    { url: getRoute('demo.forms'), icon: 'file-text', title: 'Forms' },
    { url: getRoute('demo.table'), icon: 'table', title: 'Tables' },
    { url: getRoute('demo.charts'), icon: 'bar-chart-3', title: 'Charts' },
    { url: getRoute('demo.stat-cards'), icon: 'trending-up', title: 'Stat Cards' },
    { url: getRoute('demo.reusable-components'), icon: 'puzzle', title: 'Reusable Components' },
    { url: getRoute('demo.rich-text-editor'), icon: 'type', title: 'Rich Text Editor' },
    
    { url: getRoute('demo.login'), group: NavigationGroups.AUTH, icon: 'log-in', title: 'Login', openInNewTab: true },
    { url: getRoute('demo.verify-account'), group: NavigationGroups.AUTH, icon: 'mail-check', title: 'Verify Account', openInNewTab: true },
  ]
};
