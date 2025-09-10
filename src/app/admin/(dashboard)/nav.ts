"use client"

import { NavigationConfig } from '@/types/navigation';
import { getRoute } from '../routes';
import { 
  LayoutDashboard, 
  Building2
} from 'lucide-react';

export const adminNavigationConfig: NavigationConfig = {
  items: [
    { url: getRoute('admin.dashboard'), icon: LayoutDashboard, title: 'Dashboard' },
    { url: getRoute('admin.brands'), icon: Building2, title: 'Brands' },
  ]
};
