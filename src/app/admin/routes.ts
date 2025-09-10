/**
 * Admin panel routes configuration
 * 
 * This file defines all routes for the admin panel using the centralized
 * routing system. Routes follow Laravel's dot notation pattern.
 */

import { 
  buildRoute, 
  type RouteConfig, 
  type RouteParams, 
  type RouteQuery 
} from '@/lib/routes'

// Admin panel route definitions
const routes: RouteConfig = {
  // Dashboard routes
  'admin.dashboard': '/admin',
  
  // Brand management routes
  'admin.brands': '/admin/brands',
  'admin.brands.create': '/admin/brands/create',
  'admin.brands.edit': '/admin/brands/{id}/edit',
  'admin.brands.show': '/admin/brands/{id}',
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
