"use client";

import { usePathname } from 'next/navigation';
import { getRoute } from '@/app/brand/routes';
import { Settings, Percent, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CampaignDetailsTabProps {
  campaignId: string | number;
  className?: string;
}

export function CampaignDetailsTab({ campaignId, className }: CampaignDetailsTabProps) {
  const pathname = usePathname();

  if(!pathname) return;

  const isDetailsActive = pathname.endsWith(`/campaigns/${campaignId}`);
  const isCommissionActive = pathname.includes(`/commission`);
  const isCreativesActive = pathname.includes(`/creatives`);

  return (
    <div className={className}>
      <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
        <Link href={getRoute('brand.campaigns.edit', { id: campaignId })}>
          <Button 
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isDetailsActive 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
            variant="ghost"
          >
            <Settings className="h-4 w-4 mr-2" />
            Campaign Details
          </Button>
        </Link>
        
        <Link href={getRoute('brand.campaigns.commission', { id: campaignId })}>
          <Button 
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isCommissionActive 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
            variant="ghost"
          >
            <Percent className="h-4 w-4 mr-2" />
            Commission Rates
          </Button>
        </Link>
        
        <Link href={getRoute('brand.campaigns.creatives', { id: campaignId })}>
          <Button 
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isCreativesActive 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
            variant="ghost"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Creatives
          </Button>
        </Link>
      </div>
    </div>
  );
}