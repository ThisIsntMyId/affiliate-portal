import { createRouteBuilder } from "@/lib/routes";

const routes = {
  // Auth Routes
  'admin.login': '/admin/login',

  // Dashboard Routes
  'admin.dashboard': '/admin',

  // Brands Routes
  'admin.brands': '/admin/brands',
  'admin.brands.create': '/admin/brands/create',
  'admin.brands.view': '/admin/brands/[id]',
} as const;

export const getRoute = createRouteBuilder(routes)