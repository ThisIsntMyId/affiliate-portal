"use client";

import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export default function StatCardsDemoPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Stat Cards Demo</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Statistics cards with trends, comparisons, and visual indicators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Card Types</CardTitle>
            <CardDescription>Different stat card variations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Basic metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Trend indicators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Comparison values</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Progress indicators</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visual Elements</CardTitle>
            <CardDescription>Design components included</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Icons and illustrations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Color-coded trends</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Progress bars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Hover effects</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Use Cases</CardTitle>
            <CardDescription>Common applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Dashboard overviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>KPI monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Performance metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Analytics summaries</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Basic Stat Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Basic Stat Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            icon={<DollarSign className="w-5 h-5" />}
            description="+20.1% from last month"
            trend="up"
            trendValue="20.1%"
          />
          <StatCard
            title="Active Users"
            value="2,350"
            icon={<Users className="w-5 h-5" />}
            description="+180.1% from last month"
            trend="up"
            trendValue="180.1%"
          />
          <StatCard
            title="Sales"
            value="12,234"
            icon={<ShoppingCart className="w-5 h-5" />}
            description="+19% from last month"
            trend="up"
            trendValue="19%"
          />
          <StatCard
            title="Active Now"
            value="573"
            icon={<Activity className="w-5 h-5" />}
            description="+201 since last hour"
            trend="up"
            trendValue="201"
          />
        </div>
      </div>

      {/* Cards with Different Trends */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Trend Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            icon={<TrendingUp className="w-5 h-5" />}
            description="+0.4% from last month"
            trend="up"
            trendValue="0.4%"
            color="green"
          />
          <StatCard
            title="Bounce Rate"
            value="45.1%"
            icon={<TrendingDown className="w-5 h-5" />}
            description="-4.3% from last month"
            trend="down"
            trendValue="4.3%"
            color="red"
          />
          <StatCard
            title="Page Views"
            value="89,400"
            icon={<Activity className="w-5 h-5" />}
            description="No change from last month"
            trend="neutral"
            trendValue="0%"
            color="gray"
          />
        </div>
      </div>

      {/* Cards with Progress Indicators */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Progress Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Monthly Goal"
            value="$24,000"
            icon={<DollarSign className="w-5 h-5" />}
            description="75% of target achieved"
            progress={75}
            progressColor="blue"
          />
          <StatCard
            title="User Engagement"
            value="68%"
            icon={<Users className="w-5 h-5" />}
            description="Above average engagement"
            progress={68}
            progressColor="green"
          />
        </div>
      </div>

      {/* Custom Styled Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Custom Styling</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Premium Users"
            value="1,234"
            icon={<Users className="w-5 h-5" />}
            description="+12% from last month"
            trend="up"
            trendValue="12%"
            className="border-l-4 border-l-blue-500"
          />
          <StatCard
            title="Support Tickets"
            value="89"
            icon={<Activity className="w-5 h-5" />}
            description="-5% from last month"
            trend="down"
            trendValue="5%"
            className="border-l-4 border-l-green-500"
          />
          <StatCard
            title="Server Uptime"
            value="99.9%"
            icon={<TrendingUp className="w-5 h-5" />}
            description="Excellent performance"
            trend="up"
            trendValue="0.1%"
            className="border-l-4 border-l-purple-500"
          />
        </div>
      </div>

      {/* Large Format Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Large Format Cards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatCard
            title="Annual Revenue"
            value="$2,400,000"
            icon={<DollarSign className="w-5 h-5" />}
            description="+15.3% from last year"
            trend="up"
            trendValue="15.3%"
            size="large"
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
          />
          <StatCard
            title="Customer Satisfaction"
            value="4.8/5"
            icon={<Users className="w-5 h-5" />}
            description="Based on 1,200 reviews"
            trend="up"
            trendValue="0.2"
            size="large"
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
          />
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Stat Card Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Available Props:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• title, value, description</li>
              <li>• icon (Lucide React icons)</li>
              <li>• trend (up, down, neutral)</li>
              <li>• trendValue and color</li>
              <li>• progress percentage</li>
              <li>• size (small, medium, large)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Styling Options:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Custom className support</li>
              <li>• Gradient backgrounds</li>
              <li>• Border variations</li>
              <li>• Color themes</li>
              <li>• Responsive layouts</li>
              <li>• Hover animations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}