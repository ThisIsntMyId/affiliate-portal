"use client"

import { DynamicForm, FormFieldConfig, DynamicFormSubmissionError } from '@/components/DynamicForm'
import { Card, CardContent } from '@/components/ui/card'

// Demo form configuration based on the brand edit form pattern
const editFormConfig: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Brand Name',
    type: 'input',
    required: true,
    placeholder: 'Enter brand name',
    description: 'The display name for this brand'
  },
  {
    name: "logo",
    label: "Brand Logo",
    type: "file",
    required: true,
    description: 'Upload the brand logo here',
    fileConfig: {
      hint: 'Upload up to 3 images (PNG, JPEG, GIF, WebP) up to 5MB each',
      image: false,
      maxFiles: 1,
      multiple: false,
      maxSize: 5 * 1024 * 1024, // 5MB
      accept: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    }
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
    name: 'website',
    label: 'Website',
    type: 'input',
    placeholder: 'https://example.com',
    description: 'Brand website URL (optional)'
  },
  {
    name: 'trackingDomain',
    label: 'Tracking Domain',
    type: 'input',
    placeholder: 'https://track.example.com',
    description: 'Tracking domain URL for affiliate links (optional)'
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    placeholder: 'Select status',
    description: 'Current status of this brand',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Suspended', value: 'suspended' }
    ]
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
  }
]

export default function EditFormDemoPage() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('🚀 Edit Form Submit Handler Called!')
    console.log('📋 Form Values:', values)
    
    // Simulate validation errors for testing
    if (values.name === 'admin') {
      throw new DynamicFormSubmissionError('Brand name "admin" is reserved', 'name')
    }
    
    if (values.email && typeof values.email === 'string' && values.email.includes('test')) {
      throw new DynamicFormSubmissionError('Test emails are not allowed', 'email')
    }
    
    // Success case
    console.log('✅ All validations passed! Simulating API call...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('🎉 Brand updated successfully!')
  }

  // Simulate existing brand data
  const defaultValues = {
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    website: 'https://acme.com',
    trackingDomain: 'https://track.acme.com',
    status: 'active',
    timezone: 'America/New_York',
    logo: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=ACME'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Edit Form Demo</h1>
        <p className="text-lg text-muted-foreground mb-4">
          This demonstrates an edit form pattern similar to the admin brand editing
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Pattern:</strong> This form shows the edit pattern with pre-filled data, file uploads, and update handling
          </p>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Edit Form Features:</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li>✅ Pre-filled with existing data</li>
          <li>✅ File upload with existing file preview</li>
          <li>✅ Update-specific validation</li>
          <li>✅ Proper error handling</li>
          <li>✅ Loading states during update</li>
          <li>✅ Form submission handling</li>
          <li>✅ Success feedback</li>
        </ul>
      </div>
      
      <Card className="w-full">
        <CardContent>
          <DynamicForm
            config={editFormConfig}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            submitText="Update Brand"
            loadingText="Updating..."
            submitButtonAlign="right"
          />
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Try submitting with different values to test the validation!</p>
        <p className="mt-2">
          <strong>Test cases:</strong> Use &quot;admin&quot; as brand name or &quot;test&quot; in email
        </p>
      </div>
    </div>
  )
}
