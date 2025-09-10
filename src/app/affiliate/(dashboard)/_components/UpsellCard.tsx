import { ArrowRight, Star } from 'lucide-react';

export function UpsellCard() {
  return (
    <div className="p-4 m-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Star className="w-5 h-5 text-yellow-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">
            Upgrade to Pro
          </h3>
          <p className="text-xs text-blue-100 mb-3">
            Unlock advanced features and analytics
          </p>
          <button className="inline-flex items-center text-xs font-medium text-white hover:text-blue-100 transition-colors">
            Learn More
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
