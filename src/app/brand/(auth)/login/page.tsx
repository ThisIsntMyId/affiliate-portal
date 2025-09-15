"use client"

import { LoginForm } from './LoginForm'

export default function BrandLoginPage() {
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="mb-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to Brand Panel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your brand credentials to access the system
        </p>
      </div>
      
      <LoginForm />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Contact Admin
          </a>
        </p>
      </div>
    </div>
  )
}
