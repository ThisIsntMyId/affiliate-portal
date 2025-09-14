"use client"

import { NavigationConfig } from '@/types/navigation';
import { getRoute } from '../routes';
import { 
  LayoutDashboard, 
  FileText, 
  Table, 
  BarChart3, 
  TrendingUp, 
  Puzzle, 
  Type, 
  LogIn, 
  MailCheck 
} from 'lucide-react';

const NavigationGroups = {
  AUTH: 'AUTH',
  GENERAL: 'General'
}

export const demoNavigationConfig: NavigationConfig = {
  items: [
    { url: getRoute('demo.dashboard'), icon: LayoutDashboard, title: 'Overview' },
    { url: getRoute('demo.forms'), icon: FileText, title: 'Forms' },
    { url: getRoute('demo.table'), icon: Table, title: 'Tables' },
    { url: getRoute('demo.charts'), icon: BarChart3, title: 'Charts' },
    { url: getRoute('demo.stat-cards'), icon: TrendingUp, title: 'Stat Cards' },
    { url: getRoute('demo.reusable-components'), icon: Puzzle, title: 'Reusable Components' },
    { url: getRoute('demo.rich-text-editor'), icon: Type, title: 'Rich Text Editor' },
    
    { url: getRoute('demo.login'), group: NavigationGroups.AUTH, icon: LogIn, title: 'Login', openInNewTab: true },
    { url: getRoute('demo.verify-account'), group: NavigationGroups.AUTH, icon: MailCheck, title: 'Verify Account', openInNewTab: true },
  ]
};
