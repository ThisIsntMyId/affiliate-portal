'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { BaseLayoutProps } from '@/types/navigation';

export function BaseLayout({ 
  children, 
  navigationConfig, 
  logo = '[Brand Logo]',
  backgroundColor = 'gray-50',
  sidebarHeaderSlot,
  sidebarFooterSlot
}: BaseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bgClass = backgroundColor === 'white' ? 'bg-white' :
                  backgroundColor === 'gray-50' ? 'bg-gray-50' :
                  backgroundColor === 'gray-100' ? 'bg-gray-100' :
                  backgroundColor;

  return (
    <div className={`flex h-screen ${bgClass}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar - Fixed width and height */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          navigationConfig={navigationConfig} 
          headerSlot={sidebarHeaderSlot}
          footerSlot={sidebarFooterSlot}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{logo}</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
        
        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
