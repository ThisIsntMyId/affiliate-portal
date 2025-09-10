"use client"

import { DynamicForm, FormFieldConfig } from '@/components/DynamicForm'

const loginFormConfig: FormFieldConfig[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    description: "Enter your affiliate email address"
  },
  {
    name: "password",
    label: "Password",
    type: "input",
    placeholder: "Enter your password",
    required: true,
    description: "Enter your affiliate password"
  }
]

export default function AffiliateLoginPage() {
  const handleLogin = async (values: Record<string, unknown>) => {
    console.log('🚀 Affiliate Login Form Submitted!')
    console.log('📧 Email:', values.email)
    console.log('🔐 Password:', values.password)
    console.log('📋 All Values:', values)
  }

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="mb-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to Affiliate Panel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your affiliate credentials to access the system
        </p>
      </div>
      
      <DynamicForm
        config={loginFormConfig}
        onSubmit={handleLogin}
        submitText="Sign In"
        loadingText="Signing in..."
        submitButtonAlign="full"
        showCard={false}
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/affiliate/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  )
}
