"use client"

import { getRoute } from '@/app/demo/routes'
import { DynamicTable, TableAction, ColumnConfig } from '@/components/DynamicTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Globe, Search } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'

// Sample brand data for the advanced table demo
const sampleBrandData = [
  {
    id: 1,
    code: 'ACME001',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    website: 'https://acme.com',
    status: 'active',
    trackingDomain: 'https://track.acme.com',
    timezone: 'America/New_York',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 2,
    code: 'TECH002',
    name: 'Tech Solutions Inc',
    email: 'info@techsolutions.com',
    website: 'https://techsolutions.com',
    status: 'active',
    trackingDomain: 'https://track.techsolutions.com',
    timezone: 'America/Los_Angeles',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T11:20:00Z'
  },
  {
    id: 3,
    code: 'INNO003',
    name: 'Innovation Labs',
    email: 'hello@innovationlabs.com',
    website: 'https://innovationlabs.com',
    status: 'inactive',
    trackingDomain: 'https://track.innovationlabs.com',
    timezone: 'Europe/London',
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-12T13:30:00Z'
  },
  {
    id: 4,
    code: 'GLOB004',
    name: 'Global Enterprises',
    email: 'contact@globalenterprises.com',
    website: 'https://globalenterprises.com',
    status: 'suspended',
    trackingDomain: 'https://track.globalenterprises.com',
    timezone: 'Asia/Tokyo',
    createdAt: '2023-12-20T08:00:00Z',
    updatedAt: '2024-01-08T10:15:00Z'
  },
  {
    id: 5,
    code: 'STAR005',
    name: 'Star Industries',
    email: 'info@starindustries.com',
    website: 'https://starindustries.com',
    status: 'active',
    trackingDomain: 'https://track.starindustries.com',
    timezone: 'America/Chicago',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-19T16:30:00Z'
  }
]

// Table configuration based on the admin brand table pattern
const tableConfig: ColumnConfig[] = [
  {
    key: 'code',
    field: 'code',
    label: 'Code',
    type: 'text',
  },
  {
    key: 'name',
    field: 'name',
    label: 'Brand Name',
    type: 'text',
  },
  {
    key: 'email',
    field: 'email',
    label: 'Email',
    type: 'text',
  },
  {
    key: 'website',
    field: 'website',
    label: 'Website',
    type: 'text',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (row: any) => {
      const website = row.website as string;
      if (!website) return <span className="text-gray-400">-</span>;
      return (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {website}
        </a>
      );
    }
  },
  {
    key: 'status',
    field: 'status',
    label: 'Status',
    type: 'tag',
    tagColors: {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-red-100 text-red-800'
    },
    tagLabel: {
      'active': 'Active',
      'inactive': 'Inactive',
      'suspended': 'Suspended'
    }
  },
  {
    key: 'actions',
    label: 'Actions',
    type: 'actions',
    actions: [
      {
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        url: (row: any) => getRoute('demo.forms.edit', { id: row.id }),
        variant: 'outline' as const
      },
      {
        label: 'Visit',
        icon: <Globe className="h-4 w-4" />,
        url: 'website',
        variant: 'default' as const,
        newTab: true
      }
    ]
  }
]

export default function AdvancedTableDemoPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const status = searchParams.get('status') || '';

  const sortOptions = {
    'name-asc': 'Name (A-Z)',
    'name-desc': 'Name (Z-A)',
    'email-asc': 'Email (A-Z)',
    'email-desc': 'Email (Z-A)',
    'code-asc': 'Code (A-Z)',
    'code-desc': 'Code (Z-A)',
    'createdAt-asc': 'Created (Oldest)',
    'createdAt-desc': 'Created (Newest)'
  };

  const handleTableAction = (action: TableAction) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

    switch (action.type) {
      case 'search':
        if(action.data) currentParams.set('search', action.data as string);
        else currentParams.delete('search');
        currentParams.set('page', '1');
        break;
      
      case 'filter':
        const { key, value } = action.data as { key: string; value: string };
        if (value && value !== 'all') {
          currentParams.set(key, value);
        } else {
          currentParams.delete(key);
        }
        currentParams.set('page', '1');
        break;

      case 'filterBatch':
        const batchFilters = action.data as Record<string, unknown>;
        currentParams.delete('status');
        Object.entries(batchFilters).forEach(([key, value]) => {
          if (value && value !== 'all' && value !== '') {
            currentParams.set(key, String(value));
          }
        });
        currentParams.set('page', '1');
        break;

      case 'sort':
        if(action.data) currentParams.set('sort', action.data as string);
        else currentParams.delete('sort');
        break;
      case 'page':
        currentParams.set('page', action.data.toString());
        break;
      case 'perPage':
        currentParams.set('limit', action.data.toString());
        currentParams.set('page', '1');
        break;
    }

    startTransition(() => {
      router.push(`${pathname}?${currentParams.toString()}`);
    })
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Advanced Table Demo</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Advanced table features with filtering, sorting, and actions - based on admin brand table patterns
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Pattern:</strong> This table demonstrates the advanced patterns used in the admin brand management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Features</CardTitle>
            <CardDescription>What this table demonstrates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Quick filters (inline)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Advanced filter modal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Custom cell rendering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Action buttons with URLs</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtering System</CardTitle>
            <CardDescription>Advanced filtering capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Status quick filter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Global search</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Batch filter updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>URL state management</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions & Navigation</CardTitle>
            <CardDescription>Interactive elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Edit action with routing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>External link actions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Loading states</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Empty state handling</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Brand Management Table</h2>
          <p className="text-muted-foreground">
            Advanced table showing brand data with filtering, sorting, and action patterns from the admin system
          </p>
        </div>
        
        <Card className="w-full">
          <CardContent>
            <DynamicTable
              loading={isPending}
              data={sampleBrandData}
              pagination={{
                page: 1,
                limit: 10,
                total: sampleBrandData.length,
                totalPages: 1,
                hasNext: true,
                hasPrev: true
              }}
              pageLimits={[2, 5, 10, 20, 50, 100]}
              searchQuery={search}
              sortBy={sort}
              sortOptions={sortOptions}
              columns={tableConfig}
              searchable={true}
              filterable={true}
              sortable={true}
              filterValues={{ status }}
              quickFilters={[
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { label: 'All Statuses', value: 'all' },
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Suspended', value: 'suspended' }
                  ]
                }
              ]}
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { label: 'All Statuses', value: 'all' },
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Suspended', value: 'suspended' }
                  ]
                }
              ]}
              onAction={handleTableAction}
              emptyState={{
                title: 'No brands found',
                description: 'There are no brands to display at the moment.',
                icon: <Search className="h-8 w-8" />,
                action: () => router.push(getRoute('demo.forms.create')),
                actionLabel: 'Create Brand'
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Advanced Table Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Filtering System:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Quick filters for common selections</li>
              <li>• Advanced filter modal for complex queries</li>
              <li>• URL state management for bookmarkable filters</li>
              <li>• Batch filter updates</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Action System:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Dynamic action buttons with icons</li>
              <li>• URL-based navigation actions</li>
              <li>• External link actions with new tab</li>
              <li>• Loading states during transitions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
