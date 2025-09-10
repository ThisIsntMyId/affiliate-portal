import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  url: string;
  icon: LucideIcon; // Lucide icon component
  title: string;
  group?: string;
  isActive?: boolean;
  isExternal?: boolean;
  openInNewTab?: boolean;
  children?: MenuItem[];
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
