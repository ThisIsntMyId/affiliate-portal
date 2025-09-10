/**
 * Affiliate panel routes configuration
 * 
 * This file defines all routes for the affiliate panel using the centralized
 * routing system. Routes follow Laravel's dot notation pattern.
 */

import { 
  buildRoute, 
  type RouteConfig, 
  type RouteParams, 
  type RouteQuery 
} from '@/lib/routes'

// Affiliate panel route definitions
const routes: RouteConfig = {
  // Dashboard routes
  'affiliate.dashboard': '/affiliate',
  
  // Link routes
  'affiliate.links': '/affiliate/links',
  'affiliate.links.create': '/affiliate/links/create',
  'affiliate.links.edit': '/affiliate/links/{id}/edit',
  'affiliate.links.show': '/affiliate/links/{id}',
  
  // Reports routes
  'affiliate.reports': '/affiliate/reports',
  'affiliate.reports.show': '/affiliate/reports/{id}',
  
  // Payouts routes
  'affiliate.payouts': '/affiliate/payouts',
  'affiliate.payouts.show': '/affiliate/payouts/{id}',
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
