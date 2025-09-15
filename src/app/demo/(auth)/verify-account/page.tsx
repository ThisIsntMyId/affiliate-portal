"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Clock, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function VerifyAccountPage() {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

  const handleStatusChange = (status: 'pending' | 'approved' | 'rejected') => {
    setVerificationStatus(status)
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Account Verification
          </CardTitle>
          <CardDescription className="text-gray-600">
            Demo of account verification states and patterns
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Toggle for Demo */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Status Toggle:</h3>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                variant={verificationStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </Button>
              <Button 
                size="sm" 
                variant={verificationStatus === 'approved' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('approved')}
              >
                Approved
              </Button>
              <Button 
                size="sm" 
                variant={verificationStatus === 'rejected' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('rejected')}
              >
                Rejected
              </Button>
            </div>
          </div>

          {/* Dynamic Content Based on Status */}
          {verificationStatus === 'pending' && (
            <>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Please wait while we verify your account details</span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  We&apos;re reviewing your account information to ensure everything is in order. 
                  This process typically takes 1-2 business days.
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'approved' && (
            <>
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Your account has been verified successfully!</span>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Congratulations! Your account is now active and you can access all features.
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'rejected' && (
            <>
              <div className="flex items-center justify-center space-x-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Account verification was unsuccessful</span>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Unfortunately, we couldn&apos;t verify your account. Please check your information and try again.
                </p>
              </div>
            </>
          )}
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              This demonstrates the verification page patterns used in the affiliate portal system.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => console.log('Contact support clicked')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Verification Page Features:</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Dynamic status display based on verification state</li>
          <li>• Clear visual indicators for different states</li>
          <li>• Appropriate messaging for each status</li>
          <li>• Support contact integration</li>
          <li>• Responsive design patterns</li>
        </ul>
      </div>
    </div>
  )
}
