'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { NavigationConfig, MenuItem } from '@/types/navigation';

interface SidebarProps {
  navigationConfig: NavigationConfig;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export function Sidebar({ navigationConfig, headerSlot, footerSlot }: SidebarProps) {
  const pathname = usePathname();

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    const ungrouped: MenuItem[] = [];
    
    navigationConfig.items.forEach(item => {
      // Check if item is active based on URL or isActive prop
      const isActive = item.isActive ?? pathname === item.url;
      const itemWithActive = { ...item, isActive };
      
      if (item.group) {
        if (!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(itemWithActive);
      } else {
        ungrouped.push(itemWithActive);
      }
    });
    
    return { groups, ungrouped };
  }, [navigationConfig.items, pathname]);

  const renderIcon = (iconName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const NavigationItem = ({ item }: { item: MenuItem }) => {
    const linkProps = item.openInNewTab ? {
      href: item.url,
      target: '_blank',
      rel: 'noopener noreferrer'
    } : {
      href: item.url
    };

    return (
      <a
        {...linkProps}
        className={`
          flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
          ${item.isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }
        `}
      >
        {renderIcon(item.icon)}
        <span className="ml-3">{item.title}</span>
      </a>
    );
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Header Slot - Fixed */}
      {headerSlot && (
        <div className="flex-shrink-0 border-b border-gray-700">
          {headerSlot}
        </div>
      )}
      
      {/* Navigation - Scrollable */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {/* Ungrouped items */}
        {groupedItems.ungrouped.map(item => (
          <NavigationItem key={item.url} item={item} />
        ))}
        
        {/* Grouped items */}
        {Object.entries(groupedItems.groups).map(([groupName, items]) => (
          <div key={groupName} className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {groupName}
            </h3>
            <div className="mt-2 space-y-1">
              {items.map(item => (
                <NavigationItem key={item.url} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Slot - Fixed */}
      {footerSlot && (
        <div className="flex-shrink-0 border-t border-gray-700">
          {footerSlot}
        </div>
      )}
    </aside>
  );
}
