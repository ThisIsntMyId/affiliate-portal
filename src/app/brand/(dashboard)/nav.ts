"use client"

import { NavigationConfig } from '@/types/navigation';
import { getRoute } from '../routes';
import { 
  LayoutDashboard, 
  Megaphone,
  Users,
  BarChart3,
  CreditCard,
  UserCheck,
  TrendingUp,
  DollarSign,
  Settings,
  UserPlus,
  Cog
} from 'lucide-react';

const NavigationGroups = {
  AFFILIATE: 'Affiliate Group',
  REFERRAL: 'Referral Group',
  SETTINGS: 'Settings Group'
}

export const brandNavigationConfig: NavigationConfig = {
  items: [
    { url: getRoute('brand.dashboard'), icon: LayoutDashboard, title: 'Dashboard' },
    { url: getRoute('brand.campaigns'), icon: Megaphone, title: 'Campaigns' },
    
    { url: getRoute('brand.affiliates'), group: NavigationGroups.AFFILIATE, icon: Users, title: 'Affiliates' },
    { url: getRoute('brand.affiliates.reports'), group: NavigationGroups.AFFILIATE, icon: BarChart3, title: 'Reports' },
    { url: getRoute('brand.affiliates.payouts'), group: NavigationGroups.AFFILIATE, icon: CreditCard, title: 'Payouts' },
    
    { url: getRoute('brand.referrals'), group: NavigationGroups.REFERRAL, icon: UserCheck, title: 'Referrals' },
    { url: getRoute('brand.referrals.reports'), group: NavigationGroups.REFERRAL, icon: TrendingUp, title: 'Reports' },
    { url: getRoute('brand.referrals.withdrawals'), group: NavigationGroups.REFERRAL, icon: DollarSign, title: 'Withdrawals' },
    
    { url: getRoute('brand.settings.refer-earn'), group: NavigationGroups.SETTINGS, icon: Settings, title: 'Refer & Earn' },
    { url: getRoute('brand.settings.affiliate-signup'), group: NavigationGroups.SETTINGS, icon: UserPlus, title: 'Affiliate Signup' },
    { url: getRoute('brand.settings.general'), group: NavigationGroups.SETTINGS, icon: Cog, title: 'General' },
  ]
};
