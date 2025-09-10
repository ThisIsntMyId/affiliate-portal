import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function UpsellCard() {
  return (
    <div className="p-4 m-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-white font-semibold text-sm mb-1">Upgrade to Pro</h3>
        <p className="text-blue-100 text-xs mb-3 leading-relaxed">
          Unlock advanced features and analytics
        </p>
        <Link 
          href="/subscribe" 
          className="inline-flex items-center text-white text-xs font-medium hover:text-blue-200 transition-colors"
        >
          Learn more
          <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  );
}
