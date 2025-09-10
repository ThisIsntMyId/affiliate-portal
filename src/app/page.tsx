
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Affiliate Portal
          </h1>
          <p className="text-xl text-gray-600">
            Choose your panel to get started
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Admin Panel */}
          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin</h3>
            <p className="text-sm text-gray-600 mb-4">System administration</p>
            <div className="space-y-2">
              <Link 
                href="/admin" 
                className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/login" 
                className="block w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-sm"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Brand Panel */}
          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand</h3>
            <p className="text-sm text-gray-600 mb-4">Brand management</p>
            <div className="space-y-2">
              <Link 
                href="/brand" 
                className="block w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
              >
                Dashboard
              </Link>
              <Link 
                href="/brand/login" 
                className="block w-full border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-50 transition-colors text-sm"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Affiliate Panel */}
          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition-colors">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Affiliate</h3>
            <p className="text-sm text-gray-600 mb-4">Affiliate dashboard</p>
            <div className="space-y-2">
              <Link 
                href="/affiliate" 
                className="block w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors text-sm"
              >
                Dashboard
              </Link>
              <Link 
                href="/affiliate/login" 
                className="block w-full border border-purple-500 text-purple-500 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors text-sm"
              >
                Login
              </Link>
              <Link 
                href="/affiliate/register" 
                className="block w-full border border-purple-500 text-purple-500 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors text-sm"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Referral Page */}
          <Link 
            href="/referral" 
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
          >
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Referral</h3>
            <p className="text-sm text-gray-600">Referral welcome</p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Development Mode - All panels are accessible without authentication
          </p>
        </div>
      </div>
    </div>
  );
}
