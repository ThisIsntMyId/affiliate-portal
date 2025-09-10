/**
 * Brand panel routes configuration
 * 
 * This file defines all routes for the brand panel using the centralized
 * routing system. Routes follow Laravel's dot notation pattern.
 */

import { 
  buildRoute, 
  type RouteConfig, 
  type RouteParams, 
  type RouteQuery 
} from '@/lib/routes'

// Brand panel route definitions
const routes: RouteConfig = {
  // Dashboard routes
  'brand.dashboard': '/brand',
  
  // Campaign routes
  'brand.campaigns': '/brand/campaigns',
  'brand.campaigns.create': '/brand/campaigns/create',
  'brand.campaigns.edit': '/brand/campaigns/{id}/edit',
  'brand.campaigns.show': '/brand/campaigns/{id}',
  
  // Affiliate Group routes
  'brand.affiliates': '/brand/affiliates',
  'brand.affiliates.create': '/brand/affiliates/create',
  'brand.affiliates.edit': '/brand/affiliates/{id}/edit',
  'brand.affiliates.show': '/brand/affiliates/{id}',
  'brand.affiliates.reports': '/brand/affiliates/reports',
  'brand.affiliates.payouts': '/brand/affiliates/payouts',
  'brand.affiliates.payouts.show': '/brand/affiliates/payouts/{id}',
  
  // Referral Group routes
  'brand.referrals': '/brand/referrals',
  'brand.referrals.reports': '/brand/referrals/reports',
  'brand.referrals.withdrawals': '/brand/referrals/withdrawals',
  'brand.referrals.withdrawals.show': '/brand/referrals/withdrawals/{id}',
  
  // Settings Group routes
  'brand.settings.refer-earn': '/brand/settings/refer-earn',
  'brand.settings.affiliate-signup': '/brand/settings/affiliate-signup',
  'brand.settings.general': '/brand/settings/general',
} as const

export function getRoute(
  routeName: keyof typeof routes,
  params?: RouteParams,
  query?: RouteQuery
): string {
  return buildRoute(routes[routeName], params, query)
}

export function getFullRoute(
  routeName: keyof typeof routes,
  params?: RouteParams,
  query?: RouteQuery
): string {
  // Get base URL from environment or use localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  process.env.VERCEL_URL || 
                  'http://localhost:3000'
  
  return buildRoute(routes[routeName], params, query, baseUrl)
}

// Export the routes object for type checking and debugging
export { routes }
