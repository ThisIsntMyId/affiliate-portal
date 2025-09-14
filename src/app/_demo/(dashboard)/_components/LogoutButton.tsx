'use client';

import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const handleLogout = () => {
    // In a real app, this would handle actual logout logic
    console.log('Logging out...');
    // Could redirect to login page or clear auth tokens
    // window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
    >
      <LogOut className="w-4 h-4 mr-3" />
      <span className="text-sm font-medium">Logout</span>
    </button>
  );
}
