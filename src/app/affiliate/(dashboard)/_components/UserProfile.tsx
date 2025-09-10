interface UserProfileProps {
  userType: 'admin' | 'brand' | 'affiliate';
}

export function UserProfile({ userType }: UserProfileProps) {
  const userData = {
    admin: { name: 'John Admin', email: 'john@admin.com', role: 'Administrator' },
    brand: { name: 'Sarah Brand', email: 'sarah@brand.com', role: 'Brand Manager' },
    affiliate: { name: 'Mike Affiliate', email: 'mike@affiliate.com', role: 'Affiliate Partner' }
  };

  const user = userData[userType];

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}
