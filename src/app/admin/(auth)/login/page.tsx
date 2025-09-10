"use client"

import { DynamicForm, FormFieldConfig } from '@/components/DynamicForm'

const loginFormConfig: FormFieldConfig[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    description: "Enter your admin email address"
  },
  {
    name: "password",
    label: "Password",
    type: "input",
    placeholder: "Enter your password",
    required: true,
    description: "Enter your admin password"
  }
]

export default function AdminLoginPage() {
  const handleLogin = async (values: Record<string, unknown>) => {
    console.log('🚀 Admin Login Form Submitted!')
    console.log('📧 Email:', values.email)
    console.log('🔐 Password:', values.password)
    console.log('📋 All Values:', values)
  }

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="mb-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to Admin Panel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your admin credentials to access the system
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
    </div>
  )
}
