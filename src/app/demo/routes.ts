/**
 * Demo panel routes configuration
 * 
 * This file defines all routes for the demo panel using the centralized
 * routing system. Routes follow Laravel's dot notation pattern.
 */

import { 
  buildRoute, 
  type RouteConfig, 
  type RouteParams, 
  type RouteQuery 
} from '@/lib/routes'

// Demo panel route definitions - only actual routes that exist
const routes: RouteConfig = {
  // Dashboard routes
  'demo.dashboard': '/demo',
  
  // Form routes
  'demo.forms': '/demo/forms',
  
  // Table routes
  'demo.table': '/demo/table',
  
  // Chart routes
  'demo.charts': '/demo/charts',
  
  // Stat card routes
  'demo.stat-cards': '/demo/stat-cards',
  
  // Component routes
  'demo.reusable-components': '/demo/reusable-components',
  
  // Rich text editor routes
  'demo.rich-text-editor': '/demo/rich-text-editor',
  
  // Authentication routes
  'demo.login': '/demo/login',
  'demo.verify-account': '/demo/verify-account'
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
