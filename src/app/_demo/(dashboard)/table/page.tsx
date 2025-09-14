"use client";

import { DynamicTable, TableAction } from '@/components/DynamicTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';

// Sample data for the table demo
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15',
    department: 'Engineering',
    salary: 95000,
    joinDate: '2022-03-15',
    location: 'San Francisco, CA',
    manager: 'Sarah Wilson',
    teamSize: 8
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 234-5678',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-14',
    department: 'Marketing',
    salary: 75000,
    joinDate: '2023-01-10',
    location: 'New York, NY',
    manager: 'Mike Johnson',
    teamSize: 5
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 (555) 345-6789',
    role: 'Moderator',
    status: 'Inactive',
    lastLogin: '2024-01-10',
    department: 'Support',
    salary: 65000,
    joinDate: '2021-11-22',
    location: 'Austin, TX',
    manager: 'Lisa Brown',
    teamSize: 12
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1 (555) 456-7890',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-15',
    department: 'Sales',
    salary: 80000,
    joinDate: '2023-06-01',
    location: 'Chicago, IL',
    manager: 'David Lee',
    teamSize: 6
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    phone: '+1 (555) 567-8901',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15',
    department: 'Engineering',
    salary: 105000,
    joinDate: '2020-09-15',
    location: 'Seattle, WA',
    manager: 'Sarah Wilson',
    teamSize: 8
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana@example.com',
    phone: '+1 (555) 678-9012',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-12',
    department: 'HR',
    salary: 70000,
    joinDate: '2023-08-20',
    location: 'Denver, CO',
    manager: 'Tom Anderson',
    teamSize: 4
  },
  {
    id: 7,
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    phone: '+1 (555) 789-0123',
    role: 'Moderator',
    status: 'Active',
    lastLogin: '2024-01-13',
    department: 'Support',
    salary: 68000,
    joinDate: '2022-12-05',
    location: 'Miami, FL',
    manager: 'Lisa Brown',
    teamSize: 12
  },
  {
    id: 8,
    name: 'Fiona Green',
    email: 'fiona@example.com',
    phone: '+1 (555) 890-1234',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2024-01-08',
    department: 'Marketing',
    salary: 72000,
    joinDate: '2023-03-10',
    location: 'Portland, OR',
    manager: 'Mike Johnson',
    teamSize: 5
  }
];

const tableConfig = {
  columns: [
    {
      key: 'name',
      label: 'Name',
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
      key: 'phone',
      label: 'Phone',
      type: 'text' as const,
      field: 'phone'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'tag' as const,
      field: 'role',
      tagColors: {
        'Admin': 'bg-red-100 text-red-800',
        'Moderator': 'bg-yellow-100 text-yellow-800',
        'User': 'bg-green-100 text-green-800'
      } as Record<string, string>
    },
    {
      key: 'status',
      label: 'Status',
      type: 'tag' as const,
      field: 'status',
      tagColors: {
        'Active': 'bg-green-100 text-green-800',
        'Inactive': 'bg-gray-100 text-gray-800'
      } as Record<string, string>
    },
    {
      key: 'department',
      label: 'Department',
      type: 'text' as const,
      field: 'department'
    },
    {
      key: 'salary',
      label: 'Salary',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono">
          ${Number(row.salary).toLocaleString()}
        </span>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => new Date(String(row.joinDate)).toLocaleDateString()
    },
    {
      key: 'location',
      label: 'Location',
      type: 'text' as const,
      field: 'location'
    },
    {
      key: 'manager',
      label: 'Manager',
      type: 'text' as const,
      field: 'manager'
    },
    {
      key: 'teamSize',
      label: 'Team Size',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => (
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {String(row.teamSize)}
        </span>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => new Date(String(row.lastLogin)).toLocaleDateString()
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
            console.log('Edit user:', row);
            alert(`Edit user: ${row.name}`);
          },
          variant: 'outline' as const
        },
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          onClick: (row: Record<string, unknown>) => {
            console.log('Delete user:', row);
            if (confirm(`Are you sure you want to delete ${row.name}?`)) {
              alert(`Deleted user: ${row.name}`);
            }
          },
          variant: 'destructive' as const
        }
      ]
    }
  ],
  data: sampleData,
  filters: [
    {
      key: 'department',
      label: 'Department',
      type: 'select' as const,
      options: [
        { label: 'All Departments', value: 'all' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Support', value: 'Support' },
        { label: 'Sales', value: 'Sales' },
        { label: 'HR', value: 'HR' }
      ]
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { label: 'All Roles', value: 'all' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Moderator', value: 'Moderator' },
        { label: 'User', value: 'User' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      key: 'salaryRange',
      label: 'Salary Range',
      type: 'select' as const,
      options: [
        { label: 'All Salaries', value: 'all' },
        { label: 'Under $70k', value: 'under-70k' },
        { label: '$70k - $85k', value: '70k-85k' },
        { label: '$85k - $100k', value: '85k-100k' },
        { label: 'Over $100k', value: 'over-100k' }
      ]
    }
  ],
  sortOptions: {
    'name-asc': 'Name (A-Z)',
    'name-desc': 'Name (Z-A)',
    'email-asc': 'Email (A-Z)',
    'email-desc': 'Email (Z-A)',
    'salary-asc': 'Salary (Low to High)',
    'salary-desc': 'Salary (High to Low)',
    'joinDate-asc': 'Join Date (Oldest)',
    'joinDate-desc': 'Join Date (Newest)',
    'lastLogin-asc': 'Last Login (Oldest)',
    'lastLogin-desc': 'Last Login (Newest)'
  },
  searchable: true,
  filterable: true,
  sortable: true,
  pagination: {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true
  },
  onAction: (action: TableAction) => {
    console.log('Table action:', action);
  }
};

export default function TableDemoPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dynamic Table Demo</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Interactive data tables with sorting, searching, and pagination
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
            <CardDescription>What this table demonstrates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sortable columns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Global search</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Custom cell rendering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Responsive design</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Pagination controls</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Types</CardTitle>
            <CardDescription>Different data representations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Text with avatars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Status badges</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Role indicators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Date formatting</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactions</CardTitle>
            <CardDescription>User interactions available</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Click headers to sort</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Search across all columns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Change page size</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Quick page navigation</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">User Management Table</h2>
          <p className="text-muted-foreground">
            A comprehensive example showing user data with various column types and interactions
          </p>
        </div>
        <DynamicTable {...tableConfig} />
      </div>

      <div className="bg-muted/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Table Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Column Configuration:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Custom cell rendering with React components</li>
              <li>• Sortable columns with visual indicators</li>
              <li>• Flexible data types (text, badges, avatars)</li>
              <li>• Responsive column behavior</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Table Features:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Global search across all columns</li>
              <li>• Pagination with size options</li>
              <li>• Loading states and error handling</li>
              <li>• TypeScript support for type safety</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}