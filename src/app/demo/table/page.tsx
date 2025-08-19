"use client"

import React, { useState } from 'react'
import { DynamicTable, ColumnConfig, FilterConfig, EmptyStateConfig, TableAction } from '@/components/DynamicTable'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, Eye } from 'lucide-react'

// Sample data
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-15',
    orders: 25
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-10',
    orders: 12
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'active',
    role: 'Moderator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-12',
    orders: 8
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    status: 'pending',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-08',
    orders: 3
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    status: 'active',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-14',
    orders: 18
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana@example.com',
    status: 'active',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-13',
    orders: 42
  },
  {
    id: 7,
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    status: 'inactive',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-05',
    orders: 7
  },
  {
    id: 8,
    name: 'Fiona Gallagher',
    email: 'fiona@example.com',
    status: 'active',
    role: 'Moderator',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-11',
    orders: 31
  },
  {
    id: 9,
    name: 'George Washington',
    email: 'george@example.com',
    status: 'pending',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-07',
    orders: 15
  },
  {
    id: 10,
    name: 'Hannah Montana',
    email: 'hannah@example.com',
    status: 'active',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-16',
    orders: 28
  },
  {
    id: 11,
    name: 'Ian McKellen',
    email: 'ian@example.com',
    status: 'active',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-14',
    orders: 55
  },
  {
    id: 12,
    name: 'Julia Roberts',
    email: 'julia@example.com',
    status: 'inactive',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-03',
    orders: 9
  },
  {
    id: 13,
    name: 'Kevin Spacey',
    email: 'kevin@example.com',
    status: 'active',
    role: 'Moderator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-12',
    orders: 33
  },
  {
    id: 14,
    name: 'Lisa Simpson',
    email: 'lisa@example.com',
    status: 'pending',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-09',
    orders: 22
  },
  {
    id: 15,
    name: 'Michael Jackson',
    email: 'michael@example.com',
    status: 'active',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-15',
    orders: 47
  },
  {
    id: 16,
    name: 'Natalie Portman',
    email: 'natalie@example.com',
    status: 'active',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-13',
    orders: 38
  },
  {
    id: 17,
    name: 'Oliver Twist',
    email: 'oliver@example.com',
    status: 'inactive',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-06',
    orders: 11
  },
  {
    id: 18,
    name: 'Penelope Cruz',
    email: 'penelope@example.com',
    status: 'active',
    role: 'Moderator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-11',
    orders: 29
  },
  {
    id: 19,
    name: 'Quentin Tarantino',
    email: 'quentin@example.com',
    status: 'pending',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-08',
    orders: 16
  },
  {
    id: 20,
    name: 'Rachel Green',
    email: 'rachel@example.com',
    status: 'active',
    role: 'User',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    lastLogin: '2024-01-16',
    orders: 34
  }
]

// Column configuration
const columns: ColumnConfig[] = [
  {
    key: 'avatar',
    label: 'Avatar',
    type: 'image',
    field: 'avatar',
    width: '80px',
    align: 'center'
  },
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    field: 'name'
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    field: 'email'
  },
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
  },
  {
    key: 'role',
    label: 'Role',
    type: 'text',
    field: 'role'
  },
  {
    key: 'orders',
    label: 'Orders',
    type: 'text',
    field: 'orders',
    align: 'center'
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    type: 'text',
    field: 'lastLogin'
  },
  {
    key: 'actions',
    label: 'Actions',
    type: 'actions',
    width: '200px',
    align: 'center',
    actions: [
      {
        label: 'View',
        icon: <Eye className="h-4 w-4 mr-1" />,
        onClick: (row) => console.log('View:', row),
        variant: 'outline'
      },
      {
        label: 'Edit',
        icon: <Edit className="h-4 w-4 mr-1" />,
        onClick: (row) => console.log('Edit:', row),
        variant: 'default'
      },
      {
        label: 'Delete',
        icon: <Trash className="h-4 w-4 mr-1" />,
        onClick: (row) => console.log('Delete:', row),
        variant: 'destructive'
      }
    ]
  }
]

// Filter configuration
const filters: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' }
    ]
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'Admin' },
      { label: 'Moderator', value: 'Moderator' },
      { label: 'User', value: 'User' }
    ]
  },
  {
    key: 'search',
    label: 'Search',
    type: 'input',
    placeholder: 'Search by name or email...'
  }
]

// Sort options
const sortOptions = {
  name_asc: 'Name (A-Z)',
  name_desc: 'Name (Z-A)',
  email_asc: 'Email (A-Z)',
  email_desc: 'Email (Z-A)',
  lastLogin_newest: 'Last Login (Newest)',
  lastLogin_oldest: 'Last Login (Oldest)',
  orders_high: 'Orders (High to Low)',
  orders_low: 'Orders (Low to High)'
}

// Empty state configuration
const emptyState: EmptyStateConfig = {
  title: 'No users found',
  description: 'Try adjusting your search or filter criteria to find what you\'re looking for.',
  action: () => console.log('Add new user'),
  actionLabel: 'Add New User'
}

export default function TableDemo() {
  const [data, setData] = useState(sampleData)
  const [loading, setLoading] = useState(false)

  const handleAction = (action: TableAction) => {
    console.log('Table action:', action)
    
    switch (action.type) {
      case 'search':
        // Simulate search
        setLoading(true)
        setTimeout(() => {
          if (action.data) {
            const filtered = sampleData.filter(item => 
              item.name.toLowerCase().includes(action.data.toLowerCase()) ||
              item.email.toLowerCase().includes(action.data.toLowerCase())
            )
            setData(filtered)
          } else {
            setData(sampleData)
          }
          setLoading(false)
        }, 500)
        break
        
      case 'filter':
        // Simulate filter
        setLoading(true)
        setTimeout(() => {
          let filtered = sampleData
          if (action.data.status) {
            filtered = filtered.filter(item => item.status === action.data.status)
          }
          if (action.data.role) {
            filtered = filtered.filter(item => item.role === action.data.role)
          }
          setData(filtered)
          setLoading(false)
        }, 500)
        break
        
      case 'sort':
        // Simulate sort
        setLoading(true)
        setTimeout(() => {
          const sorted = [...data].sort((a, b) => {
            switch (action.data) {
              case 'name_asc':
                return a.name.localeCompare(b.name)
              case 'name_desc':
                return b.name.localeCompare(a.name)
              case 'email_asc':
                return a.email.localeCompare(b.email)
              case 'email_desc':
                return b.email.localeCompare(a.email)
              case 'lastLogin_newest':
                return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
              case 'lastLogin_oldest':
                return new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
              case 'orders_high':
                return b.orders - a.orders
              case 'orders_low':
                return a.orders - b.orders
              default:
                return 0
            }
          })
          setData(sorted)
          setLoading(false)
        }, 500)
        break
        
      case 'page':
        console.log('Page changed to:', action.data)
        break
        
             case 'perPage':
         console.log('Per page changed to:', action.data)
         // Reset to first page when changing per page
         setData(sampleData)
         break
    }
  }

  const headerActions = [
    <Button key="add" className="flex items-center gap-2 cursor-pointer">
      <Plus className="h-4 w-4" />
      Add User
    </Button>
  ]

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">DynamicTable Demo</h1>
        <p className="text-muted-foreground">
          A comprehensive, configuration-driven table component with search, filtering, sorting, and pagination.
        </p>
      </div>

      <DynamicTable
        data={data}
        columns={columns}
        filters={filters}
        sortOptions={sortOptions}
        title="User Management"
        description="Manage your application users with advanced filtering and sorting capabilities."
        headerActions={headerActions}
        paginationType="full"
        loading={loading}
        emptyState={emptyState}
        onAction={handleAction}
      />

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Features Demonstrated:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Different column types: text, image, tag, actions</li>
          <li>Search functionality with debouncing</li>
          <li>Filter modal with select and input fields</li>
          <li>Sorting with custom sort options</li>
          <li>Pagination controls</li>
          <li>Loading states with skeleton</li>
          <li>Empty state handling</li>
          <li>Header actions</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </div>
  )
}
