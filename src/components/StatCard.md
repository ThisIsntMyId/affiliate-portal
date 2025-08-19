# StatCard Component

A modern, minimalist card component for displaying key metrics and statistics with optional icons, subtitles, and clickable functionality.

## Features

- **Clean Design**: Modern, minimal styling that matches your existing design system
- **Flexible Layout**: Configurable icon positioning (top-left or top-right)
- **Optional Elements**: Support for subtitles, icons, and clickable links
- **Responsive**: Adapts to different screen sizes with responsive grid layouts
- **Accessible**: Proper semantic HTML and ARIA attributes when used as links

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | The main title/label for the stat |
| `subtitle` | `string` | ❌ | - | Optional subtitle for additional context |
| `value` | `string \| number` | ✅ | - | The main metric value to display |
| `icon` | `ReactNode` | ❌ | - | Optional icon component to display |
| `iconPosition` | `"top-left" \| "top-right"` | ❌ | `"top-right"` | Position of the icon relative to the title |
| `link` | `string` | ❌ | - | Optional URL to make the entire card clickable |
| `className` | `string` | ❌ | - | Additional CSS classes for custom styling |

## Usage Examples

### Basic Usage

```tsx
import { StatCard } from "@/components/StatCard"

<StatCard
  title="Total Clicks"
  value="14,830"
/>
```

### With Icon (Default Top-Right Position)

```tsx
import { StatCard } from "@/components/StatCard"
import { TrendingUp } from "lucide-react"

<StatCard
  title="Total Clicks"
  value="14,830"
  icon={<TrendingUp className="h-5 w-5" />}
/>
```

### With Icon at Top-Left

```tsx
<StatCard
  title="Total Clicks"
  value="14,830"
  icon={<TrendingUp className="h-5 w-5" />}
  iconPosition="top-left"
/>
```

### With Subtitle

```tsx
<StatCard
  title="Total Clicks"
  subtitle="Last 30 days"
  value="14,830"
  icon={<TrendingUp className="h-5 w-5" />}
/>
```

### Clickable Card

```tsx
<StatCard
  title="Analytics Dashboard"
  subtitle="View detailed metrics"
  value="View Report"
  icon={<BarChart3 className="h-5 w-5" />}
  link="/analytics"
/>
```

### Custom Styling

```tsx
<StatCard
  title="Premium Feature"
  subtitle="Exclusive access"
  value="VIP"
  icon={<Award className="h-5 w-5" />}
  className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
/>
```

## Grid Layout Examples

### Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Metric 1" value="100" />
  <StatCard title="Metric 2" value="200" />
  <StatCard title="Metric 3" value="300" />
  <StatCard title="Metric 4" value="400" />
</div>
```

### Different Grid Sizes

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
  {/* Cards will adapt to screen size */}
</div>
```

## Design System Integration

The StatCard component is built on top of your existing Card components (`Card`, `CardHeader`, `CardContent`) and follows your design system patterns:

- Uses your existing color tokens (`text-muted-foreground`, `bg-card`, etc.)
- Follows your spacing and typography scale
- Integrates with your existing utility classes and `cn()` function
- Maintains consistency with other UI components

## Accessibility

When a `link` prop is provided:
- The entire card becomes a clickable link (`<a>` element)
- Proper `target="_blank"` and `rel="noopener noreferrer"` attributes are added
- The card maintains its visual appearance while being semantically correct

## Browser Support

- Modern browsers with CSS Grid support
- Responsive design that gracefully degrades on older devices
- Touch-friendly for mobile devices
