"use client";

import { DynamicTable, TableAction } from '@/components/DynamicTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data for the table demo
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15',
    department: 'Engineering'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-14',
    department: 'Marketing'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'Inactive',
    lastLogin: '2024-01-10',
    department: 'Support'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2024-01-15',
    department: 'Sales'
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15',
    department: 'Engineering'
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
      type: 'text' as const
    },
    {
      key: 'role',
      label: 'Role',
      type: 'tag' as const,
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
      tagColors: {
        'Active': 'bg-green-100 text-green-800',
        'Inactive': 'bg-gray-100 text-gray-800'
      } as Record<string, string>
    },
    {
      key: 'department',
      label: 'Department',
      type: 'text' as const
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      type: 'custom' as const,
      render: (row: Record<string, unknown>) => new Date(String(row.lastLogin)).toLocaleDateString()
    }
  ],
  data: sampleData,
  searchable: true,
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

      <Card>
        <CardHeader>
          <CardTitle>User Management Table</CardTitle>
          <CardDescription>
            A comprehensive example showing user data with various column types and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicTable {...tableConfig} />
        </CardContent>
      </Card>

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