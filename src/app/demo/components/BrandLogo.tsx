import Link from 'next/link';

export function BrandLogo() {
  return (
    <div className="p-6">
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="text-xl font-bold text-white">Affiliate Portal</span>
      </Link>
    </div>
  );
}
