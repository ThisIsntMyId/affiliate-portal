import { createRouteBuilder } from "@/lib/routes";

const routes = {
  // Dashboard routes
  'demo.dashboard': '/demo',
  
  // Form routes
  'demo.forms': '/demo/forms',
  'demo.forms.create': '/demo/forms/create',
  'demo.forms.edit': '/demo/forms/[id]',
  
  // Table routes
  'demo.table': '/demo/table',
  'demo.table.advanced': '/demo/table/advanced',
  
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

export const getRoute = createRouteBuilder(routes)