import { LoginForm } from './LoginForm'

export default function AdminLoginPage() {

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
      
      <LoginForm />
    </div>
  )
}