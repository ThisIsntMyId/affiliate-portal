"use client"

import { DynamicForm, FormFieldConfig, DynamicFormSubmissionError } from '@/components/DynamicForm'
import { DemoNavigation } from '@/components/demo-navigation'

const demoConfig: FormFieldConfig[] = [
  // Basic Input Fields
  {
    name: "username",
    label: "Username",
    type: "input",
    placeholder: "Enter your username",
    required: true,
    description: "This will be your public display name"
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    description: "We'll never share your email with anyone"
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    required: false,
    description: "Your current age in years"
  },
  
  // Input with Prefix/Suffix
  {
    name: "price",
    label: "Product Price",
    type: "number",
    prefix: "$",
    placeholder: "0.00",
    required: true,
    description: "Product price in USD"
  },
  {
    name: "weight",
    label: "Product Weight",
    type: "number",
    suffix: "kg",
    placeholder: "0.0",
    required: false,
    description: "Product weight in kilograms"
  },
  
  // Text Area
  {
    name: "bio",
    label: "Biography",
    type: "textarea",
    placeholder: "Tell us about yourself...",
    required: false,
    description: "A short description about you (optional)"
  },
  
  // Selection Fields
  {
    name: "country",
    label: "Country",
    type: "select",
    placeholder: "Select your country",
    required: true,
    description: "Where are you located?",
    options: [
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
      { label: "Germany", value: "de" },
      { label: "France", value: "fr" },
      { label: "Japan", value: "jp" },
      { label: "Australia", value: "au" }
    ]
  },
  {
    name: "languages",
    label: "Programming Languages",
    type: "multiselect",
    placeholder: "Select languages you know",
    required: true,
    description: "Choose all programming languages you're familiar with",
    options: [
      { label: "JavaScript", value: "js" },
      { label: "TypeScript", value: "ts" },
      { label: "Python", value: "py" },
      { label: "Java", value: "java" },
      { label: "C++", value: "cpp" },
      { label: "Go", value: "go" },
      { label: "Rust", value: "rust" },
      { label: "PHP", value: "php" }
    ]
  },
  
  // Boolean Fields
  {
    name: "notifications",
    label: "Email Notifications",
    type: "checkbox",
    required: false,
    description: "Receive email notifications about updates and new features"
  },
  {
    name: "interests",
    label: "Areas of Interest",
    type: "checkboxgroup",
    required: false,
    description: "Select all areas that interest you",
    options: [
      { label: "Web Development", value: "web" },
      { label: "Mobile Development", value: "mobile" },
      { label: "Data Science", value: "data" },
      { label: "Machine Learning", value: "ml" },
      { label: "DevOps", value: "devops" },
      { label: "UI/UX Design", value: "design" }
    ]
  },
  {
    name: "marketing",
    label: "Marketing Emails",
    type: "switch",
    required: false,
    description: "Receive promotional emails and special offers"
  },
  
  // Date Field
  {
    name: "birthdate",
    label: "Date of Birth",
    type: "date",
    placeholder: "Pick a date",
    required: true,
    description: "Your date of birth for verification purposes"
  },
  
  // Radio Group
  {
    name: "gender",
    label: "Gender",
    type: "radio",
    required: true,
    description: "Please select your gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Non-binary", value: "non-binary" },
      { label: "Other", value: "other" },
      { label: "Prefer not to say", value: "prefer-not" }
    ]
  },
  
  // File Upload
  {
    name: "avatar",
    label: "Profile Picture",
    type: "file",
    required: false,
    description: "Upload your profile picture (JPG, PNG, GIF up to 5MB)",
    fileConfig: {
      multiple: false,
      accept: "image/*",
      maxSize: 5 * 1024 * 1024 // 5MB
    }
  },
  {
    name: "gallery",
    label: "Photo Gallery",
    type: "image",
    required: false,
    description: "Upload multiple images for your gallery (JPG, PNG, GIF up to 10MB each)",
    fileConfig: {
      multiple: true,
      accept: "image/*",
      maxSize: 10 * 1024 * 1024 // 10MB
    }
  },
  {
    name: "documents",
    label: "Supporting Documents",
    type: "file",
    required: false,
    description: "Upload supporting documents (PDF, DOC, DOCX up to 10MB)",
    fileConfig: {
      multiple: true,
      accept: ".pdf,.doc,.docx",
      maxSize: 10 * 1024 * 1024 // 10MB
    }
  },
  
  // Combobox (Searchable Select)
  {
    name: "framework",
    label: "Favorite Framework",
    type: "combobox",
    placeholder: "Search frameworks...",
    required: true,
    description: "Search and select your favorite web framework",
    options: [
      { label: "React", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
      { label: "Next.js", value: "nextjs" },
      { label: "Nuxt.js", value: "nuxt" },
      { label: "Remix", value: "remix" },
      { label: "Astro", value: "astro" }
    ]
  }
]

export default function DemoPage() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('🚀 DynamicForm Submit Handler Called!')
    console.log('📋 Form Values:', values)
    
    // Simulate some validation errors for testing
    console.log('\n🧪 Testing Error Handling...')
    
    if (values.username === 'admin') {
      console.log('❌ Throwing field error for username')
      throw new DynamicFormSubmissionError('Username "admin" is reserved', 'username')
    }
    
    if (values.email && typeof values.email === 'string' && values.email.includes('test')) {
      console.log('❌ Throwing field error for email')
      throw new DynamicFormSubmissionError('Test emails are not allowed', 'email')
    }
    
    if (values.price && typeof values.price === 'number' && values.price < 0) {
      console.log('❌ Throwing form-level error for negative price')
      throw new DynamicFormSubmissionError('Price cannot be negative')
    }
    
    if (values.age && typeof values.age === 'number' && values.age < 18) {
      console.log('❌ Throwing multiple field errors for age validation')
      throw new DynamicFormSubmissionError('Multiple validation errors', {
        age: 'Must be at least 18 years old',
        username: 'Username must be appropriate for age'
      })
    }
    
    // Success case
    console.log('✅ All validations passed! Simulating API call...')
    await new Promise(resolve => setTimeout(resolve, 5000))
    console.log('🎉 Form submitted successfully!')
  }

  const defaultValues = {
    username: "john_doe",
    email: "john@example.com",
    age: 25,
    price: 99,
    weight: 2,
    bio: "I'm a software developer passionate about building great user experiences.",
    country: "us",
    languages: ["js", "ts", "py"],
    notifications: true,
    marketing: false,
    birthdate: new Date('1998-05-15'),
    gender: "male",
    framework: "react"
  }

  return (
    <>
      <DemoNavigation />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">DynamicForm Demo</h1>
          <p className="text-lg text-muted-foreground mb-4">
            This demonstrates all the field types supported by the DynamicForm component
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Tip:</strong> Open your browser console to see detailed logging when you submit the form!
            </p>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Features Demonstrated:</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li>✅ 12 different input types</li>
            <li>✅ Prefix/suffix support for numbers</li>
            <li>✅ Auto-generated validation schemas</li>
            <li>✅ File upload with drag & drop</li>
            <li>✅ Error handling (field-level & form-level)</li>
            <li>✅ Default values support</li>
            <li>✅ Responsive design</li>
            <li>✅ TypeScript support</li>
          </ul>
        </div>
        
        <DynamicForm
          config={demoConfig}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitText="Save Profile"
          loadingText="Saving Profile..."
          submitButtonAlign="full"
          title="User Profile Form"
          description="Complete your profile information below. All fields marked with * are required."
        />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Try submitting with different values to test the error handling!</p>
          <p className="mt-2">
            <strong>Test cases:</strong> Use "admin" as username, "test" in email, negative price, or age under 18
          </p>
        </div>
        
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-center mb-6">Submit Button Alignment Examples</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Full Width (Default)</h3>
              <DynamicForm
                config={demoConfig.slice(0, 3)} // Just show first 3 fields for demo
                onSubmit={handleSubmit}
                submitText="Submit Full Width"
                loadingText="Submitting..."
                submitButtonAlign="full"
                title="Basic Information"
                description="Enter your basic details below."
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Left Aligned</h3>
              <DynamicForm
                config={demoConfig.slice(0, 3)} // Just show first 3 fields for demo
                onSubmit={handleSubmit}
                submitText="Submit Left"
                loadingText="Submitting..."
                submitButtonAlign="left"
                title="Contact Details"
                description="Provide your contact information."
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Right Aligned</h3>
              <DynamicForm
                config={demoConfig.slice(0, 3)} // Just show first 3 fields for demo
                onSubmit={handleSubmit}
                submitText="Submit Right"
                loadingText="Submitting..."
                submitButtonAlign="right"
                title="Personal Info"
                description="Tell us about yourself."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
