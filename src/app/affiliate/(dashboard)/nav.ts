"use client"

import { NavigationConfig } from '@/types/navigation';
import { getRoute } from '../routes';
import { 
  LayoutDashboard, 
  Link,
  BarChart3,
  CreditCard
} from 'lucide-react';

export const affiliateNavigationConfig: NavigationConfig = {
  items: [
    { url: getRoute('affiliate.dashboard'), icon: LayoutDashboard, title: 'Dashboard' },
    { url: getRoute('affiliate.links'), icon: Link, title: 'Link' },
    { url: getRoute('affiliate.reports'), icon: BarChart3, title: 'Reports' },
    { url: getRoute('affiliate.payouts'), icon: CreditCard, title: 'Payouts' },
  ]
};
