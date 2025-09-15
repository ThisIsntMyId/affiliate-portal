import { createRouteBuilder } from "@/lib/routes"

const routes = {
  // Auth routes
  'brand.login': '/brand/login',
  'brand.inactive': '/brand/inactive',
  
  // Dashboard routes
  'brand.dashboard': '/brand',
  
  // Campaign routes
  'brand.campaigns': '/brand/campaigns',
  'brand.campaigns.create': '/brand/campaigns/create',
  'brand.campaigns.edit': '/brand/campaigns/[id]/edit',
  'brand.campaigns.show': '/brand/campaigns/[id]',
  
  // Affiliate Group routes
  'brand.affiliates': '/brand/affiliates',
  'brand.affiliates.create': '/brand/affiliates/create',
  'brand.affiliates.edit': '/brand/affiliates/[id]/edit',
  'brand.affiliates.show': '/brand/affiliates/[id]',
  'brand.affiliates.reports': '/brand/affiliates/reports',
  'brand.affiliates.payouts': '/brand/affiliates/payouts',
  'brand.affiliates.payouts.show': '/brand/affiliates/payouts/[id]',
  
  // Referral Group routes
  'brand.referrals': '/brand/referrals',
  'brand.referrals.reports': '/brand/referrals/reports',
  'brand.referrals.withdrawals': '/brand/referrals/withdrawals',
  'brand.referrals.withdrawals.show': '/brand/referrals/withdrawals/[id]',
  
  // Settings Group routes
  'brand.settings.refer-earn': '/brand/settings/refer-earn',
  'brand.settings.affiliate-signup': '/brand/settings/affiliate-signup',
  'brand.settings.general': '/brand/settings/general',
} as const

export const getRoute = createRouteBuilder(routes)