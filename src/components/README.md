# DynamicTable Component

A comprehensive, configuration-driven table component with search, filtering, sorting, and pagination capabilities.

## Features

- **Multiple Column Types**: text, image, tag, custom, actions
- **Search**: Debounced search with configurable delay
- **Filtering**: Modal-based filters with custom component support
- **Sorting**: Configurable sort options
- **Pagination**: Full, simple, or no pagination
- **Loading States**: Skeleton loading with configurable rows
- **Empty States**: Customizable empty state component
- **Header Actions**: Custom buttons in the top-right corner
- **Responsive Design**: Horizontal scroll for mobile devices
- **Nested Data Support**: Dot notation for accessing nested object properties

## Basic Usage

```tsx
import { DynamicTable, ColumnConfig } from '@/components/DynamicTable'

const columns: ColumnConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    field: 'name'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'tag',
    field: 'status',
    tagColors: {
      active: 'bg-green-500 text-green-900',
      inactive: 'bg-red-500 text-red-900'
    }
  }
]

const data = [
  { name: 'John Doe', status: 'active' },
  { name: 'Jane Smith', status: 'inactive' }
]

function MyComponent() {
  const handleAction = (action) => {
    switch (action.type) {
      case 'search':
        console.log('Search:', action.data)
        break
      case 'filter':
        console.log('Filter:', action.data)
        break
      case 'sort':
        console.log('Sort:', action.data)
        break
      case 'page':
        console.log('Page:', action.data)
        break
    }
  }

  return (
    <DynamicTable
      data={data}
      columns={columns}
      onAction={handleAction}
    />
  )
}
```

## Column Types

### Text Column
```tsx
{
  key: 'name',
  label: 'Name',
  type: 'text',
  field: 'name',
  align: 'left' // 'left' | 'center' | 'right'
}
```

### Image Column
```tsx
{
  key: 'avatar',
  label: 'Avatar',
  type: 'image',
  field: 'avatar',
  width: '80px',
  align: 'center'
}
```

### Tag Column
```tsx
{
  key: 'status',
  label: 'Status',
  type: 'tag',
  field: 'status',
  tagColors: {
    active: 'bg-green-500 text-green-900',
    inactive: 'bg-red-500 text-red-900',
    pending: 'bg-yellow-500 text-yellow-900'
  }
}
```

### Custom Column
```tsx
{
  key: 'custom',
  label: 'Custom',
  type: 'custom',
  render: (row, index) => (
    <div className="flex items-center gap-2">
      <span>{row.name}</span>
      <Badge>{row.role}</Badge>
    </div>
  )
}
```

### Actions Column
```tsx
{
  key: 'actions',
  label: 'Actions',
  type: 'actions',
  width: '200px',
  align: 'center',
  actions: [
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => console.log('Edit:', row),
      variant: 'default' // 'default' | 'outline' | 'destructive'
    },
    {
      label: 'Delete',
      icon: <Trash className="h-4 w-4" />,
      url: `/delete/${row.id}` // Alternative to onClick
    }
  ]
}
```

## Filters

### Basic Filters
```tsx
const filters = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  },
  {
    key: 'search',
    label: 'Search',
    type: 'input',
    placeholder: 'Search by name...'
  }
]
```

### Custom Filter Components
```tsx
const CustomRangeFilter = ({ value, onChange }) => (
  <div className="flex gap-2">
    <Input
      placeholder="Min"
      value={value?.min || ''}
      onChange={(e) => onChange({ ...value, min: e.target.value })}
    />
    <Input
      placeholder="Max"
      value={value?.max || ''}
      onChange={(e) => onChange({ ...value, max: e.target.value })}
    />
  </div>
)

const filters = [
  {
    key: 'price',
    label: 'Price Range',
    type: 'custom',
    component: CustomRangeFilter
  }
]
```

## Sorting

```tsx
const sortOptions = {
  name_asc: 'Name (A-Z)',
  name_desc: 'Name (Z-A)',
  date_newest: 'Date (Newest)',
  date_oldest: 'Date (Oldest)',
  custom_sort: 'Custom Sort'
}
```

## Pagination Types

- **`full`**: Shows page numbers, per-page selector, and page info
- **`simple`**: Shows only previous/next buttons
- **`none`**: No pagination controls

## Empty State

```tsx
const emptyState = {
  title: 'No data found',
  description: 'Try adjusting your search or filter criteria.',
  icon: <Search className="h-8 w-8" />,
  action: () => console.log('Add new item'),
  actionLabel: 'Add New Item'
}
```

## Header Actions

```tsx
const headerActions = [
  <Button key="add" className="flex items-center gap-2">
    <Plus className="h-4 w-4" />
    Add New
  </Button>,
  <Button key="export" variant="outline">
    Export
  </Button>
]
```

## Nested Data Support

The component supports accessing nested object properties using dot notation:

```tsx
const data = [
  {
    user: {
      profile: {
        name: 'John Doe',
        avatar: 'avatar.jpg'
      }
    }
  }
]

const columns = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    field: 'user.profile.name' // Dot notation
  },
  {
    key: 'avatar',
    label: 'Avatar',
    type: 'image',
    field: 'user.profile.avatar'
  }
]
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | - | Array of data objects |
| `columns` | `ColumnConfig[]` | - | Column configuration |
| `filters` | `FilterConfig[]` | - | Filter configuration |
| `sortOptions` | `Record<string, string>` | - | Sort options mapping |
| `title` | `string` | - | Table title |
| `description` | `string` | - | Table description |
| `headerActions` | `React.ReactNode[]` | - | Header action buttons |
| `paginationType` | `'full' \| 'simple' \| 'none'` | `'full'` | Pagination type |
| `loading` | `boolean` | `false` | Loading state |
| `emptyState` | `EmptyStateConfig` | - | Empty state configuration |
| `onAction` | `(action: TableAction) => void` | - | Action handler |

## Action Types

The `onAction` callback receives actions with the following structure:

```tsx
type TableAction = 
  | { type: 'filter'; data: Record<string, unknown> }
  | { type: 'sort'; data: string }
  | { type: 'page'; data: number }
  | { type: 'search'; data: string }
  | { type: 'perPage'; data: number }
```

## Exported Components

- `DynamicTable`: Main table component
- `NoDataComponent`: Empty state component (can be used independently)

## Styling

The component uses Tailwind CSS classes and follows the design system established in your project. All styling is customizable through the `className` prop and the existing design tokens.
