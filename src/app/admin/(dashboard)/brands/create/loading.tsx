import { DynamicForm } from '@/components/DynamicForm';
import { Card, CardContent } from '@/components/ui/card';

// Form configuration for the skeleton
const formConfig = [
  {
    name: 'name',
    label: 'Brand Name',
    type: 'input' as const,
    required: true,
    placeholder: 'Enter brand name',
    description: 'The display name for this brand'
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email' as const,
    required: true,
    placeholder: 'brand@example.com',
    description: 'Primary email address for this brand'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    required: true,
    placeholder: 'Enter password',
    description: 'Password for brand login (minimum 8 characters)'
  },
  {
    name: 'website',
    label: 'Website',
    type: 'input' as const,
    placeholder: 'https://example.com',
    description: 'Brand website URL (optional)'
  },
  {
    name: 'trackingDomain',
    label: 'Tracking Domain',
    type: 'input' as const,
    placeholder: 'https://track.example.com',
    description: 'Tracking domain URL for affiliate links (optional)'
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    required: true,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Suspended', value: 'suspended' }
    ],
    description: 'Initial status of this brand'
  },
  {
    name: 'timezone',
    label: 'Timezone',
    type: 'input' as const,
    placeholder: 'UTC',
    description: 'Timezone string (e.g., UTC, America/New_York, Europe/London)'
  }
];

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Brand</h1>
        <p className="text-gray-600 mt-1">Add a new brand to the system</p>
      </div>

      <Card className="w-full">
        <CardContent>
          <DynamicForm
            config={formConfig}
            loading={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
