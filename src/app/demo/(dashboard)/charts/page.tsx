"use client";

import { BarChart, LineChart, PieChart } from '@/components/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data for charts
const salesData = [
  { month: 'Jan', sales: 4000, profit: 2400 },
  { month: 'Feb', sales: 3000, profit: 1398 },
  { month: 'Mar', sales: 2000, profit: 9800 },
  { month: 'Apr', sales: 2780, profit: 3908 },
  { month: 'May', sales: 1890, profit: 4800 },
  { month: 'Jun', sales: 2390, profit: 3800 },
  { month: 'Jul', sales: 3490, profit: 4300 },
];

const userGrowthData = [
  { month: 'Jan', users: 1000, newUsers: 200 },
  { month: 'Feb', users: 1200, newUsers: 300 },
  { month: 'Mar', users: 1500, newUsers: 400 },
  { month: 'Apr', users: 1800, newUsers: 350 },
  { month: 'May', users: 2100, newUsers: 500 },
  { month: 'Jun', users: 2500, newUsers: 600 },
  { month: 'Jul', users: 3000, newUsers: 700 },
];

const categoryData = [
  { name: 'Desktop', value: 45, color: '#8884d8' },
  { name: 'Mobile', value: 35, color: '#82ca9d' },
  { name: 'Tablet', value: 20, color: '#ffc658' },
];

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 25000 },
  { month: 'Jun', revenue: 28000 },
  { month: 'Jul', revenue: 32000 },
];

export default function ChartsDemoPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Charts Demo</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Interactive data visualization components with various chart types
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chart Types</CardTitle>
            <CardDescription>Available visualization options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Bar Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Line Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Pie Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Area Charts</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
            <CardDescription>Interactive capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Hover tooltips</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Responsive design</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Custom colors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Animation support</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Sources</CardTitle>
            <CardDescription>Flexible data integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Static data arrays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>API integration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>CSV/JSON import</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bar">Bar Charts</TabsTrigger>
          <TabsTrigger value="line">Line Charts</TabsTrigger>
          <TabsTrigger value="pie">Pie Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales vs Profit Comparison</CardTitle>
              <CardDescription>
                Monthly sales and profit data showing business performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={salesData}
                xKey="month"
                yKeys={['sales', 'profit']}
                height={400}
                colors={['#8884d8', '#82ca9d']}
                showLegend={true}
                showTooltip={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <CardDescription>
                Monthly revenue data showing consistent growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={revenueData}
                xKey="month"
                yKeys={['revenue']}
                height={300}
                colors={['#ffc658']}
                showTooltip={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trends</CardTitle>
              <CardDescription>
                Total users and new user registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={userGrowthData}
                xKey="month"
                yKeys={['users', 'newUsers']}
                height={400}
                colors={['#8884d8', '#82ca9d']}
                showLegend={true}
                showTooltip={true}
                showGrid={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>
                Monthly sales performance showing seasonal patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={salesData}
                xKey="month"
                yKeys={['sales']}
                height={300}
                colors={['#ff7300']}
                showTooltip={true}
                showGrid={true}
                strokeWidth={3}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Usage Distribution</CardTitle>
              <CardDescription>
                Breakdown of user traffic by device type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart
                data={categoryData}
                height={400}
                showLegend={true}
                showTooltip={true}
                innerRadius={60}
                outerRadius={120}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Product category performance</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: 'Electronics', value: 40, color: '#8884d8' },
                    { name: 'Clothing', value: 30, color: '#82ca9d' },
                    { name: 'Books', value: 20, color: '#ffc658' },
                    { name: 'Home', value: 10, color: '#ff7300' },
                  ]}
                  height={250}
                  showTooltip={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Share</CardTitle>
                <CardDescription>Competitive landscape overview</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: 'Our Company', value: 45, color: '#8884d8' },
                    { name: 'Competitor A', value: 25, color: '#82ca9d' },
                    { name: 'Competitor B', value: 20, color: '#ffc658' },
                    { name: 'Others', value: 10, color: '#ff7300' },
                  ]}
                  height={250}
                  showTooltip={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Chart Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Customization Options:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Custom colors and themes</li>
              <li>• Configurable legends and tooltips</li>
              <li>• Responsive sizing and layouts</li>
              <li>• Animation and transition effects</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Data Handling:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Multiple data series support</li>
              <li>• Real-time data updates</li>
              <li>• Data validation and error handling</li>
              <li>• Export capabilities (PNG, SVG)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}