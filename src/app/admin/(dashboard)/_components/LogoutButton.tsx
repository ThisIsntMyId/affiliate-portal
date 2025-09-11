import { LogOut } from 'lucide-react';
import { logout } from '@/actions/admin/auth.action';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
      >
        <LogOut className="w-4 h-4 mr-3" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </form>
  );
}
