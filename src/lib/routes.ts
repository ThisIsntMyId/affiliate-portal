/**
 * Shared route utilities and types for centralized route management
 * 
 * This module provides the core functionality for the Laravel-inspired
 * routing system used throughout the application.
 */

// Base types for route values
export type RouteValue = string | number | boolean

// Parameter and query types
export type RouteParams = Record<string, RouteValue>
export type RouteQuery = Record<string, RouteValue>

// Route definition types
export type SimpleRoute = string

export type ComplexRoute = {
  path: string
  params?: RouteParams
  query?: RouteQuery
}

export type RouteDefinition = SimpleRoute | ComplexRoute
export type RouteConfig = Record<string, RouteDefinition>

/**
 * Builds a route path from route definition, parameters, and query parameters
 * 
 * @param routeDef - The route definition (string or object)
 * @param params - Path parameters to replace in the route
 * @param query - Query parameters to append to the route
 * @param baseUrl - Optional base URL (defaults to '/')
 * @returns The built route path or full URL
 */
export function buildRoute(
  routeDef: RouteDefinition,
  params?: RouteParams,
  query?: RouteQuery,
  baseUrl: string = '/'
): string {
  let path: string

  // Handle simple string routes
  if (typeof routeDef === 'string') {
    path = routeDef
  } else {
    path = routeDef.path
  }

  // Replace path parameters
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      const paramPattern = new RegExp(`\\[${key}\\]`, 'g')
      path = path.replace(paramPattern, String(value))
    }
  }

  // Add query parameters
  if (query && Object.keys(query).length > 0) {
    const queryString = new URLSearchParams()
    
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value))
      }
    }

    const queryStr = queryString.toString()
    if (queryStr) {
      path += `?${queryStr}`
    }
  }

  // If baseUrl is just '/', return the path as is
  if (baseUrl === '/') {
    return path
  }

  // Build full URL
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  return `${cleanBaseUrl}${cleanPath}`
}


// /**
//  * Validates that all required path parameters are provided
//  * 
//  * @param path - The route path with parameter placeholders
//  * @param params - The provided parameters
//  * @returns Array of missing parameter names
//  */
// export function validateRouteParams(path: string, params?: RouteParams): string[] {
//   const paramMatches = path.match(/\[([^\]]+)\]/g)
//   if (!paramMatches) return []

//   const requiredParams = paramMatches.map(match => match.slice(1, -1)) // Remove [ and ]
//   const providedParams = params ? Object.keys(params) : []
  
//   return requiredParams.filter(param => !providedParams.includes(param))
// }

// /**
//  * Extracts parameter names from a route path
//  * 
//  * @param path - The route path with parameter placeholders
//  * @returns Array of parameter names
//  */
// export function extractRouteParams(path: string): string[] {
//   const paramMatches = path.match(/\[([^\]]+)\]/g)
//   if (!paramMatches) return []

//   return paramMatches.map(match => match.slice(1, -1)) // Remove [ and ]
// }
