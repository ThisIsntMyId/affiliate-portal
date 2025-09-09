import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Table, 
  BarChart3, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function DemoPage() {
  const demoSections = [
    {
      title: 'Forms',
      description: 'Dynamic form components with validation, file uploads, and various input types',
      icon: FileText,
      href: '/demo/forms',
      features: ['12+ input types', 'Auto-validation', 'File uploads', 'Error handling']
    },
    {
      title: 'Tables',
      description: 'Data tables with sorting, filtering, and responsive design',
      icon: Table,
      href: '/demo/table',
      features: ['Sortable columns', 'Responsive design', 'Custom styling', 'Data export']
    },
    {
      title: 'Charts',
      description: 'Interactive charts and data visualization components',
      icon: BarChart3,
      href: '/demo/charts',
      features: ['Bar charts', 'Line charts', 'Pie charts', 'Interactive data']
    },
    {
      title: 'Stat Cards',
      description: 'Statistics cards with trends, comparisons, and visual indicators',
      icon: TrendingUp,
      href: '/demo/stat-cards',
      features: ['Trend indicators', 'Comparisons', 'Visual metrics', 'Responsive cards']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Component Demo Portal</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Explore our collection of reusable UI components with live examples and documentation
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🎯 <strong>Interactive Demos:</strong> Each section contains working examples you can interact with and customize
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {demoSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {section.features.map((feature) => (
                      <span 
                        key={feature}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href={section.href}>
                      View Demo
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/30 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Forms</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Input fields with validation</li>
              <li>• File upload components</li>
              <li>• Multi-step forms</li>
              <li>• Error handling</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Tables</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Sortable columns</li>
              <li>• Responsive design</li>
              <li>• Custom cell rendering</li>
              <li>• Data pagination</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Charts</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Interactive visualizations</li>
              <li>• Multiple chart types</li>
              <li>• Real-time data</li>
              <li>• Custom styling</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Stat Cards</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Trend indicators</li>
              <li>• Comparison metrics</li>
              <li>• Visual progress bars</li>
              <li>• Responsive layouts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
