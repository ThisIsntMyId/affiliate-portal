import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'default' | 'dark';
}

export function BrandLogo({ variant = 'default' }: BrandLogoProps) {
  const isDark = variant === 'dark';
  
  return (
    <div className={isDark ? "mb-8" : "p-6"}>
      <Link href="/" className="flex items-center space-x-2">
        <div className={`w-8 h-8 ${isDark ? 'bg-gray-800' : 'bg-blue-600'} rounded-lg flex items-center justify-center`}>
          <span className={`${isDark ? 'text-gray-200' : 'text-white'} font-bold text-lg`}>A</span>
        </div>
        <span className={`text-xl font-bold ${isDark ? 'text-gray-800' : 'text-white'}`}>Affiliate Portal</span>
      </Link>
    </div>
  );
}
