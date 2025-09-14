import { createRouteBuilder } from "@/lib/routes"

const routes = {
  // Dashboard routes
  'affiliate.dashboard': '/affiliate',
  
  // Link routes
  'affiliate.links': '/affiliate/links',
  'affiliate.links.create': '/affiliate/links/create',
  'affiliate.links.edit': '/affiliate/links/[id]/edit',
  'affiliate.links.show': '/affiliate/links/[id]',
  
  // Reports routes
  'affiliate.reports': '/affiliate/reports',
  'affiliate.reports.show': '/affiliate/reports/[id]',
  
  // Payouts routes
  'affiliate.payouts': '/affiliate/payouts',
  'affiliate.payouts.show': '/affiliate/payouts/[id]',
} as const

export const getRoute = createRouteBuilder(routes)