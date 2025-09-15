"use client"

import { DynamicForm, FormFieldConfig, DynamicFormSubmissionError } from '@/components/DynamicForm'
import { Card, CardContent } from '@/components/ui/card'
import { getRoute } from '../../routes'

// Demo form configuration based on the brand create form pattern
const createFormConfig: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Brand Name',
    type: 'input',
    required: true,
    placeholder: 'Enter brand name',
    description: 'The display name for this brand'
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'brand@example.com',
    description: 'Primary email address for this brand'
  },
  {
    name: 'trackingDomain',
    label: 'Tracking Domain',
    type: 'input',
    placeholder: 'https://track.example.com',
    description: 'Tracking domain URL for affiliate links (optional)'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    placeholder: 'Enter password',
    description: 'Password for brand login (minimum 8 characters)'
  },
  {
    name: 'website',
    label: 'Website',
    type: 'input',
    placeholder: 'https://example.com',
    description: 'Brand website URL (optional)',
    colSpan: 2
  },
  {
    name: "logo",
    label: "Brand Logo",
    type: "file",
    required: true,
    description: 'Upload the brand logo here',
    colSpan: 2,
    fileConfig: {
      hint: 'Upload up to 3 images (PNG, JPEG, GIF, WebP) up to 5MB each',
      image: false,
      maxFiles: 1,
      multiple: false,
      maxSize: 5 * 1024 * 1024, // 5MB
      accept: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      boxSizeHeight: 100,
      boxSizeWidth: 100
    }
  },
  {
    name: 'timezone',
    label: 'Timezone',
    type: 'select',
    required: true,
    placeholder: 'Select timezone',
    description: 'Default timezone for this brand',
    options: [
      { label: 'UTC', value: 'UTC' },
      { label: 'America/New_York', value: 'America/New_York' },
      { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
      { label: 'Europe/London', value: 'Europe/London' },
      { label: 'Europe/Paris', value: 'Europe/Paris' },
      { label: 'Asia/Tokyo', value: 'Asia/Tokyo' }
    ]
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    placeholder: 'Select status',
    description: 'Initial status of this brand',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Suspended', value: 'suspended' }
    ]
  }
]

export default function CreateFormDemoPage() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('🚀 Create Form Submit Handler Called!')
    console.log('📋 Form Values:', values)
    
    // Simulate validation errors for testing
    if (values.name === 'admin') {
      throw new DynamicFormSubmissionError('Brand name "admin" is reserved', 'name')
    }
    
    if (values.email && typeof values.email === 'string' && values.email.includes('test')) {
      throw new DynamicFormSubmissionError('Test emails are not allowed', 'email')
    }
    
    if (values.password && typeof values.password === 'string' && values.password.length < 8) {
      throw new DynamicFormSubmissionError('Password must be at least 8 characters', 'password')
    }
    
    // Success case
    console.log('✅ All validations passed! Simulating API call...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('🎉 Brand created successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Create Form Demo</h1>
        <p className="text-lg text-muted-foreground mb-4">
          This demonstrates a create form pattern similar to the admin brand creation
        </p>
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            💡 <strong>Pattern:</strong> This form shows the create pattern with file uploads, validation, and proper error handling
          </p>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Create Form Features:</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li>✅ File upload with preview</li>
          <li>✅ Grid layout with colSpan</li>
          <li>✅ Required field validation</li>
          <li>✅ Custom error messages</li>
          <li>✅ Default values support</li>
          <li>✅ Loading states</li>
          <li>✅ Form submission handling</li>
        </ul>
      </div>
      
      <Card className="w-full">
        <CardContent>
          <DynamicForm
            config={createFormConfig}
            onSubmit={handleSubmit}
            defaultValues={{
              status: 'active',
              timezone: 'UTC'
            }}
            submitText="Create Brand"
            loadingText="Creating..."
            submitButtonAlign="right"
            gridCols={2}
            title="Create New Brand"
            description="Fill out the form below to create a new brand in the system."
          />
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Try submitting with different values to test the validation!</p>
        <p className="mt-2">
          <strong>Test cases:</strong> Use &quot;admin&quot; as brand name, &quot;test&quot; in email, or password under 8 characters
        </p>
      </div>
    </div>
  )
}
