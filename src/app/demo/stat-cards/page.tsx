import { StatCard } from "@/components/StatCard"
import { DemoNavigation } from "@/components/demo-navigation"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  Activity,
  ShoppingCart,
  Award
} from "lucide-react"

export default function StatCardsDemo() {
  return (
    <>
      <DemoNavigation />
      <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">StatCard Component Demo</h1>
        <p className="text-muted-foreground">
          Showcasing various configurations and use cases of the StatCard component
        </p>
      </div>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Clicks"
            value="14,830"
          />
          <StatCard
            title="Conversions"
            value="621"
          />
          <StatCard
            title="Conversion Rate"
            value="4.19%"
          />
          <StatCard
            title="Commissions (Pending)"
            value="$3,105.50"
          />
        </div>
      </section>

      {/* With Icons - Top Right (Default) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Icons - Top Right (Default)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Clicks"
            value="14,830"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Active Users"
            value="2,847"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Revenue"
            value="$45,230"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Conversion Rate"
            value="4.19%"
            icon={<Target className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* With Icons - Top Left */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Icons - Top Left</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Clicks"
            value="14,830"
            icon={<TrendingUp className="h-5 w-5" />}
            iconPosition="top-left"
          />
          <StatCard
            title="Active Users"
            value="2,847"
            icon={<Users className="h-5 w-5" />}
            iconPosition="top-left"
          />
          <StatCard
            title="Revenue"
            value="$45,230"
            icon={<DollarSign className="h-5 w-5" />}
            iconPosition="top-left"
          />
          <StatCard
            title="Conversion Rate"
            value="4.19%"
            icon={<Target className="h-5 w-5" />}
            iconPosition="top-left"
          />
        </div>
      </section>

      {/* With Subtitles */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Subtitles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Clicks"
            subtitle="Last 30 days"
            value="14,830"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Active Users"
            subtitle="Currently online"
            value="2,847"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Revenue"
            subtitle="This month"
            value="$45,230"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Conversion Rate"
            subtitle="Overall performance"
            value="4.19%"
            icon={<Target className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Clickable Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Clickable Cards (with Links)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Analytics Dashboard"
            subtitle="View detailed metrics"
            value="View Report"
            icon={<BarChart3 className="h-5 w-5" />}
            link="/demo/analytics"
          />
          <StatCard
            title="User Activity"
            subtitle="Monitor user behavior"
            value="View Details"
            icon={<Activity className="h-5 w-5" />}
            link="/demo/activity"
          />
          <StatCard
            title="Orders"
            subtitle="Track order status"
            value="View Orders"
            icon={<ShoppingCart className="h-5 w-5" />}
            link="/demo/orders"
          />
          <StatCard
            title="Achievements"
            subtitle="View your rewards"
            value="View Rewards"
            icon={<Award className="h-5 w-5" />}
            link="/demo/rewards"
          />
        </div>
      </section>

      {/* Custom Styling */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Styling</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Premium Feature"
            subtitle="Exclusive access"
            value="VIP"
            icon={<Award className="h-5 w-5" />}
            className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
          />
          <StatCard
            title="Success Metric"
            subtitle="Target achieved"
            value="100%"
            icon={<Target className="h-5 w-5" />}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          />
          <StatCard
            title="Warning Alert"
            subtitle="Attention required"
            value="3 Issues"
            icon={<Activity className="h-5 w-5" />}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
          />
          <StatCard
            title="Critical Error"
            subtitle="Immediate action needed"
            value="5 Errors"
            icon={<BarChart3 className="h-5 w-5" />}
            className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
          />
        </div>
      </section>

      {/* Responsive Behavior */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive Behavior</h2>
        <p className="text-muted-foreground">
          Resize your browser window to see how the cards adapt to different screen sizes.
          On mobile, they stack vertically; on larger screens, they display in a grid.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <StatCard
            title="Metric 1"
            value="100"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Metric 2"
            value="200"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Metric 3"
            value="300"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Metric 4"
            value="400"
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            title="Metric 5"
            value="500"
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <StatCard
            title="Metric 6"
            value="600"
            icon={<Activity className="h-4 w-4" />}
          />
        </div>
      </section>
    </div>
    </>
  )
}
