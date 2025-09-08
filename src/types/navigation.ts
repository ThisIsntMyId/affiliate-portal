export interface MenuItem {
  url: string;
  icon: string; // Lucide icon name
  title: string;
  group?: string;
  isActive?: boolean;
  isExternal?: boolean;
}

export interface NavigationConfig {
  items: MenuItem[];
}

export interface BaseLayoutProps {
  children: React.ReactNode;
  navigationConfig: NavigationConfig;
  logo?: React.ReactNode | string;
  backgroundColor?: 'white' | 'gray-50' | 'gray-100' | string;
  sidebarHeaderSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
}
