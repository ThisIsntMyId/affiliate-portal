import React from 'react';
import { BarChart, LineChart, PieChart } from '@/components/charts';

// Sample data for charts - using month names for better label formatting
const monthlyData = [
  { label: 'January', sales: 100, profit: 30, revenue: 120 },
  { label: 'February', sales: 120, profit: 40, revenue: 140 },
  { label: 'March', sales: 90, profit: 25, revenue: 110 },
  { label: 'April', sales: 150, profit: 50, revenue: 180 },
  { label: 'May', sales: 180, profit: 60, revenue: 220 },
  { label: 'June', sales: 200, profit: 70, revenue: 250 },
];

const categoryData = [
  { label: 'Electronics', value: 35 },
  { label: 'Clothing', value: 25 },
  { label: 'Books', value: 20 },
  { label: 'Home', value: 15 },
  { label: 'Sports', value: 5 },
];

const quarterlyData = [
  { label: 'Q1 2024', target: 100, actual: 95 },
  { label: 'Q2 2024', target: 120, actual: 125 },
  { label: 'Q3 2024', target: 140, actual: 135 },
  { label: 'Q4 2024', target: 160, actual: 170 },
];

export default function ChartsDemoPage() {
  return (
         <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Chart Components Demo</h1>
        <p className="text-muted-foreground">
          Showcasing Bar, Line, and Pie charts with different configurations
        </p>
      </div>

             {/* Single Charts Section */}
       <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Single Charts</h2>
        
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           <BarChart
             title="Monthly Sales"
             description="January - June 2024"
             data={monthlyData.map(item => ({ label: item.label, sales: item.sales }))}
           />
           
           <LineChart
             title="Revenue Trend"
             description="January - June 2024"
             data={monthlyData.map(item => ({ label: item.label, revenue: item.revenue, sales: item.sales }))}
           />
         </div>

                 <div className="flex justify-center">
           <PieChart
             title="Category Distribution"
             description="January - June 2024"
             data={categoryData}
             width={400}
           />
         </div>
      </section>

             {/* Multiple Series Section */}
       <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Multiple Series Charts</h2>
        
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           <BarChart
             title="Sales vs Profit Comparison"
             description="January - June 2024"
             data={monthlyData.map(item => ({ label: item.label, sales: item.sales, profit: item.profit }))}
           />
           
           <LineChart
             title="Target vs Actual Performance"
             description="Quarterly Performance 2024"
             data={quarterlyData}
           />
         </div>
      </section>

             {/* Stacked Bar Chart */}
       <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Stacked Bar Chart</h2>
        
                 <BarChart
           title="Monthly Revenue Breakdown"
           description="January - June 2024"
           data={monthlyData}
           stacked={true}
         />
      </section>

             {/* Side by Side Charts */}
       <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Side by Side Charts</h2>
        
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
           <BarChart
             title="Q1 Performance"
             data={quarterlyData.slice(0, 1)}
             width={300}
           />
           
           <LineChart
             title="Q2 Performance"
             data={quarterlyData.slice(1, 2)}
             width={300}
           />
           
           <PieChart
             title="Q3 Performance"
             data={quarterlyData.slice(2, 3)}
             width={300}
           />
         </div>
      </section>

             {/* Full Width Chart */}
       <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Full Width Chart</h2>
        
                 <BarChart
           title="Annual Overview"
           description="January - June 2024"
           data={monthlyData}
           width="100%"
           className="w-full"
         />
      </section>

             {/* Custom Colors Example */}
       <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Color Schemes</h2>
        
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           <BarChart
             title="Custom Color Theme"
             description="January - June 2024"
             data={monthlyData}
           />
           
           <LineChart
             title="Gradient Theme"
             description="January - June 2024"
             data={monthlyData}
           />
         </div>
      </section>
    </div>
  );
}
