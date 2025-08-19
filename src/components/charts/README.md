# Chart Components

A collection of simple, configurable chart components built with Recharts and shadcn/ui.

## Components

### BaseChart
Base wrapper component that provides common functionality:
- Title display
- Loading states with skeleton
- Empty data handling
- Legend generation
- Color management

### BarChart (CustomBarChart)
Bar chart component supporting:
- Single/multiple series
- Stacked bars option
- Custom colors
- Responsive sizing

### LineChart (CustomLineChart)
Line chart component supporting:
- Single/multiple lines
- Grid toggle
- Custom colors
- Responsive sizing

### PieChart (CustomPieChart)
Pie chart component supporting:
- Single series data
- Custom colors
- Percentage labels
- Responsive sizing

## Usage

### Basic Example
```tsx
import { BarChart, LineChart, PieChart } from '@/components/charts';

const data = [
  { label: 'Jan', sales: 100, profit: 30 },
  { label: 'Feb', sales: 120, profit: 40 },
];

<BarChart 
  title="Monthly Performance"
  data={data}
  colors={{ sales: '#3b82f6', profit: '#10b981' }}
/>
```

### Data Format
All charts expect data in this format:
```tsx
interface ChartData {
  label: string;        // X-axis label or category name
  [key: string]: string | number;  // Series data (e.g., sales: 100, profit: 30)
}
```

### Props

#### Common Props (all charts)
- `title?: string` - Chart title
- `data: ChartData[]` - Chart data array
- `colors?: Record<string, string>` - Series-specific colors
- `width?: number | string` - Chart width (default: 600)
- `height?: number` - Chart height (default: 400)
- `loading?: boolean` - Show loading skeleton

#### BarChart Specific
- `stacked?: boolean` - Enable stacked bars (default: false)

#### LineChart Specific
- `showGrid?: boolean` - Show grid lines (default: true)

#### PieChart Specific
- `size?: number` - Pie chart size (default: 200)

### Color Configuration
```tsx
// Object mapping series to colors
colors={{
  sales: '#3b82f6',
  profit: '#10b981',
  revenue: '#8b5cf6'
}}

// If no colors provided, uses shadcn theme colors
```

### Layout Examples

#### Side by Side
```tsx
<div className="grid grid-cols-3 gap-4">
  <BarChart title="Sales" data={data} width={300} height={250} />
  <LineChart title="Revenue" data={data} width={300} height={250} />
  <PieChart title="Categories" data={data} width={300} height={250} />
</div>
```

#### Full Width
```tsx
<BarChart 
  title="Annual Overview" 
  data={data} 
  width="100%" 
  height={400} 
/>
```

## Features

- **Responsive**: Charts adapt to container size
- **Theme Integration**: Uses shadcn CSS variables
- **Loading States**: Skeleton loading indicators
- **Error Handling**: Graceful empty data states
- **Accessibility**: ARIA labels and keyboard navigation
- **Customizable**: Colors, dimensions, and styling
- **TypeScript**: Full type safety and IntelliSense

## Dependencies

- `recharts` - Chart rendering library
- `@/components/ui/*` - shadcn/ui components
- Tailwind CSS for styling

## Note

The components are internally named with "Custom" prefix (e.g., `CustomBarChart`) to avoid naming conflicts with the `recharts` library components, but they are exported as `BarChart`, `LineChart`, and `PieChart` for clean usage.
