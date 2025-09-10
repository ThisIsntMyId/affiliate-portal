import Link from 'next/link';
import { Settings } from 'lucide-react';

export function UserProfile() {
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">JA</span>
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">John Admin</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Administrator
            </span>
          </div>
        </div>
        
        {/* Settings Icon */}
        <Link 
          href="/admin/settings" 
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
