import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'default' | 'dark';
}

export function BrandLogo({ variant = 'default' }: BrandLogoProps) {
  const isDark = variant === 'dark';
  
  return (
    <div className={isDark ? "mb-8" : "p-6"}>
      <Link href="/admin" className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${isDark ? 'bg-gray-800' : 'bg-purple-600'} rounded-full flex items-center justify-center`}>
          <span className={`${isDark ? 'text-gray-200' : 'text-white'} font-bold text-lg`}>AD</span>
        </div>
        <span className={`text-xl font-bold ${isDark ? 'text-gray-200' : 'text-white'}`}>Admin Panel</span>
      </Link>
    </div>
  );
}
