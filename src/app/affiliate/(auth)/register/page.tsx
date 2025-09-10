"use client"

import { DynamicForm, FormFieldConfig } from '@/components/DynamicForm'

const registerFormConfig: FormFieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "input",
    placeholder: "Enter your full name",
    required: true,
    description: "Enter your complete name"
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    description: "Enter your email address"
  },
  {
    name: "password",
    label: "Password",
    type: "input",
    placeholder: "Enter your password",
    required: true,
    description: "Create a strong password"
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "input",
    placeholder: "Confirm your password",
    required: true,
    description: "Re-enter your password to confirm"
  },
  {
    name: "brandCode",
    label: "Brand Code",
    type: "input",
    placeholder: "Enter brand code",
    required: true,
    description: "Enter the brand code provided by your brand"
  }
]

export default function AffiliateRegisterPage() {
  const handleRegister = async (values: Record<string, unknown>) => {
    console.log('🚀 Affiliate Registration Form Submitted!')
    console.log('👤 Name:', values.name)
    console.log('📧 Email:', values.email)
    console.log('🔐 Password:', values.password)
    console.log('🏷️ Brand Code:', values.brandCode)
    console.log('📋 All Values:', values)
  }

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="mb-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Create Affiliate Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join as an affiliate partner and start earning
        </p>
      </div>
      
      <DynamicForm
        config={registerFormConfig}
        onSubmit={handleRegister}
        submitText="Create Account"
        loadingText="Creating account..."
        submitButtonAlign="full"
        showCard={false}
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/affiliate/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}
