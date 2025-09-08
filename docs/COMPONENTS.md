# Components

This document outlines the reusable UI components available in the Affiliate Portal application.

## Overview

The component library is built with:
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Radix UI** for accessible primitives
- **Custom components** for business-specific functionality

## UI Components

### Basic Components

#### Button
```typescript
import { Button } from '@/components/ui/button';

// Usage
<Button variant="default" size="md">
  Click me
</Button>

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: sm, md, lg, icon
```

#### Input
```typescript
import { Input } from '@/components/ui/input';

// Usage
<Input 
  type="text" 
  placeholder="Enter text"
  value={value}
  onChange={handleChange}
/>
```

#### Card
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

#### Modal/Dialog
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Usage
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    Modal content
  </DialogContent>
</Dialog>
```

### Form Components

#### DynamicForm
```typescript
import { DynamicForm, FormFieldConfig } from '@/components/DynamicForm';

// Usage
<DynamicForm
  config={formConfig}
  onSubmit={handleSubmit}
  defaultValues={defaultValues}
  schema={validationSchema}
  submitText="Submit"
  loadingText="Submitting..."
  submitButtonAlign="full"
  title="Form Title"
  description="Form description"
/>
```

**Field Types:**
- `input`: Text input
- `number`: Number input with prefix/suffix support
- `email`: Email input with validation
- `textarea`: Multi-line text input
- `select`: Dropdown selection
- `multiselect`: Multiple selection
- `checkbox`: Single checkbox
- `checkboxgroup`: Multiple checkboxes
- `switch`: Toggle switch
- `date`: Date picker
- `radio`: Radio button group
- `file`: File upload
- `image`: Image upload with preview
- `combobox`: Searchable dropdown

**Props:**
- `config`: Array of FormFieldConfig objects
- `onSubmit`: Submit handler function
- `defaultValues`: Default form values
- `schema`: Zod validation schema (auto-generated if not provided)
- `submitText`: Submit button text
- `loadingText`: Loading state text
- `submitButtonAlign`: 'full' | 'left' | 'right'
- `title`: Form title
- `description`: Form description

#### FormField
```typescript
import { FormField } from '@/components/ui/form';

// Usage
<FormField
  control={control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Layout Components

#### Sidebar
```typescript
import { Sidebar } from '@/components/Sidebar';

// Usage
<Sidebar
  items={navigationItems}
  user={currentUser}
  onLogout={handleLogout}
/>
```

#### BaseLayout
```typescript
import { BaseLayout } from '@/components/BaseLayout';

// Usage in layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <BaseLayout>
          {children}
        </BaseLayout>
      </body>
    </html>
  )
}
```

**Note**: In Next.js App Router, the layout.tsx file handles the overall page structure. Individual pages (page.tsx) are free to use whatever components they need without wrapping them in BaseLayout, as the layout is already applied at the layout level.

### Data Display Components

#### DynamicTable
```typescript
import { DynamicTable, TableAction } from '@/components/DynamicTable';

// Usage
<DynamicTable
  data={tableData}
  columns={columnDefinitions}
  filters={filterConfig}
  sortOptions={sortOptions}
  title="Table Title"
  description="Table description"
  searchable={true}
  filterable={true}
  sortable={true}
  paginationEnabled={true}
  paginationType="full"
  loading={false}
  onAction={handleTableAction}
/>
```

**Column Types:**
- `text`: Simple text display
- `image`: Image with thumbnail
- `tag`: Badge/tag with custom colors
- `custom`: Custom React component rendering
- `actions`: Action buttons (Edit, Delete, etc.)

**Props:**
- `data`: Array of data objects
- `columns`: Column configuration array with type definitions
- `filters`: Filter configuration array
- `sortOptions`: Sort options object
- `searchable`: Enable/disable global search
- `filterable`: Enable/disable filtering
- `sortable`: Enable/disable sorting
- `paginationEnabled`: Enable/disable pagination
- `paginationType`: 'full' | 'simple' | 'none'
- `loading`: Loading state
- `onAction`: Action handler function

#### StatCard
```typescript
import { StatCard } from '@/components/StatCard';

// Usage
<StatCard
  title="Total Revenue"
  value="$12,345"
  change="+12%"
  changeType="positive"
  icon={TrendingUp}
/>
```

**Props:**
- `title`: Card title
- `value`: Main value to display
- `change`: Change percentage or amount
- `changeType`: "positive", "negative", or "neutral"
- `icon`: Icon component

### Chart Components

#### BarChart
```typescript
import { BarChart } from '@/components/charts/BarChart';

// Usage
<BarChart
  data={chartData}
  xKey="month"
  yKey="revenue"
  title="Monthly Revenue"
  height={300}
/>
```

#### LineChart
```typescript
import { LineChart } from '@/components/charts/LineChart';

// Usage
<LineChart
  data={chartData}
  xKey="date"
  yKey="value"
  title="Performance Over Time"
  height={300}
/>
```

#### PieChart
```typescript
import { PieChart } from '@/components/charts/PieChart';

// Usage
<PieChart
  data={chartData}
  dataKey="value"
  nameKey="name"
  title="Distribution"
  height={300}
/>
```

## Styling Guidelines

### Tailwind CSS Classes

#### Spacing
- Use consistent spacing scale: `p-4`, `m-2`, `gap-4`
- Prefer `gap-*` for flex/grid layouts
- Use `space-y-*` for vertical spacing between elements

#### Colors
- Use semantic color classes: `text-primary`, `bg-secondary`
- Use state colors: `text-success`, `text-error`, `text-warning`
- Use neutral colors: `text-gray-600`, `bg-gray-100`

#### Typography
- Use consistent text sizes: `text-sm`, `text-base`, `text-lg`
- Use font weights: `font-normal`, `font-medium`, `font-semibold`
- Use line heights: `leading-tight`, `leading-normal`, `leading-relaxed`

### Component Styling

#### Consistent Patterns
```typescript
// Button variants
const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline"
};
```

#### Responsive Design
```typescript
// Use responsive prefixes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

## Usage Examples

## Business Components

### ActionButton
A button component that handles asynchronous actions with loading states and optional confirmation dialogs.

```typescript
import { ActionButton } from '@/components/ActionButton';
import { Trash2 } from 'lucide-react';

// Basic usage
<ActionButton
  onClick={async () => {
    await saveData();
  }}
  loadingText="Saving..."
>
  Save Changes
</ActionButton>

// With confirmation dialog
<ActionButton
  onClick={async () => {
    await deleteUser();
  }}
  confirmation={{
    enabled: true,
    title: "Delete User",
    description: "This action cannot be undone. Are you sure you want to delete this user?",
    confirmText: "Delete",
    cancelText: "Cancel",
    icon: <Trash2 className="h-6 w-6 text-red-500" />
  }}
  variant="destructive"
>
  Delete User
</ActionButton>
```

**Props:**
- `onClick`: Async function to execute
- `loadingText`: Text to show during loading (default: "Processing...")
- `confirmation`: Optional confirmation dialog configuration
- All standard Button props are supported

### AlertBanner
A banner component for displaying alerts with optional call-to-action buttons.

```typescript
import { AlertBanner } from '@/components/AlertBanner';

// Info alert with link
<AlertBanner
  title="New Feature Available"
  description="Check out our latest dashboard improvements."
  buttonTitle="Learn More"
  buttonUrl="/features"
  style="info"
/>

// Warning alert with action
<AlertBanner
  title="Payment Required"
  description="Your subscription will expire in 3 days."
  buttonTitle="Renew Now"
  buttonAction={() => handleRenewal()}
  style="warning"
  onClose={() => setShowAlert(false)}
/>

// Success alert
<AlertBanner
  title="Payment Successful"
  description="Your payment has been processed successfully."
  style="success"
/>
```

**Props:**
- `title`: Alert title (required)
- `description`: Alert description (required)
- `style`: Alert style - "info" | "warning" | "danger" | "success"
- `buttonTitle`: Text for CTA button
- `buttonUrl`: Link URL for CTA button
- `buttonAction`: Function for CTA button action
- `icon`: Custom icon (optional)
- `onClose`: Function to handle alert dismissal

### ContentCard
A simplified card wrapper that reduces boilerplate for common card patterns.

```typescript
import { ContentCard } from '@/components/ContentCard';

// Simple card with title and content
<ContentCard
  title="User Profile"
  description="Manage your account settings"
  content={
    <div className="space-y-4">
      <p>Name: John Doe</p>
      <p>Email: john@example.com</p>
    </div>
  }
/>

// Card with footer actions
<ContentCard
  title="Payment History"
  content={<PaymentTable data={payments} />}
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="outline">Export</Button>
      <Button>View All</Button>
    </div>
  }
/>
```

**Props:**
- `title`: Card title (optional)
- `description`: Card description (optional)
- `content`: Main card content (optional)
- `footer`: Card footer content (optional)
- `className`: Additional CSS classes

### StatusIndicator
A badge component for displaying status information with consistent styling.

```typescript
import { StatusIndicator } from '@/components/StatusIndicator';

// Basic status indicators
<StatusIndicator status="success">Active</StatusIndicator>
<StatusIndicator status="warning">Pending</StatusIndicator>
<StatusIndicator status="error">Failed</StatusIndicator>
<StatusIndicator status="info">Processing</StatusIndicator>
<StatusIndicator status="neutral">Inactive</StatusIndicator>

// With custom label
<StatusIndicator status="success" label="Approved" />

// Without icon
<StatusIndicator status="success" showIcon={false}>
  Completed
</StatusIndicator>
```

**Props:**
- `status`: Status type - "success" | "warning" | "error" | "info" | "neutral"
- `label`: Custom label text
- `icon`: Custom icon (optional)
- `showIcon`: Whether to show icon (default: true)
- All standard Badge props are supported

## Usage Examples

### Creating a Dashboard Page
```typescript
import { StatCard } from '@/components/StatCard';
import { BarChart } from '@/components/charts/BarChart';
import { ContentCard } from '@/components/ContentCard';
import { StatusIndicator } from '@/components/StatusIndicator';
import { AlertBanner } from '@/components/AlertBanner';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Alert Banner */}
      <AlertBanner
        title="System Maintenance"
        description="Scheduled maintenance will occur tonight from 2-4 AM EST."
        style="warning"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value="$12,345"
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="Active Affiliates"
          value="156"
          change="+5%"
          changeType="positive"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          change="-0.5%"
          changeType="negative"
        />
      </div>
      
      <ContentCard
        title="Recent Transactions"
        description="Latest payment activity"
        content={<TransactionTable />}
        footer={
          <div className="flex justify-between items-center">
            <StatusIndicator status="success">All systems operational</StatusIndicator>
            <Button variant="outline">View All</Button>
          </div>
        }
      />
      
      <BarChart
        data={revenueData}
        xKey="month"
        yKey="revenue"
        title="Monthly Revenue"
        height={400}
      />
    </div>
  );
}
```

### Creating a Comprehensive Form
```typescript
import { DynamicForm, FormFieldConfig, DynamicFormSubmissionError } from '@/components/DynamicForm';

export default function CreateBrandForm() {
  const formConfig: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Brand Name',
      type: 'input',
      placeholder: 'Enter brand name',
      required: true,
      description: 'The official name of your brand'
    },
    {
      name: 'email',
      label: 'Contact Email',
      type: 'email',
      placeholder: 'contact@brand.com',
      required: true,
      description: 'Primary contact email address'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'input',
      placeholder: 'https://brand.com',
      required: false,
      description: 'Brand website URL'
    },
    {
      name: 'revenue',
      label: 'Monthly Revenue',
      type: 'number',
      prefix: '$',
      placeholder: '0.00',
      required: true,
      description: 'Expected monthly revenue in USD'
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select category',
      required: true,
      description: 'Primary business category',
      options: [
        { label: 'Technology', value: 'tech' },
        { label: 'Fashion', value: 'fashion' },
        { label: 'Health & Beauty', value: 'health' },
        { label: 'Food & Beverage', value: 'food' },
        { label: 'Home & Garden', value: 'home' }
      ]
    },
    {
      name: 'targetAudience',
      label: 'Target Audience',
      type: 'multiselect',
      placeholder: 'Select audiences',
      required: true,
      description: 'Who is your target audience?',
      options: [
        { label: 'Millennials', value: 'millennials' },
        { label: 'Gen Z', value: 'genz' },
        { label: 'Gen X', value: 'genx' },
        { label: 'Baby Boomers', value: 'boomers' },
        { label: 'Professionals', value: 'professionals' },
        { label: 'Students', value: 'students' }
      ]
    },
    {
      name: 'description',
      label: 'Brand Description',
      type: 'textarea',
      placeholder: 'Describe your brand...',
      required: true,
      description: 'A brief description of your brand and products'
    },
    {
      name: 'isActive',
      label: 'Active Brand',
      type: 'switch',
      required: false,
      description: 'Is this brand currently active and accepting affiliates?'
    },
    {
      name: 'launchDate',
      label: 'Launch Date',
      type: 'date',
      placeholder: 'Pick launch date',
      required: true,
      description: 'When did/will your brand launch?'
    },
    {
      name: 'logo',
      label: 'Brand Logo',
      type: 'image',
      required: false,
      description: 'Upload your brand logo (JPG, PNG, GIF up to 5MB)',
      fileConfig: {
        multiple: false,
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024 // 5MB
      }
    }
  ];

  const defaultValues = {
    name: 'My Brand',
    email: 'contact@mybrand.com',
    revenue: 10000,
    category: 'tech',
    targetAudience: ['millennials', 'professionals'],
    isActive: true,
    launchDate: new Date()
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('Form submitted:', values);
    
    // Example validation
    if (values.name === 'admin') {
      throw new DynamicFormSubmissionError('Brand name "admin" is reserved', 'name');
    }
    
    if (values.revenue && typeof values.revenue === 'number' && values.revenue < 1000) {
      throw new DynamicFormSubmissionError('Minimum revenue must be $1,000', 'revenue');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Brand created successfully!');
  };

  return (
    <DynamicForm
      config={formConfig}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      submitText="Create Brand"
      loadingText="Creating Brand..."
      submitButtonAlign="full"
      title="Create New Brand"
      description="Fill out the form below to create a new brand in the affiliate system."
    />
  );
}
```

### Creating a Data Table with Advanced Features
```typescript
import { DynamicTable, TableAction } from '@/components/DynamicTable';
import { Edit, Trash2 } from 'lucide-react';

export default function BrandsTable() {
  const tableData = [
    {
      id: 'brand_1',
      name: 'TechCorp',
      email: 'contact@techcorp.com',
      status: 'active',
      revenue: 125000,
      affiliates: 25,
      createdAt: '2024-01-15'
    },
    {
      id: 'brand_2',
      name: 'FashionStore',
      email: 'hello@fashionstore.com',
      status: 'pending',
      revenue: 85000,
      affiliates: 12,
      createdAt: '2024-01-20'
    }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Brand Name',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {String(row.name).split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <span className="font-medium">{String(row.name)}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text' as const,
      field: 'email'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'tag' as const,
      field: 'status',
      tagColors: {
        'active': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'inactive': 'bg-gray-100 text-gray-800'
      } as Record<string, string>
    },
    {
      key: 'revenue',
      label: 'Revenue',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono">
          ${Number(row.revenue).toLocaleString()}
        </span>
      )
    },
    {
      key: 'affiliates',
      label: 'Affiliates',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => (
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {String(row.affiliates)}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => 
        new Date(String(row.createdAt)).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'actions' as const,
      width: '200px',
      align: 'center' as const,
      actions: [
        {
          label: 'Edit',
          icon: <Edit className="h-4 w-4" />,
          onClick: (row: Record<string, unknown>) => {
            console.log('Edit brand:', row);
          },
          variant: 'outline' as const
        },
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: (row: Record<string, unknown>) => {
            if (confirm(`Delete ${row.name}?`)) {
              console.log('Delete brand:', row);
            }
          },
          variant: 'destructive' as const
        }
      ]
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
    {
      key: 'revenue',
      label: 'Revenue Range',
      type: 'select' as const,
      options: [
        { label: 'All Revenue', value: 'all' },
        { label: 'Under $100k', value: 'under-100k' },
        { label: '$100k - $200k', value: '100k-200k' },
        { label: 'Over $200k', value: 'over-200k' }
      ]
    }
  ];

  const sortOptions = {
    'name-asc': 'Name (A-Z)',
    'name-desc': 'Name (Z-A)',
    'revenue-asc': 'Revenue (Low to High)',
    'revenue-desc': 'Revenue (High to Low)',
    'createdAt-asc': 'Created (Oldest)',
    'createdAt-desc': 'Created (Newest)'
  };

  const handleTableAction = (action: TableAction) => {
    console.log('Table action:', action);
    // Handle search, filter, sort, pagination actions
  };

  return (
    <DynamicTable
      data={tableData}
      columns={columns}
      filters={filters}
      sortOptions={sortOptions}
      title="Brand Management"
      description="Manage your brand portfolio"
      searchable={true}
      filterable={true}
      sortable={true}
      paginationEnabled={true}
      paginationType="full"
      onAction={handleTableAction}
    />
  );
}
```

## Best Practices

### 1. Component Composition
- Use composition over inheritance
- Break down complex components into smaller, reusable pieces
- Use children props for flexible layouts

### 2. Props Design
- Use TypeScript interfaces for prop types
- Provide sensible defaults
- Use optional props for non-essential features

### 3. Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

### 4. Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid unnecessary re-renders
- Use lazy loading for large components

### 5. Testing
- Write unit tests for component logic
- Test user interactions
- Test accessibility features
- Use testing-library for user-centric tests

## Contributing

When adding new components:

1. Follow the established patterns
2. Add TypeScript interfaces
3. Include usage examples
4. Update this documentation
5. Add tests for the component
6. Ensure accessibility compliance

For more information, see the [Contributing Guidelines](../CONTRIBUTING.md).
