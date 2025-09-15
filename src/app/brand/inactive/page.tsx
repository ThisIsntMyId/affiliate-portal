"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, HelpCircle, Mail } from 'lucide-react'
import { useEffect } from 'react'
import { clearSession } from '@/actions/brand/auth.action'

export default function BrandInactivePage() {
  useEffect(() => {
    clearSession();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Account Inactive
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your brand account is currently inactive
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Your account has been deactivated</span>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Your brand account is currently inactive and you cannot access the dashboard. 
              Please contact our support team to reactivate your account.
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              If you believe this is an error or need assistance, please reach out to our support team.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => console.log('Contact support clicked')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>

            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => window.location.href = '/brand/login'}
            >
              <Mail className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
